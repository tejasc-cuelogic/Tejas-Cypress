import { observable, action, computed, toJS, decorate } from 'mobx';
import graphql from 'mobx-apollo';
import { orderBy, get, forEach, findIndex, map } from 'lodash';
import moment from 'moment';
import { FormValidator as Validator, ClientDb } from '../../../../helper';
import { GqlClient as client } from '../../../../api/gqlApi';
import { paymentsIssuerList, allRepaymentDetails, updatePaymentIssuer } from '../../queries/Repayment';
import { PAYMENT } from '../../../constants/payment';
import { uiStore } from '../../index';
import DataModelStore, { decorateDefault } from '../shared/dataModelStore';

export class PaymentStore extends DataModelStore {
  constructor() {
    super({ paymentsIssuerList, allRepaymentDetails, updatePaymentIssuer });
  }

    data = [];

    tempData = [];

    details = [];

    filters = false;

    PAYMENT_FRM = Validator.prepareFormObject(PAYMENT);

    offeringDetails = null;

    sortOrder = {
      column: null,
      direction: 'asc',
    }

    formChange = (e, result, form) => {
      this[form] = Validator.onChange(
        this[form],
        Validator.pullValues(e, result),
      );
    }

    setSortingOrder = (column = null, direction = null) => {
      this.sortOrder.column = column;
      // this.sortOrder.listData = listData;
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
      const d = map(data, (dd) => {
        const de = { ...dd };
        return de;
      });
      this.setFieldValue('tempData', d);
      this.setFieldValue('data', ClientDb.initiateDb(d, true));
    }

    initRepaymentDetails = () => {
      this.details = graphql({ client, query: allRepaymentDetails });
    }

    formArrayChange = (e, result, form) => {
      this[form] = Validator.onArrayFieldChange(
        this[form],
        Validator.pullValues(e, result),
      );
    }

    maskChange = (values, form, field) => {
      const cMap = ['expectedPaymentDate', 'firstPaymentDate', 'expectedOpsDate', 'operationsDate'];
      const fieldValue = (cMap.includes(field)) ? values.formattedValue : values.floatValue;
      this[form] = Validator.onChange(
        this[form],
        { name: field, value: fieldValue },
      );
    }

    getOfferingById = (id) => {
      let res = this.repayments.filter(payment => payment.offering.id === id);
      res = { ...res[0] };
      if (res) {
        const data = {
          shorthandBusinessName: get(res.offering, 'keyTerms.shorthandBusinessName'),
          securities: get(res.offering, 'keyTerms.securities'),
          hardCloseDate: get(res.offering, 'closureSummary.hardCloseDate'),
          maturityDate: get(res.offering, 'closureSummary.keyTerms.maturityDate'),
          expectedOpsDate: get(res.offering, 'offering.launch.expectedOpsDate'),
          expectedPaymentDate: get(res.offering, 'closureSummary.keyTerms.anticipatedPaymentStartDate'),
          firstPaymentDate: get(res.offering, 'closureSummary.repayment.startDate'),
          operationsDate: get(res.offering, 'closureSummary.operationsDate'),
          sinkingFundBalance: get(res, 'sinkingFundBalance') || '0.00',
        };
        this.setFormData(data);
      }
    }

    getPaymentFormData = () => {
      const data = {};
      forEach(this.PAYMENT_FRM.fields, (t, key) => {
        data[key] = this.PAYMENT_FRM.fields[key].value;
      });
      return data;
    }

    updatePayment = id => new Promise((resolve, reject) => {
      uiStore.setProgress();
      const data = this.getPaymentFormData();
      const variables = {
        launchExpectedOpsDate: data.expectedOpsDate,
        operationsDate: data.operationsDate,
        keyTermsAnticipatedPaymentStartDate: data.expectedPaymentDate,
        repaymentStartDate: data.firstPaymentDate,
      };
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

    setFormData = (formData) => {
      Object.keys(this.PAYMENT_FRM.fields).map(action((key) => {
        if (!this.PAYMENT_FRM.fields[key].ArrayObjItem) {
          this.PAYMENT_FRM.fields[key].value = formData[key];
        }
        return null;
      }));
      Validator.validateForm(this.PAYMENT_FRM);
    }

    setInitiateSrch = (keyword) => {
      this.setDb(this.tempData);
      if (keyword) {
        ClientDb.filterFromNestedObjs('offering.keyTerms.shorthandBusinessName', keyword);
      }
      this.data = ClientDb.getDatabase();
    }

    toggleSearch = () => {
      this.filters = !this.filters;
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

    get repaymentDetails() {
      return (this.details.data && toJS(this.details.data.allRepaymentDetails)) || [];
    }
}

decorate(PaymentStore, {
  ...decorateDefault,
  data: observable,
  details: observable,
  filters: observable,
  PAYMENT_FRM: observable,
  tempData: observable,
  offeringDetails: observable,
  sortOrder: observable,
  formChange: action,
  setSortingOrder: action,
  initRequest: action,
  initRepaymentDetails: action,
  formArrayChange: action,
  maskChange: action,
  getOfferingById: action,
  getPaymentFormData: action,
  updatePayment: action,
  updatePaymentList: action,
  setFormData: action,
  setInitiateSrch: action,
  setDb: action,
  toggleSearch: action,
  repayments: computed,
  repaymentDetails: computed,
});

export default new PaymentStore();
