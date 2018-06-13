import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../../services/graphqlCool';
import { allMessages } from '../queries/message';
import { MESSAGES } from './../../constants/messages';

export class NewMessage {
  @observable MESSAGE_FRM = { fields: { ...MESSAGES }, meta: { isValid: false, error: '' } };
  @observable data = [];
  @observable message = {};

  @action
  initRequest = () => {
    this.message = {};
    this.data = graphql({
      client,
      query: allMessages,
    });
  }

  @action
  getMessageDetails = (id) => {
    this.message = { id };
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
}

export default new NewMessage();
