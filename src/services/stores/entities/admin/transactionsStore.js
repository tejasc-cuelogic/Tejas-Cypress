import { observable, action, computed } from 'mobx';
import { isArray, get, forOwn, intersection } from 'lodash';
import graphql from 'mobx-apollo';
import moment from 'moment';
import { getTransactions, approveTransactions, declineTransactions, verifiedTransactions, failedTransactions } from '../../queries/transaction';
import { GqlClient as client } from '../../../../api/gqlApi';
import Helper from '../../../../helper/utility';
import { ClientDb, FormValidator as Validator } from '../../../../helper';
import DataFormatter from '../../../../../src/helper/utilities/DataFormatter';
import { TRANSACTION_FAILURE, COUNT_STATUS_MAPPING, FAILED_STATUS } from '../../../constants/admin/transactions';

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
  @observable isNonTerminatedState = false
  @observable searchCount = null;
  @observable db = [];
  @observable summary = {
    'status-1': 0, 'status-2': 0, 'status-3': 0, 'status-4': 0,
  };
  @observable requestState = {
    page: 1,
    perPage: 10,
    skip: 0,
    displayTillIndex: 10,
    filters: false,
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
    this.transactionStatus = transStatus;
    this.isNonTerminatedState = intersection(['PENDING', 'PROCESSING'], this.transactionStatus).length > 0;
    const payLoad = {
      status: transStatus,
      offset: this.requestState.page,
      limit: this.statusWiseLimt(),
      ...this.requestState.search,
    };
    this.data = graphql({
      client,
      query: getTransactions,
      variables: payLoad,
      fetchPolicy: 'network-only',
      onFetch: (res) => {
        if (res) {
          this.setData(res);
        }
      },
    });
  }

  @computed


  @action
  setTabCount = (countObj) => {
    this.summary = {
      'status-1': 0, 'status-2': 0, 'status-3': 0, 'status-4': 0,
    };
    forOwn(countObj, (v, k) => {
      this.summary[COUNT_STATUS_MAPPING[k]] += v;
    });
  }

  @action
  setData = (data) => {
    if (get(data, 'getTransactions')) {
      this.setDb(DataFormatter.mapDatesToType(data.getTransactions.transactions, ['startDate', 'failDate', 'estDateAvailable'], 'unix'));
      this.searchCount = data.getTransactions.transactionCount.searchCount;
      this.setTabCount(data.getTransactions.transactionCount);
    }
  }

  @action
  resetData = () => {
    this.requestState.search = {};
    this.resetPagination();
  }

  @action
  resetPagination = () => {
    this.requestState.skip = 0;
    this.requestState.page = 1;
    this.requestState.perPage = 10;
    this.requestState.displayTillIndex = 10;
  }

  @action
  transactionChange = (requestID, transStatus, actionName) => {
    client
      .mutate({
        mutation: this.ctHandler[actionName],
        variables: { id: requestID },
      })
      .then(() => {
        this.initRequest(transStatus);
        Helper.toast(`Transaction ${actionName} successfully.`, 'success');
      })
      .catch(() => Helper.toast('OOPs something went work', 'error'));
  };

  @action
  failTransaction = (requestID, transStatus) => {
    const reason = Validator.evaluateFormData(this.TRANSACTION_FAILURE.fields);
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: this.ctHandler[FAILED_STATUS[transStatus]],
          variables: {
            id: requestID,
            reason: reason.justifyDescription,
          },
        })
        .then(() => {
          Helper.toast(`Transaction ${FAILED_STATUS[transStatus]} successfully.`, 'success');
          this.initRequest(this.transactionStatus);
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
    if (this.isNonTerminatedState) {
      this.requestState.skip = (skip === pageWiseCount) ?
        pageWiseCount - this.requestState.perPage : skip;
    } else {
      this.initRequest(this.transactionStatus);
    }
  }

  @computed get allRecords() {
    const transactions = this.db || [];
    if (this.isNonTerminatedState) {
      return transactions.slice(
        this.requestState.skip,
        this.requestState.displayTillIndex,
      );
    }
    return transactions || [];
  }

  @computed get transactionCount() {
    return this.isNonTerminatedState ?
      this.db.length
      : this.searchCount;
  }

  @computed get loading() {
    return this.data.loading;
  }

  statusWiseLimt = () => (this.isNonTerminatedState ? 100 : 10)

  @action
  initiateFilters = () => {
    this.setData(get(this.data, 'data') || []);
    const {
      keyword, minAmount, maxAmount,
      dateFilterStart, dateFilterStop,
      direction,
    } = this.requestState.search;
    if (keyword) {
      ClientDb.filterFromNestedObjs(['gsTransactionId', 'requestId', 'accountId', 'userInfo.info.firstName', 'userInfo.info.lastName'], keyword);
    }
    if (direction) {
      ClientDb.filterData('direction', direction);
    }

    if (dateFilterStart && dateFilterStop) {
      ClientDb.filterByDate(dateFilterStart, dateFilterStop, 'startDate');
    }

    if (minAmount && maxAmount) {
      ClientDb.filterByNumber(minAmount, maxAmount, 'amount', 'f');
    }
    this.db = ClientDb.getDatabase();
  }

  @action
  setInitiateSrch = (valueObj, name) => {
    const searchparams = { ...this.requestState.search };
    if (name === 'dateFilterStart' || name === 'dateFilterStop') {
      searchparams[name] = valueObj && moment(valueObj.formattedValue, 'MM-DD-YYYY', true).isValid() ? DataFormatter.getDate(valueObj.formattedValue, !this.isNonTerminatedState, name, this.isNonTerminatedState) : '';
      if (this.requestState.search.dateFilterStart === '' ||
        this.requestState.search.dateFilterStop === '') {
        delete searchparams[name];
      }
    } else {
      const { value } = valueObj;
      if ((isArray(value) && value.length > 0) || (typeof value === 'string' && value !== '')) {
        searchparams[name] = value;
      } else {
        delete searchparams[name];
      }
    }
    this.requestState.search = searchparams;
    return this.isNonTerminatedState ? this.initiateFilters()
      : this.initRequest(this.transactionStatus);
  }
}


export default new TransactionsStore();
