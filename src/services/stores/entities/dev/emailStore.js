import { observable, action, computed, toJS, decorate } from 'mobx';
import { isArray } from 'lodash';
import moment from 'moment';
import DataModelStore, { decorateDefault } from '../shared/dataModelStore';
import { getEmailList } from '../../queries/users';
import Helper from '../../../../helper/utility';
import { FormValidator as Validator } from '../../../../helper';
import { EMAILLIST_META } from '../../../constants/admin/data';

export class EmailStore extends DataModelStore {
  constructor() {
    super({ getEmailList });
  }

  EMAIL_LIST_FRM = Validator.prepareFormObject(EMAILLIST_META);

  filters = true;

  emailLogList = [];

  requestState = {
    lek: { 'page-1': null },
    skip: 0,
    page: 1,
    perPage: 25,
    filters: false,
    search: {
    },
  };

  initRequest = async (reqParams) => {
    try {
      const { emailType, keyword, startDate, endDate } = this.requestState.search;
      const filters = toJS({ ...this.requestState.search });
      delete filters.keyword;
      this.requestState.page = (reqParams && reqParams.page) || this.requestState.page;
      this.requestState.perPage = (reqParams && reqParams.first) || this.requestState.perPage;
      let params = {
        search: keyword,
        recipientId: emailType || 'DEV',
        limit: this.requestState.perPage,
      };
      params = this.requestState.lek[`page-${this.requestState.page}`]
        ? { ...params, lek: this.requestState.lek[`page-${this.requestState.page}`] } : { ...params };

      if (startDate && endDate) {
        params = {
          ...params,
          ...{ fromDate: startDate, toDate: endDate },
        };
      }

      const data = await this.executeQuery({
        client: 'PRIVATE',
        query: 'getEmailList',
        variables: params,
        setLoader: 'getEmailList',
        fetchPolicy: 'network-only',
      });
      this.setFieldValue('emailLogList', data);
      const { lek } = data.fetchEmails;
      const requestStateObj = {
        ...this.requestState,
        lek: {
          ...this.requestState.lek,
          [`page-${this.requestState.page + 1}`]: lek,
        },
      };
      this.setFieldValue('requestState', requestStateObj);
    } catch (error) {
      Helper.toast('Something went wrong, please try again later.', 'error');
    }
  }

  initiateSearch = (srchParams) => {
    this.setFieldValue('requestState', { 'page-1': null }, 'lek');
    this.setFieldValue('requestState', 1, 'page');
    this.setFieldValue('requestState', srchParams, 'search');
    this.initRequest();
  }

  setInitiateSrch = (name, value) => {
    if (name === 'startDate' || name === 'endDate') {
      this.requestState.search[name] = value ? name === 'startDate' ? moment(new Date(`${value.formattedValue} 00:00:00`)).toISOString() : moment(new Date(`${value.formattedValue} 23:59:59`)).toISOString() : '';
      if ((this.requestState.search.startDate !== '' && this.requestState.search.endDate !== '')
        || (this.requestState.search.startDate === '' && this.requestState.search.endDate === '')
      ) {
        const srchParams = { ...this.requestState.search };
        this.initiateSearch(srchParams);
      }
    } else {
      const srchParams = { ...this.requestState.search };
      const temp = { ...this.requestState };
      // temp.search[name] = { ...this.requestState.search };
      this.setFieldValue(temp.search[name], { ...this.requestState.search });
      this.setFieldValue('requestState', temp);
      if ((isArray(value) && value.length > 0) || (typeof value === 'string' && value !== '')) {
        srchParams[name] = value;
      } else {
        delete srchParams[name];
      }
      this.initiateSearch(srchParams);
    }
  }

  get emailList() {
    return (this.emailLogList && this.emailLogList.fetchEmails
      && toJS(this.emailLogList.fetchEmails.emails)
    ) || [];
  }

  get count() {
    return (this.emailLogList && this.emailLogList.fetchEmails
      && toJS(this.emailLogList.fetchEmails.resultCount)
    ) || 0;
  }

  setFormData = (form, elemRef, elementValue, subForm = false) => {
    if (subForm) {
      this[form][subForm].fields[elemRef].value = elementValue;
    } else {
      this[form].fields[elemRef].value = elementValue;
    }
  }

  resetFilters = () => {
    this.requestState = {
      lek: { 'page-1': null },
      skip: 0,
      page: 1,
      perPage: 25,
      filters: false,
      search: {
      },
    };
    this.setFieldValue('emailLogList', []);
  }
}

decorate(EmailStore, {
  ...decorateDefault,
  EMAIL_LIST_FRM: observable,
  initRequest: action,
  emailList: computed,
  count: computed,
  resetFilters: action,
  emailLogList: observable,
  filters: observable,
  requestState: observable,
});

export default new EmailStore();
