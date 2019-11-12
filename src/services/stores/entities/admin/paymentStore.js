import { observable, action, computed, toJS, decorate } from 'mobx';
import { orderBy, get, findIndex } from 'lodash';
import moment from 'moment';
import { FormValidator as Validator, ClientDb } from '../../../../helper';
import { GqlClient as client } from '../../../../api/gqlApi';
import { paymentsIssuerList, updatePaymentIssuer } from '../../queries/Repayment';
import { PAYMENT } from '../../../constants/payment';
import { uiStore } from '../../index';
import DataModelStore, { decorateDefault } from '../shared/dataModelStore';
import Helper from '../../../../helper/utility';

export class PaymentStore extends DataModelStore {
  constructor() {
    super({ paymentsIssuerList, updatePaymentIssuer });
  }

    data = [];

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

    setSortingOrder = (column = null, direction = null, key) => {
      this[key] = {
        column,
        direction,
      };
    }

    initRequest = () => {
      this.executeQuery({
        client: 'PRIVATE',
        query: 'paymentsIssuerList',
        setLoader: 'paymentsIssuerList',
      }).then((res) => {
        this.setDb(res.paymentsIssuerList);
      });
    };

    setDb = (data) => {
      this.setFieldValue('initialData', data);
      this.setFieldValue('data', ClientDb.initiateDb(data, true));
    }

    getOfferingById = (id) => {
      const res = this.data.find(payment => payment.offering.id === id);
      this.PAYMENT_FRM = Validator.setFormData(this.PAYMENT_FRM, res);
      this.validateForm('PAYMENT_FRM');
    }

    updatePayment = id => new Promise((resolve, reject) => {
      uiStore.setProgress();
      const variables = Helper.replaceKeysDeep(toJS(Validator.evaluateFormData(this.PAYMENT_FRM.fields)), { expectedOpsDate: 'launchExpectedOpsDate', operationsDate: 'operationsDate', expectedPaymentDate: 'keyTermsAnticipatedPaymentStartDate', firstPaymentDate: 'repaymentStartDate', monthlyPayment: 'monthlyPayment' });
      client
        .mutate({
          mutation: updatePaymentIssuer,
          variables: { offeringId: id, paymentIssuerDetailsInput: { ...variables } },
        })
        .then((res) => {
          this.updatePaymentList(id, res.updatePaymentIssuer);
          resolve();
        })
        .catch(() => reject())
        .finally(() => {
          uiStore.setProgress(false);
        });
    });

    updatePaymentList = (id, res) => {
      const data = { ...toJS(this.data) };
      const paymentIndex = findIndex(data, d => d.id === id);
      if (paymentIndex !== -1) {
        const newData = {
          ...res,
          sinkingFundBalance: this.PAYMENT_FRM.fields.sinkingFundBalance.value,
        };
        this.data[paymentIndex] = newData;
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
}

decorate(PaymentStore, {
  ...decorateDefault,
  data: observable,
  PAYMENT_FRM: observable,
  initialData: observable,
  sortOrderSP: observable,
  sortOrderRP: observable,
  setSortingOrder: action,
  initRequest: action,
  getOfferingById: action,
  updatePayment: action,
  updatePaymentList: action,
  setInitiateSrch: action,
  setDb: action,
  startupPeriod: computed,
  repayments: computed,
});

export default new PaymentStore();
