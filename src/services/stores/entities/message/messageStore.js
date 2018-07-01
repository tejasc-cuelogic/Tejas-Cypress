import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../../../../api/gcoolApi';
import {
  allMessages, deleteMessage, messageThread, createMessage,
} from '../../queries/message';
import Helper from '../../../../helper/utility';
import { FormValidator as Validator } from '../../../../helper';
import { DRAFT_NEW } from '../../constants/messages';

export class NewMessage {
  @observable MESSAGE_FRM = Validator.prepareFormObject(DRAFT_NEW);
  @observable requestState = { search: {} };
  @observable data = [];
  @observable current = {};
  @observable message = {};

  @action
  initRequest = () => {
    this.current = {};
    this.data = graphql({ client, query: allMessages });
  }

  @action
  getMessageDetails = (id) => {
    this.current = { id };
    this.message = graphql({
      client,
      fetchPolicy: 'network-only',
      query: messageThread,
      onFetch: () => {
        this.MESSAGE_FRM = Validator.prepareFormObject(DRAFT_NEW);
      },
    });
  }

  @action
  send = () => {
    const data = Validator.ExtractValues(this.MESSAGE_FRM.fields);
    client
      .mutate({
        mutation: createMessage,
        variables: { subject: 'Hi..', body: data.body },
        refetchQueries: [{ query: allMessages }],
      })
      .then(() => {
        Helper.toast('Message sent.', 'success');
        this.MESSAGE_FRM = Validator.prepareFormObject(DRAFT_NEW);
      })
      .catch(() => Helper.toast('Error while sending message', 'error'));
  }

  @action
  deleteMessage = id =>
    client
      .mutate({
        mutation: deleteMessage,
        variables: { id },
        refetchQueries: [{ query: allMessages }],
      })
      .then(() => Helper.toast('Message deleted successfully.', 'success'))
      .catch(() => Helper.toast('Error while deleting message', 'error'));

  @action
  setInitiateSrch = (name, value) => {
    if (name === 'startDate' || name === 'endDate') {
      this.requestState.search[name] = value;
      if (this.requestState.search.startDate !== '' && this.requestState.search.endDate !== '') {
        const srchParams = { ...this.requestState.search };
        this.initiateSearch(srchParams);
      }
    } else {
      const srchParams = { ...this.requestState.search };
      if ((Array.isArray(value) && value.length > 0) || (typeof value === 'string' && value !== '')) {
        srchParams[name] = value;
      } else {
        delete srchParams[name];
      }
      this.initiateSearch(srchParams);
    }
  }

  @action
  initiateSearch = (srchParams) => {
    this.requestState.search = srchParams;
    this.initRequest();
  }

  @computed get allData() {
    return this.data;
  }

  @computed get messages() {
    return (this.allData.data && this.allData.data.allMessages &&
      toJS(this.allData.data.allMessages)) || [];
  }

  @computed get error() {
    return (this.allData.error && this.allData.error.message) || null;
  }

  @computed get loading() {
    return this.allData.loading;
  }

  @computed get thread() {
    return (this.message.data && this.message.data.allMessages &&
      toJS(this.message.data.allMessages)) || [];
  }

  @computed get tError() {
    return (this.message.error && this.message.error.message) || null;
  }

  @computed get tLoading() {
    return this.message.loading;
  }

  /*
    Send Message
  */
  @action
  msgEleChange = (e, result) => {
    this.MESSAGE_FRM = Validator.onChange(this.MESSAGE_FRM, Validator.pullValues(e, result));
  };
}

export default new NewMessage();
