import { observable, action, computed } from 'mobx';
import { isArray, get, forOwn, intersection, filter, find, findIndex } from 'lodash';
import graphql from 'mobx-apollo';
import moment from 'moment';
import { transferRequestAdminSync, getTransactions, transferRequestAdminApprove, transferRequestAdminDecline, transferRequestAdminVerified, transactionFailed } from '../../queries/transaction';
import { GqlClient as client } from '../../../../api/gqlApi';
import Helper from '../../../../helper/utility';
import { ClientDb, FormValidator as Validator } from '../../../../helper';
import DataFormatter from '../../../../../src/helper/utilities/DataFormatter';
import { TRANSACTION_FAILURE, COUNT_STATUS_MAPPING } from '../../../constants/admin/transactions';

export class TransactionsStore {
  nonTerminatedStatuses = ['PRE_PENDING', 'PENDING', 'PROCESSING']
  ctHandler = {
    Approved: transferRequestAdminApprove,
    Declined: transferRequestAdminDecline,
    Verified: transferRequestAdminVerified,
    Failed: transactionFailed,
    Sync: transferRequestAdminSync,
  }
  @observable filters = false;
  @observable TRANSACTION_FAILURE = Validator.prepareFormObject(TRANSACTION_FAILURE);
  @observable data = [];
  @observable isNonTerminatedStatus = false
  @observable searchCount = null;
  @observable db = [];
  @observable summary = {
    'pre-pending': 0, pending: 0, processing: 0, complete: 0, failed: 0,
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
  @observable btnLoader = [];
  pageReload = true;

  @action
  setDataValue = (key, value) => {
    this[key] = value;
  }

  @action
  addLoadingRequestId = (requestId) => {
    this.btnLoader.push(requestId);
  }

  @action
  removeLoadingRequestId = (requestId, isFailedProcess = false, isApproved = true) => {
    this.btnLoader = filter(this.btnLoader, btnId => btnId !== requestId);
    if (isFailedProcess) {
      return;
    }
    const transactions = get(this.data, 'data.getTransactions.transactions');
    if (isApproved && transactions) {
      this.data.data.getTransactions.transactions =
      filter(transactions, row => row.requestId !== requestId);
    } else if (transactions) {
      const index = findIndex(transactions, record => record.requestId === requestId);
      const transaction = find(transactions, record => record.requestId === requestId);
      transaction.gsProcessId = true;
      this.data.data.getTransactions.transactions[index] = transaction;
    }
    this.setData(this.data.data || []);
  }

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
    this.isNonTerminatedStatus = intersection(
      this.nonTerminatedStatuses,
      this.transactionStatus,
    ).length > 0;
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
        if (res && !this.data.loading) {
          this.setData(res);
        }
      },
      onError: () => {
        this.resetData();
      },
    });
  }

  @computed


  @action
  setTabCount = (countObj) => {
    this.summary = {
      'pre-pending': 0, pending: 0, processing: 0, complete: 0, failed: 0,
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
    } else {
      this.resetData();
    }
  }

  @action
  resetData = () => {
    this.requestState.search = {};
    this.resetPagination();
    this.searchCount = null;
    this.data = [];
    this.setDb([]);
  }

  @action
  resetPagination = () => {
    this.requestState.skip = 0;
    this.requestState.page = 1;
    this.requestState.perPage = 10;
    this.requestState.displayTillIndex = 10;
  }

  @action
  transactionChange = (requestID, transStatus, actionName, direction = '') => {
    this.addLoadingRequestId(requestID);
    client
      .mutate({
        mutation: this.ctHandler[actionName],
        variables: { id: requestID },
      })
      .then((data) => {
        if (actionName === 'Approved') {
          this.removeLoadingRequestId(requestID, false, data && get(data, 'data.transferRequestAdminApprove'));
        } else {
          this.removeLoadingRequestId(requestID);
        }
        Helper.toast(`Transaction ${actionName} successfully.`, 'success');
      })
      .catch((error) => {
        if ((direction === 'DEPOSIT' || direction === 'WITHDRAWAL') && transStatus[0] === 'PENDING') {
          Helper.toast(error.message, 'error');
        } else {
          Helper.toast('Something went wrong please try again after sometime.', 'error');
        }
        this.removeLoadingRequestId(requestID, true);
      });
  };

  @action
  failTransaction = (requestID, actionName) => {
    const reason = Validator.evaluateFormData(this.TRANSACTION_FAILURE.fields);
    this.addLoadingRequestId(requestID);
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: this.ctHandler[actionName],
          variables: {
            id: requestID,
            reason: reason.justifyDescription,
          },
        })
        .then(() => {
          this.removeLoadingRequestId(requestID);
          Helper.toast(`Transaction ${actionName} successfully.`, 'success');
          resolve();
        })
        .catch(() => {
          this.removeLoadingRequestId(requestID, true);
          Helper.toast('Something went wrong please try again after sometime.', 'error');
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
    if (this.isNonTerminatedStatus) {
      this.requestState.skip = (skip === pageWiseCount) ?
        pageWiseCount - this.requestState.perPage : skip;
    } else {
      this.initRequest(this.transactionStatus);
    }
  }

  @computed get allRecords() {
    const transactions = this.db || [];
    if (this.isNonTerminatedStatus) {
      return transactions.slice(
        this.requestState.skip,
        this.requestState.displayTillIndex,
      );
    }
    return transactions || [];
  }

  @computed get transactionCount() {
    return this.isNonTerminatedStatus ?
      this.db.length
      : this.searchCount;
  }

  @computed get loading() {
    return this.data.loading;
  }

  statusWiseLimt = () => (this.isNonTerminatedStatus ? 100 : 10)

  @action
  initiateFilters = () => {
    this.resetPagination();
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

    if (dateFilterStart || dateFilterStop) {
      ClientDb.filterByDate(dateFilterStart, dateFilterStop || moment().unix(), 'startDate');
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
      searchparams[name] = valueObj && moment(valueObj.formattedValue, 'MM-DD-YYYY', true).isValid() ? DataFormatter.getDate(valueObj.formattedValue, !this.isNonTerminatedStatus, name, this.isNonTerminatedStatus) : '';
      if (this.requestState.search.dateFilterStart === '' && this.requestState.search.dateFilterStop === '') {
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
    return this.isNonTerminatedStatus ? this.initiateFilters()
      : this.initRequest(this.transactionStatus);
  }
}


export default new TransactionsStore();
