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

    sortOrder = {
      column: null,
      direction: 'asc',
    }

    setSortingOrder = (column = null, direction = null) => {
      this.sortOrder.column = column;
      this.sortOrder.direction = direction;
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
      const res = this.repayments.find(payment => payment.offering.id === id);
      this.PAYMENT_FRM = Validator.setFormData(this.PAYMENT_FRM, res);
    }

    updatePayment = id => new Promise((resolve, reject) => {
      uiStore.setProgress();
      const variables = Helper.replaceKeysDeep(toJS(Validator.evaluateFormData(this.PAYMENT_FRM.fields)), { expectedOpsDate: 'launchExpectedOpsDate', operationsDate: 'operationsDate', expectedPaymentDate: 'keyTermsAnticipatedPaymentStartDate', firstPaymentDate: 'repaymentStartDate' });
      client
        .mutate({
          mutation: updatePaymentIssuer,
          variables: { offeringId: id, paymentIssuerDetailsInput: { ...variables } },
        })
        .then((res) => {
          this.updatePaymentList(id, res.updatePaymentIssuer);
          resolve();
        })
        .catch((err) => {
          reject();
          console.log(err);
        })
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
      this.setDb(this.initialData);
      if (keyword) {
        ClientDb.filterFromNestedObjs('offering.keyTerms.shorthandBusinessName', keyword);
      }
      this.data = ClientDb.getDatabase();
    }

    get repayments() {
      if (this.sortOrder.column && this.sortOrder.direction && this.data && toJS(this.data)) {
        return orderBy(
          this.data,
          [issuerList => (!['offering.keyTerms.shorthandBusinessName', 'offering.keyTerms.securities'].includes(this.sortOrder.column) ? get(issuerList, this.sortOrder.column) && moment(get(issuerList, this.sortOrder.column), 'MM/DD/YYYY', true).isValid() ? moment(get(issuerList, this.sortOrder.column), 'MM/DD/YYYY', true).unix() : '' : get(issuerList, this.sortOrder.column) && get(issuerList, this.sortOrder.column).toString().toLowerCase())],
          [this.sortOrder.direction],
        );
      }
      return this.data || [];
    }
}

decorate(PaymentStore, {
  ...decorateDefault,
  data: observable,
  PAYMENT_FRM: observable,
  initialData: observable,
  sortOrder: observable,
  setSortingOrder: action,
  initRequest: action,
  getOfferingById: action,
  updatePayment: action,
  updatePaymentList: action,
  setInitiateSrch: action,
  setDb: action,
  repayments: computed,
});

export default new PaymentStore();
