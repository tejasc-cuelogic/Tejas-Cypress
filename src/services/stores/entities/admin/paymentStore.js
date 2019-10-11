import { observable, action, computed, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { orderBy, get, forEach } from 'lodash';
import moment from 'moment';
import { FormValidator as Validator } from '../../../../helper';
import { GqlClient as client } from '../../../../api/gqlApi';
import { paymentsIssuerList, allRepaymentDetails, updatePaymentIssuer } from '../../queries/Repayment';
import { PAYMENT } from '../../../constants/payment';
import { uiStore } from '../../index';

export class PaymentStore {
    @observable data = [];

    @observable details = [];

    @observable filters = false;

    @observable PAYMENT_FRM = Validator.prepareFormObject(PAYMENT);

    @observable offeringDetails = null;

    @observable summary = {
      title: false,
      summary: [
        { title: 'Date', content: '7/5/18', type: 0 },
        {
          title: 'Status', content: 'Pending', type: 0, status: 'pending',
        },
        { title: '# of RS', content: 8, type: 0 },
        { title: '# of TL', content: 5, type: 0 },
        { title: 'Processed Date', content: 'N/A', type: 0 },
        { title: 'Amount Repaid', content: 'N/A', type: 0 },
        { title: 'Investor Repaid', content: 'N/A', type: 0 },
      ],
    };

    @observable sortOrder = {
      column: null,
      direction: 'asc',
    }

    @action
    setFieldValue = (field, value) => {
      this[field] = value;
    }

    @action
    formChange = (e, result, form) => {
      this[form] = Validator.onChange(
        this[form],
        Validator.pullValues(e, result),
      );
    }

    @action
    setSortingOrder = (column = null, direction = null) => {
      this.sortOrder.column = column;
      // this.sortOrder.listData = listData;
      this.sortOrder.direction = direction;
    }

    @action
    initRequest = () => {
      this.data = graphql({ client, query: paymentsIssuerList });
    }

    @action
    initRepaymentDetails = () => {
      this.details = graphql({ client, query: allRepaymentDetails });
    }

    @action
    formArrayChange = (e, result, form) => {
      this[form] = Validator.onArrayFieldChange(
        this[form],
        Validator.pullValues(e, result),
      );
    }

    @action
    maskChange = (values, form, field) => {
      const cMap = ['expectedPaymentDate', 'firstPaymentDate', 'expectedOpsDate', 'maturityDate', 'hardCloseDate', 'operationsDate'];
      const fieldValue = (cMap.includes(field)) ? values.formattedValue : values.floatValue;
      this[form] = Validator.onChange(
        this[form],
        { name: field, value: fieldValue },
      );
    }

    @action
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

    @action
    getPaymentFormData = () => {
      const data = {};
      forEach(this.PAYMENT_FRM.fields, (t, key) => {
        data[key] = this.PAYMENT_FRM.fields[key].value;
      });
      return data;
    }

    @action
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
          console.log(res);
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

    @action
    setFormData = (formData) => {
      Object.keys(this.PAYMENT_FRM.fields).map(action((key) => {
        if (!this.PAYMENT_FRM.fields[key].ArrayObjItem) {
          this.PAYMENT_FRM.fields[key].value = formData[key];
        }
        return null;
      }));
      Validator.validateForm(this.PAYMENT_FRM);
    }

    @action
    setInitiateSrch = (name, value) => {
      this.requestState.search[name] = value;
      this.initRequest({ ...this.requestState.search });
    }

    @action
    toggleSearch = () => {
      this.filters = !this.filters;
    }

    @computed get repayments() {
      if (this.sortOrder.column && this.sortOrder.direction && this.data && toJS(get(this.data, 'data.paymentsIssuerList'))) {
        return orderBy(
          this.data.data.paymentsIssuerList,
          [issuerList => (!['keyTerms.shorthandBusinessName', 'offering.keyTerms.securities'].includes(this.sortOrder.column) ? get(issuerList, this.sortOrder.column) && moment(get(issuerList, this.sortOrder.column), 'MM/DD/YYYY', true).isValid() ? moment(get(issuerList, this.sortOrder.column), 'MM/DD/YYYY', true).unix() : '' : get(issuerList, this.sortOrder.column) && get(issuerList, this.sortOrder.column).toString().toLowerCase())],
          [this.sortOrder.direction],
        );
      }
      return (this.data.data && toJS(this.data.data.paymentsIssuerList)) || [];
    }

    @computed get repaymentDetails() {
      return (this.details.data && toJS(this.details.data.allRepaymentDetails)) || [];
    }

    @computed get loading() {
      return this.data.loading;
    }
}


export default new PaymentStore();
