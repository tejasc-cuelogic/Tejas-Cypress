import moment from 'moment';
import { observable, computed, action } from 'mobx';
import { GqlClient as client } from '../../../../api/gqlApi';
import { downloadFile } from '../../queries/statement';
import { uiStore, transactionStore, userDetailsStore } from '../../index';

export class StatementStore {
  @observable data = [];
  @observable tranStore = [];
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
            fileId,
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
    const statementObj = {
      field: 'statementDate',
      rangeParam: 'month',
      format: 'MMM YYYY',
      text: 'Monthly Statements',
      date: transactionStore.statementDate,
    };
    const dateRange = this.getDateRange(statementObj);
    return dateRange.map(d => (
      {
        [statementObj.field]: moment(d).format(statementObj.format),
        description: statementObj.text,
        fileId: '388a93e0-f7b4-11e8-b6c3-11b756c0f97f',
      }
    ));
  }

  getDateRange = (statementObj) => {
    const dateStart = moment(statementObj.date);
    const dateEnd = moment();
    const timeValues = [];
    while (dateStart.isBefore(dateEnd)) {
      timeValues.push(dateStart.format('MM/DD/YYYY'));
      dateStart.add(1, statementObj.rangeParam);
    }
    const fifthDate = moment().startOf('month').day(6);
    if (fifthDate > dateEnd) {
      timeValues.pop();
    }
    return timeValues.reverse();
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
    const { taxStatements } = userDetailsStore.currentActiveAccountDetails.details;
    return (taxStatements && taxStatements.length &&
      taxStatements.slice(this.requestState.skip, this.requestState.displayTillIndex)) || [];
  }

  @computed get loading() {
    return this.data.loading;
  }

  @computed get monthlyStatementcount() {
    return (this.allStatements && this.allStatements.length) || 0;
  }

  taxFormCount = () => {
    const { taxStatements } = userDetailsStore.currentActiveAccountDetails.details;
    return (taxStatements && taxStatements.length) || 0;
  }
}

export default new StatementStore();
