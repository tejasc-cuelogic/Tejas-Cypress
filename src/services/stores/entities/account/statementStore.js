import moment from 'moment';
import { observable, computed, action } from 'mobx';
import { GqlClient as client } from '../../../../api/gqlApi';
import { downloadFile } from '../../queries/statement';
import { uiStore, transactionStore } from '../../index';

export class StatementStore {
  @observable data = [];
  @observable tranStore = []
  @observable requestState = {
    skip: 0,
    page: 1,
    perPage: 10,
    displayTillIndex: 10,
    search: {},
  };

  @action
  handlePdfDownload = (fileId) => {
    console.log(fileId);
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: downloadFile,
          variables: {
            fileId: '77e03730-9a34-11e8-9eb6-529269fb1459',
            // fileId,
          },
        })
        .then((result) => {
          if (result.data) {
            const { preSignedUrl } = result.data.downloadFile;
            resolve(preSignedUrl);
          } else {
            reject();
          }
        })
        .catch((error) => {
          uiStore.setErrors(error.message);
          reject(error);
        });
    });
  }

  @action
  allStatements = (statementObj) => {
    const dateRange = this.getDateRange(statementObj.rangeParam);
    const descriptionKey = statementObj.text === 'Monthly statement' ? 'description' : 'types';
    this.data = dateRange.map(d => (
      {
        [statementObj.field]: moment(d).format(statementObj.format),
        [descriptionKey]: statementObj.text,
      }
    ));
  }

  getDateRange = (rangeParam) => {
    const dateStart = moment(this.getTransactionDate());
    const dateEnd = moment();
    const timeValues = [];
    while (dateStart.isBefore(dateEnd)) {
      timeValues.push(dateStart.format('MM/DD/YYYY'));
      dateStart.add(1, rangeParam);
    }
    return timeValues.reverse();
  }

  getTransactionDate = () => {
    const allTransactions = transactionStore.getAllTransactions;
    return allTransactions.transactions[0].date;
  }

  @action
  pageRequest = ({ skip, page }) => {
    const pageWiseCount = this.requestState.perPage * page;
    this.requestState.displayTillIndex = pageWiseCount;
    this.requestState.page = page;
    this.requestState.skip = (skip === pageWiseCount) ?
      pageWiseCount - this.requestState.perPage : skip;
  }

  @computed get monthlyStatements() {
    return (this.data && this.data.length &&
      this.data.slice(this.requestState.skip, this.requestState.displayTillIndex)) || [];
  }

  @computed get taxForms() {
    return (this.data && this.data.length &&
      this.data.slice(this.requestState.skip, this.requestState.displayTillIndex)) || [];
  }

  @computed get loading() {
    return this.data.loading;
  }

  @computed get error() {
    return (this.allData && this.allData.error && this.allData.error.message) || null;
  }

  @computed get count() {
    return (this.data && this.data.length) || 0;
  }
}

export default new StatementStore();
