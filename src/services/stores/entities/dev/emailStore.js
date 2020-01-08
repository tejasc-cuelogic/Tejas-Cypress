import { observable, action, computed, toJS, decorate } from 'mobx';
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
}

decorate(EmailStore, {
  ...decorateDefault,
  EMAIL_LIST_FRM: observable,
  initRequest: action,
  emailList: computed,
  count: computed,
  emailLogList: observable,
  filters: observable,
});

export default new EmailStore();
