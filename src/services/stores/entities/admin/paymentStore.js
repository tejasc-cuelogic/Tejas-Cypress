import { observable, action, computed, toJS, decorate } from 'mobx';
import { orderBy, get, findIndex, pick, forEach, remove } from 'lodash';
import moment from 'moment';
import { FormValidator as Validator, ClientDb, DataFormatter } from '../../../../helper';
import { GqlClient as client } from '../../../../api/gqlApi';
import { adminPaymentsIssuerList, updatePaymentIssuer, adminPaymentSendIssuerDraftNotice, adminPaymentSendGoldStarDraftInstructions } from '../../queries/Repayment';
import { PAYMENT, ACTION } from '../../../constants/payment';
import { uiStore } from '../../index';
import DataModelStore, { decorateDefault } from '../shared/dataModelStore';
import Helper from '../../../../helper/utility';

export class PaymentStore extends DataModelStore {
  constructor() {
    super({ adminPaymentsIssuerList, updatePaymentIssuer, adminPaymentSendIssuerDraftNotice, adminPaymentSendGoldStarDraftInstructions });
  }

  data = [];

  apiHit = false;

  initialData = [];

  PAYMENT_FRM = Validator.prepareFormObject(PAYMENT);

  ACTION_FRM = Validator.prepareFormObject(ACTION);

  sortOrderRP = {
    column: null,
    direction: 'asc',
  }

  sortOrderSP = {
    column: null,
    direction: 'asc',
  }

  sortOrderTN = {
    column: null,
    direction: 'asc',
  }

  sortOrderRSN = {
    column: null,
    direction: 'asc',
  }

  selectedOffering = null;

  sendEmailOptionVisibility = false;

  setSortingOrder = (column = null, direction = null, key) => {
    this[key] = {
      column,
      direction,
    };
  }

  initRequest = () => {
    if (!this.apiHit) {
      this.executeQuery({
        query: 'adminPaymentsIssuerList',
        setLoader: 'adminPaymentsIssuerList',
      }).then((res) => {
        this.setDb(res.adminPaymentsIssuerList);
        this.setFieldValue('apiHit', true);
      });
    }
  };

  paymentCtaHandlers = mutation => new Promise((resolve) => {
    let variables = { ...toJS(Validator.evaluateFormData(this.ACTION_FRM.fields)) };
    variables = { ...variables, sendEmail: !['issuer', 'goldstar'].includes(variables.scope) ? true : variables.sendEmail };
    this.executeMutation({
      mutation,
      setLoader: mutation,
      variables,
    }).then((res) => {
      resolve(res);
    });
  });

  setDb = (data) => {
    this.setFieldValue('initialData', data);
    this.setFieldValue('data', ClientDb.initiateDb(data, true));
  }

  getOfferingBySlug = (id, paymentType) => {
    const res = this.data.find(payment => payment.offering.offeringSlug === id);
    this.selectedOffering = res;
    this.PAYMENT_FRM = Validator.setFormData(this.PAYMENT_FRM, res);
    this.updatePaymentDetailsFormRules(paymentType);
    this.validateForm('PAYMENT_FRM');
  }

  updatePaymentDetailsFormRules = (tab) => {
    const securities = get(this.selectedOffering, 'offering.keyTerms.securities');
    let ruleDateList = [];
    if (tab === 'issuers') {
      ruleDateList = ['expectedOpsDate', 'operationsDate', 'expectedPaymentDate', 'firstPaymentDate'];
    } else if (tab === 'tracker' && securities === 'REVENUE_SHARING_NOTE') {
      ruleDateList = ['anticipatedOpenDate', 'operationsDate'];
    }
    const formFields = this.PAYMENT_FRM;
    forEach(formFields.fields, (f, key) => {
      formFields.fields[key].rule = key === 'shorthandBusinessName' ? 'required' : ruleDateList.includes(key) ? 'date' : 'optional';
    });
    this.setFieldValue('PAYMENT_FRM', formFields);
  }

  updatePayment = type => new Promise((resolve) => {
    uiStore.setProgress();
    const id = get(this.selectedOffering, 'offering.id');
    const security = get(this.selectedOffering, 'offering.keyTerms.securities');
    let variables = Helper.replaceKeysDeep(toJS(Validator.evaluateFormData(this.PAYMENT_FRM.fields)), { expectedOpsDate: 'launchExpectedOpsDate', expectedPaymentDate: 'keyTermsAnticipatedPaymentStartDate', firstPaymentDate: 'repaymentStartDate', payments: 'paymentsContactEmail' });
    variables = variables.paymentsContactEmail ? { ...variables, paymentsContactEmail: (variables.paymentsContactEmail.split(',').map(p => p.trim())).join(', ') } : { ...variables };
    let pickKeyList = type === 'issuers' ? ['launchExpectedOpsDate', 'operationsDate', 'keyTermsAnticipatedPaymentStartDate', 'repaymentStartDate', 'monthlyPayment', 'paymentsContactEmail'] : ['startupPeriod', 'paymentStartDateCalc', 'amountDue', 'inDefault', 'sendNotification', 'draftDate'];
    pickKeyList = type === 'tracker' && security === 'REVENUE_SHARING_NOTE' ? [...pickKeyList, 'anticipatedOpenDate', 'operationsDate', 'minPaymentStartDateCalc'] : pickKeyList;
    variables = pick(variables, pickKeyList);
    forEach(variables, (d, key) => {
      if (d === '') {
        variables[key] = null;
      }
    });
    client
      .mutate({
        mutation: updatePaymentIssuer,
        variables: { offeringId: id, paymentIssuerDetailsInput: { ...variables } },
      })
      .then((res) => {
        Helper.toast('Payment updated successfully.', 'success');
        this.updatePaymentList(id, get(res, 'data.updatePaymentIssuer'));
        resolve();
      })
      .catch(() => {
        Helper.toast('Error while updating payment.', 'error');
      })
      .finally(() => {
        uiStore.setProgress(false);
      });
  });

  updatePaymentList = (id, res) => {
    const data = [...toJS(this.initialData)];
    const paymentIndex = findIndex(data, d => d.offering.id === id);
    if (paymentIndex !== -1) {
      const newData = {
        offering: { ...res },
        sinkingFundBalance: data.sinkingFundBalance,
      };
      this.initialData[paymentIndex] = newData;
      this.setFieldValue('data', ClientDb.initiateDb(this.initialData, true));
    }
  }

  calculateDraftDate = () => {
    const draftDay = this.PAYMENT_FRM.fields.draftDay.value;
    if (draftDay) {
      const date = DataFormatter.addBusinessDays(moment().format('MM/01/YYYY'), draftDay);
      const dateVal = DataFormatter.diffDays(date, false, true) > 0 ? moment(date).format('MM/DD/YYYY') : moment(date).add(1, 'month').subtract(1, 'day').format('MM/DD/YYYY');
      this.setFieldValue('PAYMENT_FRM', dateVal, 'fields.draftDate.value');
    } else {
      this.setFieldValue('PAYMENT_FRM', null, 'fields.draftDate.value');
    }
  }

  // eslint-disable-next-line consistent-return
  calculateFormula = (type, title, params, forceAssign = false) => {
    let data = '';
    const { hardCloseDate, firstPaymentDate, startupPeriod, actualOpeningDate, anticipatedOpenDate, term } = params;
    // eslint-disable-next-line default-case
    switch (type) {
      case 'TERM_NOTE':
        // eslint-disable-next-line default-case
        switch (title) {
          case 'Status':
            if (firstPaymentDate) {
              data = 'In Repayment';
            } else if (hardCloseDate) {
              const month = moment(hardCloseDate).add(59, 'days').format('MMM');
              if (month === moment().format('MMM')) {
                data = 'First Payment Due';
              } else if (month === moment().add(1, 'month').format('MMM')) {
                data = 'First Payment Starting Next Month';
              } else {
                data = 'No Payment Due';
              }
            } else {
              data = 'No Payment Due';
            }
            break;
          case 'Start Payment Date':
          case 'startupPeriod':
            if (startupPeriod !== null) {
              if (startupPeriod === 0) {
                if (hardCloseDate) {
                  data = moment(hardCloseDate).add(1, 'month').format('MM/YYYY');
                }
              } else if (startupPeriod !== 0) {
                if (hardCloseDate) {
                  data = moment(hardCloseDate).add(startupPeriod, 'month').format('MM/YYYY');
                }
              }
            }
            if (forceAssign) {
              this.setFieldValue('PAYMENT_FRM', data, 'fields.paymentStartDateCalc.value');
            } else {
              return data;
            }
            break;
          case 'Maturity':
            if (hardCloseDate && term) {
              data = moment(hardCloseDate).add((1 + parseInt(term, 10)), 'month').format('MM/YYYY');
            }
            break;
        }
        break;
      case 'REVENUE_SHARING_NOTE':
        switch (title) {
          case 'Status':
            if (firstPaymentDate) {
              data = 'In Repayment';
            } else if (actualOpeningDate && moment(actualOpeningDate).add(59, 'days').format('MMM') === moment().format('MMM')) {
              data = 'First Payment Due';
            } else if (anticipatedOpenDate && DataFormatter.diffDays(anticipatedOpenDate, false, true) > 180 && !actualOpeningDate) {
              data = 'Min Payment Due';
            } else if (actualOpeningDate && moment(actualOpeningDate).add(59, 'days').format('MMM') === moment().add(1, 'month').format('MMM')) {
              data = 'First Payment Starting Next Month';
            } else if (anticipatedOpenDate && DataFormatter.diffDays(anticipatedOpenDate, false, true) > 150 && !actualOpeningDate) {
              data = 'Min Payment Starting Next Month';
            } else if (anticipatedOpenDate && DataFormatter.diffDays(anticipatedOpenDate, false, true) < 180 && !actualOpeningDate) {
              data = 'No Payment Due';
            } else {
              data = 'No Payment Due';
            }
            break;
          case 'Start Payment Date':
          case 'operationsDate':
            if (actualOpeningDate && DataFormatter.diffDays(actualOpeningDate, false, true) < 0) {
              data = moment(actualOpeningDate).add(2, 'month').format('MM/YYYY');
            }
            if (forceAssign) {
              this.setFieldValue('PAYMENT_FRM', data, 'fields.paymentStartDateCalc.value');
            } else {
              return data;
            }
            break;
          case 'Min Payment Start Date':
          case 'anticipatedOpenDate':
          case 'startupPeriod':
            if (startupPeriod !== 0 && anticipatedOpenDate && actualOpeningDate && DataFormatter.diffDays(actualOpeningDate, false, true) >= 0) {
              data = moment(anticipatedOpenDate).add(startupPeriod, 'month').format('MM/YYYY');
            }
            if (forceAssign) {
              this.setFieldValue('PAYMENT_FRM', data, 'fields.minPaymentStartDateCalc.value');
            } else {
              return data;
            }
            break;
          case 'Maturity':
            if (hardCloseDate && term) {
              data = moment(hardCloseDate).add((1 + parseInt(term, 10)), 'month').format('MM/YYYY');
            }
            break;
          default:
            data = hardCloseDate;
        }
        break;
    }
    if (!forceAssign) {
      return data;
    }
  };

  setInitiateSrch = (keyword) => {
    this.setDb([...this.initialData]);
    if (keyword) {
      ClientDb.filterFromNestedObjs('offering.keyTerms.shorthandBusinessName', keyword);
    }
    this.setFieldValue('data', ClientDb.getDatabase());
  }

  get repayments() {
    const data = (this.data && toJS(this.data) && toJS(this.data).filter(d => get(d, 'offering.closureSummary.repayment.firstPaymentDate'))) || [];
    if (this.sortOrderRP.column && this.sortOrderRP.direction && this.data && toJS(this.data)) {
      return orderBy(
        data,
        [issuerList => (!['offering.keyTerms.shorthandBusinessName', 'offering.keyTerms.securities', 'offering.closureSummary.keyTerms.monthlyPayment'].includes(this.sortOrderRP.column) ? get(issuerList, this.sortOrderRP.column) && moment(get(issuerList, this.sortOrderRP.column), 'MM/DD/YYYY', true).isValid() ? moment(get(issuerList, this.sortOrderRP.column), 'MM/DD/YYYY', true).unix() : '' : get(issuerList, this.sortOrderRP.column) && get(issuerList, this.sortOrderRP.column).toString().toLowerCase())],
        [this.sortOrderRP.direction],
      );
    }
    return data || [];
  }

  get startupPeriod() {
    const data = (this.data && toJS(this.data) && toJS(this.data).filter(d => !get(d, 'offering.closureSummary.repayment.firstPaymentDate'))) || [];
    if (this.sortOrderSP.column && this.sortOrderSP.direction && this.data && toJS(this.data)) {
      return orderBy(
        data,
        [issuerList => (!['offering.keyTerms.shorthandBusinessName', 'offering.keyTerms.securities', 'offering.closureSummary.keyTerms.monthlyPayment'].includes(this.sortOrderSP.column) ? get(issuerList, this.sortOrderSP.column) && moment(get(issuerList, this.sortOrderSP.column), 'MM/DD/YYYY', true).isValid() ? moment(get(issuerList, this.sortOrderSP.column), 'MM/DD/YYYY', true).unix() : '' : get(issuerList, this.sortOrderSP.column) && get(issuerList, this.sortOrderSP.column).toString().toLowerCase())],
        [this.sortOrderSP.direction],
      );
    }
    return data || [];
  }

  get termNotes() {
    const data = (this.data && toJS(this.data) && toJS(this.data).filter(d => get(d, 'offering.keyTerms.securities') === 'TERM_NOTE')) || [];
    if (this.sortOrderTN.column && this.sortOrderTN.direction && this.data && toJS(this.data)) {
      return orderBy(
        data,
        [issuerList => (!['offering.keyTerms.shorthandBusinessName', 'offering.keyTerms.securities', 'offering.closureSummary.keyTerms.monthlyPayment'].includes(this.sortOrderTN.column) ? get(issuerList, this.sortOrderTN.column) && moment(get(issuerList, this.sortOrderTN.column), 'MM/DD/YYYY', true).isValid() ? moment(get(issuerList, this.sortOrderTN.column), 'MM/DD/YYYY', true).unix() : '' : get(issuerList, this.sortOrderTN.column) && get(issuerList, this.sortOrderTN.column).toString().toLowerCase())],
        [this.sortOrderTN.direction],
      );
    }
    return data || [];
  }

  get revenueSharingNotes() {
    const data = (this.data && toJS(this.data) && toJS(this.data).filter(d => get(d, 'offering.keyTerms.securities') === 'REVENUE_SHARING_NOTE')) || [];
    if (this.sortOrderRSN.column && this.sortOrderRSN.direction && this.data && toJS(this.data)) {
      return orderBy(
        data,
        [issuerList => (!['offering.keyTerms.shorthandBusinessName', 'offering.keyTerms.securities', 'offering.closureSummary.keyTerms.monthlyPayment'].includes(this.sortOrderRSN.column) ? get(issuerList, this.sortOrderRSN.column) && moment(get(issuerList, this.sortOrderRSN.column), 'MM/DD/YYYY', true).isValid() ? moment(get(issuerList, this.sortOrderRSN.column), 'MM/DD/YYYY', true).unix() : '' : get(issuerList, this.sortOrderRSN.column) && get(issuerList, this.sortOrderRSN.column).toString().toLowerCase())],
        [this.sortOrderRSN.direction],
      );
    }
    return data || [];
  }

  manageActionDropdown = (actionStep) => {
    console.log('adminPaymentSendGoldStarDraftInstructions', actionStep);
    const actionDropdownValues = [...this.ACTION_FRM.fields.scope.values];
    if (actionStep === 'adminPaymentSendGoldStarDraftInstructions') {
      remove(actionDropdownValues, o => o.key === 'ISSUER');
    } else {
      remove(actionDropdownValues, o => o.key === 'GOLDSTAR');
    }
    this.ACTION_FRM.fields.scope.values = [...actionDropdownValues];
  }

  resetActionForm = (form) => {
    this[form] = Validator.prepareFormObject(ACTION);
  }

  formActionDropdownChange = (e, result, form) => {
    const dropddownValue = Validator.pullValues(e, result);
    if (['issuer', 'goldstar'].includes(dropddownValue.value)) {
      this.setFieldValue('sendEmailOptionVisibility', true);
    } else {
      this.setFieldValue('sendEmailOptionVisibility', false);
    }
    this.formChange(e, result, form);
  }
}

decorate(PaymentStore, {
  ...decorateDefault,
  data: observable,
  selectedOffering: observable,
  apiHit: observable,
  PAYMENT_FRM: observable,
  ACTION_FRM: observable,
  initialData: observable,
  sortOrderSP: observable,
  sortOrderRP: observable,
  sortOrderTN: observable,
  sortOrderRSN: observable,
  updatePaymentDetailsFormRules: action,
  paymentCtaHandlers: action,
  setSortingOrder: action,
  initRequest: action,
  getOfferingBySlug: action,
  updatePayment: action,
  updatePaymentList: action,
  setInitiateSrch: action,
  setDb: action,
  startupPeriod: computed,
  repayments: computed,
  termNotes: computed,
  revenueSharingNotes: computed,
  manageActionDropdown: action,
  resetActionForm: action,
  formActionDropdownChange: action,
  sendEmailOptionVisibility: observable,
});

export default new PaymentStore();
