import * as moment from 'moment';
import { observable, computed, action } from 'mobx';
import { orderBy, find, get } from 'lodash';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../../../../api/gqlApi';
import { downloadFile, generateMonthlyStatementsPdf } from '../../queries/statement';
import { uiStore, userDetailsStore, transactionStore, accountStore } from '../../index';
import { DataFormatter } from '../../../../helper';


export class StatementStore {
  @observable data = [];

  @observable tranStore = [];

  @observable pdfLinkData = {};

  @observable requestState = {
    skip: 0,
    page: 1,
    perPage: 10,
    displayTillIndex: 10,
    search: {},
  };

  @observable taxFormsCount = 0;

  @observable isAdmin = false;

  @action
  setFieldValue = (field, value) => {
    this[field] = value;
  }

  @action
  handlePdfDownload = (fileId) => {
    window.logger(fileId);
    return new Promise((resolve, reject) => {
      this.pdfLinkData = graphql({
        client,
        query: downloadFile,
        variables: {
          fileId,
          accountType: 'SERVICES',
        },
        onFetch: (data) => {
          if (data && !this.pdfLinkData.loading) {
            if (data.getBoxDownloadLinkByFileId.preSignedUrl) {
              resolve(data.getBoxDownloadLinkByFileId.preSignedUrl);
            } else {
              uiStore.setErrors('Unable to Fetch the File');
              reject();
            }
          }
        },
        onError: () => reject(),
      });
    });
  }

  @action
  generateMonthlyStatementsPdf = (timeStamp) => {
    const year = parseFloat(moment(timeStamp, 'MMM YYYY').format('YYYY'));
    const month = parseFloat(moment(timeStamp, 'MMM YYYY').format('MM'));
    const account = this.isAdmin
      ? userDetailsStore.currentActiveAccountDetailsOfSelectedUsers
      : userDetailsStore.currentActiveAccountDetails;
    const { getDetailsOfUser } = userDetailsStore;
    let params = {
      year,
      month,
      accountId: account.details.accountId,
    };
    params = this.isAdmin ? { ...params, userId: getDetailsOfUser.id } : { ...params };
    return new Promise((resolve, reject) => {
      client
        .mutate({
          mutation: generateMonthlyStatementsPdf,
          variables: params,
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
        [statementObj.field]: moment(new Date(d)).format(statementObj.format),
        description: statementObj.text,
        fileId: moment(new Date(d)).format(statementObj.format),
      }
      // {
      //   [statementObj.field]: DataFormatter.getDateAsPerTimeZone(new Date(d), true, false, false, statementObj.format),
      //   description: statementObj.text,
      //   fileId: DataFormatter.getDateAsPerTimeZone(new Date(d), true, false, false, statementObj.format),
      // }
    ));
  }

  getDateRange = (statementObj) => {
    try {
      const dateStart = statementObj.date ? moment(new Date(statementObj.date)) : '';
      const dateEnd = moment();
      const timeValues = [];
      while (dateStart.isBefore(dateEnd) && !dateEnd.isSame(new Date(dateStart.format('MM/DD/YYYY')), 'month')) {
        timeValues.push(dateStart.format('MM/DD/YYYY'));
        dateStart.add(1, statementObj.rangeParam);
      }
      // const dateStart = statementObj.date ? DataFormatter.getCSTDateMomentObject(new Date(statementObj.date), true) : '';
      // const dateEnd = DataFormatter.getCurrentCSTMoment();
      // const timeValues = [];
      // while (dateStart.isBefore(dateEnd) && !dateEnd.isSame(new Date(dateStart.format('MM/DD/YYYY')), 'month')) {
      //   timeValues.push(dateStart);
      //   dateStart.add(1, statementObj.rangeParam);
      // }
      const fifthDateOfMonth = DataFormatter.getCurrentCSTMoment().startOf('month').day(6);
      if (fifthDateOfMonth > dateEnd) {
        timeValues.pop();
      }
      return timeValues.reverse();
    } catch (e) {
      return [];
    }
  }

  @action
  pageRequest = ({ skip, page }) => {
    const pageWiseCount = this.requestState.perPage * page;
    this.requestState.displayTillIndex = pageWiseCount;
    this.requestState.page = page;
    this.requestState.skip = (skip === pageWiseCount)
      ? pageWiseCount - this.requestState.perPage : skip;
  }

  @computed get monthlyStatements() {
    return (this.allStatements && this.allStatements.length
      && this.allStatements.slice(this.requestState.skip, this.requestState.displayTillIndex)) || [];
  }

  @computed get taxForms() {
    const { taxStatement } = this.isAdmin
      ? userDetailsStore.currentActiveAccountDetailsOfSelectedUsers.details
      : userDetailsStore.currentActiveAccountDetails.details;
    this.taxFormsCount = (taxStatement && taxStatement.length && orderBy(taxStatement, ['year'], ['desc'])
      .slice(this.requestState.skip, this.requestState.displayTillIndex)) || [];
    return this.taxFormsCount;
  }

  @computed get loading() {
    return this.data.loading;
  }

  @computed get monthlyStatementcount() {
    return (this.allStatements && this.allStatements.length) || 0;
  }

  taxFormCount = () => {
    const { taxStatement } = this.isAdmin
      ? userDetailsStore.currentActiveAccountDetailsOfSelectedUsers.details
      : userDetailsStore.currentActiveAccountDetails.details;
    return (taxStatement && taxStatement.length) || 0;
  }

  getTaxFormCountInNav = (accountType) => {
    const accDetails = find(userDetailsStore.userDetails.roles, account => account.name === accountType
      && account.name !== 'investor'
      && account && account.details
      && (account.details.accountStatus === 'FULL' || accountStore.isAccFrozen(account.details.accountStatus)));
    const taxStatement = get(accDetails, 'details.taxStatement');
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
