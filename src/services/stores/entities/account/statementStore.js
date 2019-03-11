import moment from 'moment';
import { observable, computed, action } from 'mobx';
import { orderBy } from 'lodash';
import { GqlClient as client } from '../../../../api/gqlApi';
import { downloadFile, generateMonthlyStatementsPdf } from '../../queries/statement';
import { uiStore, userDetailsStore, transactionStore } from '../../index';

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

  @action
  generateMonthlyStatementsPdf = (timeStamp) => {
    const year = parseFloat(moment(timeStamp, 'MMM YYYY').format('YYYY'));
    const month = parseFloat(moment(timeStamp, 'MMM YYYY').format('MM'));
    const account = userDetailsStore.currentActiveAccountDetails;
    const { userDetails } = userDetailsStore;
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: generateMonthlyStatementsPdf,
          variables: {
            year,
            month,
            userId: userDetails.id,
            accountId: account.details.accountId,
          },
        })
        .then((result) => {
          if (result.data) {
            const { pdfUrl } = result.data.generateMonthlyStatementsPdf;
            resolve(pdfUrl);
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
        fileId: moment(d).format(statementObj.format),
      }
    ));
  }

  getDateRange = (statementObj) => {
    const dateStart = moment(statementObj.date);
    const dateEnd = moment();
    const timeValues = [];
    while (dateStart.isBefore(dateEnd) && !dateEnd.isSame(dateStart.format('MM/DD/YYYY'), 'month')) {
      timeValues.push(dateStart.format('MM/DD/YYYY'));
      dateStart.add(1, statementObj.rangeParam);
    }
    const fifthDateOfMonth = moment().startOf('month').day(6);
    if (fifthDateOfMonth > dateEnd) {
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
    const { taxStatement } = userDetailsStore.currentActiveAccountDetails.details;
    return (taxStatement && taxStatement.length && orderBy(taxStatement, ['year'], ['desc'])
      .slice(this.requestState.skip, this.requestState.displayTillIndex)) || [];
  }

  @computed get loading() {
    return this.data.loading;
  }

  @computed get monthlyStatementcount() {
    return (this.allStatements && this.allStatements.length) || 0;
  }

  taxFormCount = () => {
    const { taxStatement } = userDetailsStore.currentActiveAccountDetails.details;
    return (taxStatement && taxStatement.length) || 0;
  }

  @action
  resetPagination = () => {
    this.requestState = {
      skip: 0,
      page: 1,
      perPage: 10,
      displayTillIndex: 10,
      search: {},
    };
  }
}

export default new StatementStore();
