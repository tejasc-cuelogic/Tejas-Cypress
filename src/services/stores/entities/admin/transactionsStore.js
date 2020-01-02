import { observable, action, computed } from 'mobx';
import { isArray, get, forOwn, filter, find, findIndex, has } from 'lodash';
import graphql from 'mobx-apollo';
import moment from 'moment';
import { transferRequestAdminSync, adminGetTransactions, transferRequestAdminApprove, transferRequestAdminVerified, declineTransferRequest } from '../../queries/transaction';
import { GqlClient as client } from '../../../../api/gqlApi';
import Helper from '../../../../helper/utility';
import { ClientDb, FormValidator as Validator } from '../../../../helper';
import DataFormatter from '../../../../helper/utilities/DataFormatter';
import { TRANSACTION_FAILURE, COUNT_STATUS_MAPPING } from '../../../constants/admin/transactions';

export class TransactionsStore {
  nonTerminatedStatuses = ['PRE_PENDING', 'PENDING', 'PROCESSING']

  ctHandler = {
    Approved: transferRequestAdminApprove,
    Declined: declineTransferRequest,
    Verified: transferRequestAdminVerified,
    Failed: declineTransferRequest,
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
    const transactions = get(this.data, 'data.adminGetTransactions.transactions');
    if (isApproved && transactions) {
      this.data.data.adminGetTransactions.transactions = filter(transactions, row => row.requestId !== requestId);
    } else if (transactions) {
      const index = findIndex(transactions, record => record.requestId === requestId);
      const transaction = find(transactions, record => record.requestId === requestId);
      transaction.gsProcessId = true;
      this.data.data.adminGetTransactions.transactions[index] = transaction;
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
    const payLoad = {
      status: transStatus,
      offset: this.requestState.page,
      limit: 10,
      ...this.requestState.search,
    };
    this.data = graphql({
      client,
      query: adminGetTransactions,
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
    if (get(data, 'adminGetTransactions')) {
      this.setDb(DataFormatter.mapDatesToType(data.adminGetTransactions.transactions, ['startDate', 'failDate', 'estDateAvailable'], 'unix'));
      this.searchCount = data.adminGetTransactions.transactionCount.searchCount;
      this.setTabCount(data.adminGetTransactions.transactionCount);
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
    const data = Validator.evaluateFormData(this.TRANSACTION_FAILURE.fields);
    this.addLoadingRequestId(requestID);
    let variables = {
      id: requestID,
      reason: data.justifyDescription,
    };
    variables = ['Declined', 'Failed'].includes(actionName) ? { ...variables, cancelInvestment: data.cancelInvestment || false } : { ...variables };
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: this.ctHandler[actionName],
          variables,
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
    if (result && (result.type === 'checkbox')) {
      this[form].fields[result.name].value = result.checked;
    } else {
      this[form] = Validator.onChange(
        this[form],
        Validator.pullValues(e, result),
      );
    }
  }

  @action
  pageRequest = ({ page }) => {
    const pageWiseCount = this.requestState.perPage * page;
    this.requestState.displayTillIndex = pageWiseCount;
    this.requestState.page = page;
    this.initRequest(this.transactionStatus);
  }

  @computed get allRecords() {
    return this.db || [];
  }

  @computed get transactionCount() {
    return this.searchCount;
  }

  @computed get loading() {
    return this.data.loading;
  }

  modifySearchParams = (valueObj, name) => {
    const searchparams = { ...this.requestState.search };
    const { value } = valueObj;
    if ((isArray(value) && value.length > 0) || (typeof value === 'string' && value !== '')) {
      searchparams[name] = value;
    } else {
      delete searchparams[name];
    }
    return searchparams;
  }

  @action
  setInitiateSrch = (valueObj, name) => {
    const searchparams = { ...this.requestState.search };
    if (name === 'dateFilterStart' || name === 'dateFilterStop') {
      if (moment(valueObj.formattedValue, 'MM-DD-YYYY', true).isValid()) {
        // searchparams[name] = valueObj ? moment(new Date(valueObj.formattedValue)).add(1, 'day').toISOString() : '';
        searchparams[name] = valueObj ? name === 'dateFilterStart' ? moment(new Date(`${valueObj.formattedValue} 00:00:00`)).toISOString() : moment(new Date(`${valueObj.formattedValue} 23:59:59`)).toISOString() : '';
        this.requestState.search = searchparams;
        this.initRequest(this.transactionStatus);
      } else {
        delete searchparams[name];
        this.requestState.search = searchparams;
        if (!has(this.requestState.search, 'dateFilterStart') && !has(this.requestState.search, 'dateFilterStop')) {
          this.initRequest(this.transactionStatus);
        }
      }
    } else {
      this.requestState.search = this.modifySearchParams(valueObj, name);
      this.initRequest(this.transactionStatus);
    }
    return null;
  }
}


export default new TransactionsStore();
