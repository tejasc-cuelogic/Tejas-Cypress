import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../../services/graphqlCool';
import { allMessages, deleteMessage, messageThread } from '../queries/message';
import Helper from '../../helper/utility';
import { MESSAGES } from '../../constants/messages';

export class NewMessage {
  @observable MESSAGE_FRM = { fields: { ...MESSAGES }, meta: { isValid: false, error: '' } };
  @observable data = [];
  @observable current = {};
  @observable message = {};

  @action
  initRequest = () => {
    this.current = {};
    this.data = graphql({
      client,
      query: allMessages,
    });
  }

  @action
  getMessageDetails = (id) => {
    this.current = { id };
    this.message = graphql({
      client,
      query: messageThread,
    });
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
}

export default new NewMessage();
