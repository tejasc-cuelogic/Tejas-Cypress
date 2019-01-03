import moment from 'moment';
import { observable, computed, action } from 'mobx';
import { GqlClient as client } from '../../../../api/gqlApi';
import { downloadFile } from '../../queries/statement';
import { uiStore, transactionStore } from '../../index';

export class StatementStore {
  @observable data = [];
  @observable tranStore = [];
  @observable activeModule = null;
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

  @computed
  get allStatements() {
    const statementObj = (this.activeModule === 'MonthlyStatements') ? {
      field: 'statementDate',
      rangeParam: 'month',
      format: 'MMM YYYY',
      text: 'Monthly Statements',
    } :
      {
        field: 'taxFormDate',
        rangeParam: 'year',
        format: 'YYYY',
        text: 'Tax Forms',
      };
    const dateRange = this.getDateRange(statementObj.rangeParam);
    const descriptionKey = this.activeModule === 'MonthlyStatements' ? 'description' : 'types';
    return dateRange.map(d => (
      {
        [statementObj.field]: moment(d).format(statementObj.format),
        [descriptionKey]: statementObj.text,
      }
    ));
  }

  @action
  setActiveModule(statementType) {
    this.activeModule = statementType;
  }

  getDateRange = (rangeParam) => {
    const dateStart = moment(transactionStore.statementDate);
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
    return (this.allStatements && this.allStatements.length &&
      this.allStatements.slice(this.requestState.skip, this.requestState.displayTillIndex)) || [];
  }

  @computed get taxForms() {
    return (this.allStatements && this.allStatements.length &&
      this.allStatements.slice(this.requestState.skip, this.requestState.displayTillIndex)) || [];
  }

  @computed get loading() {
    return this.data.loading;
  }

  @computed get error() {
    return (this.allData && this.allData.error && this.allData.error.message) || null;
  }

  @computed get count() {
    return (this.allStatements && this.allStatements.length) || 0;
  }
}

export default new StatementStore();
