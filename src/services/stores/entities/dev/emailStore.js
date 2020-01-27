import { observable, action, computed, toJS, decorate } from 'mobx';
import { startCase } from 'lodash';
import DataModelStore, { decorateDefault } from '../shared/dataModelStore';
import { adminFetchEmails, adminListEmailType } from '../../queries/users';
import Helper from '../../../../helper/utility';
import { FormValidator as Validator } from '../../../../helper';
import { EMAILLIST_META } from '../../../constants/admin/data';

export class EmailStore extends DataModelStore {
  constructor() {
    super({ adminFetchEmails, adminListEmailType });
  }

  EMAIL_LIST_FRM = Validator.prepareFormObject(EMAILLIST_META);

  filters = true;

  emailLogList = [];

  listEmailTypes = [];

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
        query: 'adminFetchEmails',
        variables: params,
        setLoader: 'adminFetchEmails',
        fetchPolicy: 'network-only',
      });
      this.setFieldValue('emailLogList', data);
      const { lek } = data.adminFetchEmails;
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

  fetchAdminListEmailTypes = async () => {
    try {
      const data = await this.executeQuery({
        client: 'PRIVATE',
        query: 'adminListEmailType',
        variables: {},
        setLoader: 'adminListEmailType',
      });
      const listEmailType = [];
      if (data.adminListEmailType && data.adminListEmailType.length) {
        data.adminListEmailType.forEach((e) => {
          listEmailType.push({ key: e, value: e, text: startCase(e) });
        });
      }
      this.setFieldValue('listEmailTypes', listEmailType);
    } catch (error) {
      Helper.toast('Something went wrong, please try again later.', 'error');
    }
  }

  get emailList() {
    return (this.emailLogList && this.emailLogList.adminFetchEmails
      && toJS(this.emailLogList.adminFetchEmails.emails)
    ) || [];
  }

  get count() {
    return (this.emailLogList && this.emailLogList.adminFetchEmails
      && toJS(this.emailLogList.adminFetchEmails.resultCount)
    ) || 0;
  }
}

decorate(EmailStore, {
  ...decorateDefault,
  EMAIL_LIST_FRM: observable,
  listEmailTypes: observable,
  initRequest: action,
  fetchAdminListEmailTypes: action,
  emailList: computed,
  count: computed,
  emailLogList: observable,
  filters: observable,
});

export default new EmailStore();
