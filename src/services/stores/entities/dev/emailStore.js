import { observable, action, computed, toJS, decorate } from 'mobx';
import { startCase } from 'lodash';
import DataModelStore, { decorateDefault } from '../shared/dataModelStore';
import { adminFetchEmails, fetchAdminListEmailTypesAndIdentifier } from '../../queries/users';
import Helper from '../../../../helper/utility';
import { FormValidator as Validator } from '../../../../helper';
import { EMAILLIST_META } from '../../../constants/admin/data';

export class EmailStore extends DataModelStore {
  constructor() {
    super({ adminFetchEmails, fetchAdminListEmailTypesAndIdentifier });
  }

  EMAIL_LIST_FRM = Validator.prepareFormObject(EMAILLIST_META);

  filters = true;

  emailLogList = [];

  listEmailTypes = [];

  listEmailIdentifiers = [];

  initRequest = async (reqParams) => {
    try {
      const { emailType, emailIdentifier, keyword, startDate, endDate } = this.requestState.search;
      const filters = toJS({ ...this.requestState.search });
      delete filters.keyword;
      this.requestState.page = (reqParams && reqParams.page) || this.requestState.page;
      this.requestState.perPage = (reqParams && reqParams.first) || this.requestState.perPage;
      let params = {
        search: keyword,
        recipientId: emailType || 'DEV',
        limit: this.requestState.perPage,
      };
      params = emailIdentifier ? { ...params, emailIdentifier } : { ...params };
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

  fetchAdminListEmailTypesAndIdentifier = async () => {
    try {
      const data = await this.executeQuery({
        client: 'PRIVATE',
        query: 'fetchAdminListEmailTypesAndIdentifier',
        variables: {},
        setLoader: 'adminListEmailType',
      });
      const listEmailType = [];
      if (data.adminListEmailType && data.adminListEmailType.length) {
        data.adminListEmailType.forEach((e) => {
          listEmailType.push({ key: e, value: e, text: startCase(e) });
        });
      }
      const listEmailIdentifiers = [];
      if (data.adminListEmailPluginsByIndex && data.adminListEmailPluginsByIndex.length) {
        data.adminListEmailPluginsByIndex.forEach((e) => {
          listEmailIdentifiers.push({ key: e.emailIdentifier, value: e.emailIdentifier, text: e.emailIdentifier });
        });
      }
      this.setFieldValue('listEmailTypes', listEmailType);
      this.setFieldValue('listEmailIdentifiers', listEmailIdentifiers);
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
  listEmailIdentifiers: observable,
  initRequest: action,
  fetchAdminListEmailTypesAndIdentifier: action,
  emailList: computed,
  count: computed,
  emailLogList: observable,
  filters: observable,
});

export default new EmailStore();
