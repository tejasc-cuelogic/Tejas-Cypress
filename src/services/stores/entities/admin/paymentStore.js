import { observable, action, computed, toJS, decorate } from 'mobx';
import { orderBy, get, findIndex } from 'lodash';
import cleanDeep from 'clean-deep';
import moment from 'moment';
import { FormValidator as Validator, ClientDb } from '../../../../helper';
import { GqlClient as client } from '../../../../api/gqlApi';
import { adminPaymentsIssuerList, updatePaymentIssuer } from '../../queries/Repayment';
import { PAYMENT } from '../../../constants/payment';
import { uiStore } from '../../index';
import DataModelStore, { decorateDefault } from '../shared/dataModelStore';
import Helper from '../../../../helper/utility';

export class PaymentStore extends DataModelStore {
  constructor() {
    super({ adminPaymentsIssuerList, updatePaymentIssuer });
  }

    data = [];

    apiHit = false;

    initialData = [];

    PAYMENT_FRM = Validator.prepareFormObject(PAYMENT);

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

    setSortingOrder = (column = null, direction = null, key) => {
      this[key] = {
        column,
        direction,
      };
    }

    initRequest = () => {
      if (!this.apiHit) {
        this.executeQuery({
          client: 'PRIVATE',
          query: 'adminPaymentsIssuerList',
          setLoader: 'adminPaymentsIssuerList',
        }).then((res) => {
          this.setDb(res.adminPaymentsIssuerList);
          this.setFieldValue('apiHit', true);
        });
      }
    };

    setDb = (data) => {
      this.setFieldValue('initialData', data);
      this.setFieldValue('data', ClientDb.initiateDb(data, true));
    }

    getOfferingBySlug = (id) => {
      const res = this.data.find(payment => payment.offering.offeringSlug === id);
      this.selectedOffering = res;
      this.PAYMENT_FRM = Validator.setFormData(this.PAYMENT_FRM, res);
      this.validateForm('PAYMENT_FRM');
    }

    updatePayment = () => new Promise((resolve) => {
      uiStore.setProgress();
      const id = get(this.selectedOffering, 'offering.id');
      let variables = Helper.replaceKeysDeep(toJS(Validator.evaluateFormData(this.PAYMENT_FRM.fields)), { expectedOpsDate: 'launchExpectedOpsDate', expectedPaymentDate: 'keyTermsAnticipatedPaymentStartDate', firstPaymentDate: 'repaymentStartDate', payments: 'paymentsContactEmail' });
      variables = variables.paymentsContactEmail ? { ...variables, paymentsContactEmail: (variables.paymentsContactEmail.split(',').map(p => p.trim())).join(', ') } : { ...variables };
      variables = cleanDeep(variables);
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
}

decorate(PaymentStore, {
  ...decorateDefault,
  data: observable,
  selectedOffering: observable,
  apiHit: observable,
  PAYMENT_FRM: observable,
  initialData: observable,
  sortOrderSP: observable,
  sortOrderRP: observable,
  sortOrderTN: observable,
  sortOrderRSN: observable,
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
});

export default new PaymentStore();
