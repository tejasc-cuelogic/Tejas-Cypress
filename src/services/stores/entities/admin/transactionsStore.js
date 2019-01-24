import { observable, action, computed } from 'mobx';
import { isArray } from 'lodash';
import graphql from 'mobx-apollo';
import moment from 'moment';
import { getTransactions, approveTransactions, declineTransactions, verifiedTransactions, failedTransactions } from '../../queries/transaction';
import { GqlClient as client } from '../../../../api/gqlApi';
import Helper from '../../../../helper/utility';
import { ClientDb, FormValidator as Validator } from '../../../../helper';
import DataFormatter from '../../../../../src/helper/utilities/DataFormatter';
import { TRANSACTION_FAILURE } from '../../../constants/admin/transactions';

export class TransactionsStore {
  ctHandler = {
    Approved: approveTransactions,
    Declined: declineTransactions,
    Verified: verifiedTransactions,
    Failed: failedTransactions,
  }
  @observable filters = false;
  @observable TRANSACTION_FAILURE = Validator.prepareFormObject(TRANSACTION_FAILURE);
  @observable data = [];
  @observable transactionStatus = null;
  @observable db = [];
  @observable summary = {
    status1: 0, status2: 0, status3: 0, status4: 0,
  };
  @observable requestState = {
    page: 1,
    perPage: 10,
    skip: 0,
    displayTillIndex: 10,
    filters: false,
    sort: {
      by: 'createdDate',
      direction: 'desc',
    },
    search: {

    },
  };

  @action
  toggleSearch = () => {
    this.filters = !this.filters;
  }

  @action
  setDb = (data) => {
    this.db = ClientDb.initiateDb(data);
  }

  @action
  resetModalForm = () => {
    this.TRANSACTION_FAILURE = Validator.prepareFormObject(TRANSACTION_FAILURE);
  }

  @action
  initRequest = (transStatus) => {
    const payLoad = { status: transStatus, offset: 1, limit: 1000 };
    this.data = graphql({
      client,
      query: getTransactions,
      variables: payLoad,
      fetchPolicy: 'network-only',
      onFetch: (res) => {
        if (res) {
          this.requestState.search.transactionType = '';
          this.filters = false;
          this.setDb(DataFormatter.mapDatesToType(res.getTransactions, ['startDate', 'failDate', 'estDateAvailable'], 'unix'));
        }
      },
    });
  }

  @action
  transactionChange = (requestID, transStatus, actionName) => {
    const payLoad = { status: transStatus, offset: 1, limit: 1000 };
    client
      .mutate({
        mutation: this.ctHandler[actionName],
        variables: { id: requestID },
        refetchQueries: [{ query: getTransactions, variables: payLoad }],
      })
      .then(() => Helper.toast(`Transaction ${actionName} successfully.`, 'success'))
      .catch(() => Helper.toast('OOPs something went work', 'error'));
  };


  @action
  failTransaction = (requestID, transStatus) => {
    const reason = Validator.evaluateFormData(this.TRANSACTION_FAILURE.fields);
    const payLoad = {
      status: transStatus,
      offset: 1,
      limit: 1000,
    };
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: failedTransactions,
          variables: {
            id: requestID,
            reason: reason.justifyDescription,
          },
          refetchQueries: [{ query: getTransactions, variables: payLoad }],
        })
        .then(() => {
          Helper.toast('Transaction Failed successfully.', 'success');
          resolve();
        })
        .catch(() => {
          Helper.toast('OOPs something went work', 'error');
          reject();
        });
    });
  };

  @action
  formChange = (e, result, form) => {
    this[form] = Validator.onChange(
      this[form],
      Validator.pullValues(e, result),
    );
  }

  @action
  pageRequest = ({ skip, page }) => {
    const pageWiseCount = this.requestState.perPage * page;
    this.requestState.displayTillIndex = pageWiseCount;
    this.requestState.page = page;
    this.requestState.skip = (skip === pageWiseCount) ?
      pageWiseCount - this.requestState.perPage : skip;
  }

  @computed get allRecords() {
    const transactions = this.db || [];
    const slicedTransactions = transactions.slice(
      this.requestState.skip,
      this.requestState.displayTillIndex,
    );
    return slicedTransactions || [];
  }

  @computed get transactionCount() {
    const transactions = this.db || [];
    return transactions.length;
  }

  @computed get loading() {
    return this.data.loading;
  }

  @action
  initiateSearch = (srchParams) => {
    this.requestState.search = srchParams;
    this.initiateFilters();
  }

  @action
  initiateFilters = () => {
    this.setDb(DataFormatter.mapDatesToType(this.data.data.getTransactions, ['startDate', 'failDate', 'estDateAvailable'], 'unix'));
    const {
      keyword, startDate, endDate, min, max,
      transactionType,
    } = this.requestState.search;
    if (keyword) {
      ClientDb.filterFromNestedObjs(['gsTransactionId', 'requestId', 'accountId', 'userInfo.info.firstName', 'userInfo.info.lastName'], keyword);
    }
    if (transactionType) {
      ClientDb.filterData('type', transactionType);
    }

    if (startDate && endDate) {
      ClientDb.filterByDate(startDate, endDate, 'startDate');
    }

    if (min && max) {
      ClientDb.filterByNumber(min, max, 'amount', 'f');
    }
    this.db = ClientDb.getDatabase();
  }

  setInitiateSrch = (valueObj, name) => {
    if (name === 'startDate' || name === 'endDate') {
      this.requestState.search[name] = valueObj && moment(valueObj.formattedValue, 'MM-DD-YYYY', true).isValid() ? DataFormatter.getDate(valueObj.formattedValue, false, name, true) : undefined;
      if (this.requestState.search.startDate !== '' && this.requestState.search.endDate !== '') {
        const srchParams = { ...this.requestState.search };
        this.initiateSearch(srchParams);
      }
    } else {
      const srchParams = { ...this.requestState.search };
      const { value } = valueObj;
      if ((isArray(value) && value.length > 0) || (typeof value === 'string' && value !== '')) {
        srchParams[name] = value;
      } else {
        delete srchParams[name];
      }
      this.initiateSearch(srchParams);
    }
  }
}


export default new TransactionsStore();
