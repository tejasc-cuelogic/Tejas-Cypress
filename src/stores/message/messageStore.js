import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import Validator from 'validatorjs';
import mapValues from 'lodash/mapValues';
import { GqlClient as client } from '../../services/graphqlCool';
import {
  allMessages, deleteMessage, messageThread, createMessage,
} from '../queries/message';
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
      fetchPolicy: 'network-only',
      query: messageThread,
      onFetch: () => {
        this.MESSAGE_FRM = { fields: { ...MESSAGES }, meta: { isValid: false, error: '' } };
      },
    });
  }

  @action
  send = () => {
    const data = mapValues(this.MESSAGE_FRM.fields, f => f.value);
    client
      .mutate({
        mutation: createMessage,
        variables: { subject: 'Hi..', body: data.body },
        refetchQueries: [{ query: allMessages }],
      })
      .then(() => Helper.toast('Message sent.', 'success'))
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
    const type = (e.target) ? e.target.type : '';
    const fieldName = typeof result === 'undefined' ? e.target.name : result.name;
    const fieldValue = typeof result === 'undefined' ? e.target.value : result.value;
    this.onFieldChange('MESSAGE_FRM', fieldName, fieldValue, type);
  };

  @action
  onFieldChange = (currentForm, field, value, type) => {
    const form = currentForm || 'formFinInfo';
    if (field) {
      if (type === 'checkbox' || Array.isArray(toJS(this[form].fields[field].value))) {
        const index = this[form].fields[field].value.indexOf(value);
        if (index === -1) {
          this[form].fields[field].value.push(value);
        } else {
          this[form].fields[field].value.splice(index, 1);
        }
      } else {
        this[form].fields[field].value = value;
      }
    }
    const validation = new Validator(
      mapValues(this[form].fields, f => f.value),
      mapValues(this[form].fields, f => f.rule),
    );
    this[form].meta.isValid = validation.passes();
    if (field) {
      this[form].fields[field].error = validation.errors.first(field);
    }
  };
}

export default new NewMessage();
