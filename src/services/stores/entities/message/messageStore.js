import { toJS, observable, computed, action } from 'mobx';
import { filter, uniqBy, get } from 'lodash';
import graphql from 'mobx-apollo';
import moment from 'moment';
import { GqlClient as client } from '../../../../api/gqlApi';
import {
  offeringCommentsByOfferId, deleteMessage, createOfferingComments,
  offeringCommentsApprovedByInfo, updateOfferingCommentsInfo,
} from '../../queries/message';
import Helper from '../../../../helper/utility';
import { FormValidator as Validator } from '../../../../helper';
import { DRAFT_NEW } from '../../../constants/messages';
import { offeringCreationStore, campaignStore, offeringsStore } from '../../index';

export class NewMessage {
  @observable MESSAGE_FRM = Validator.prepareFormObject(DRAFT_NEW);
  @observable requestState = { search: {} };
  @observable data = [];
  @observable currentMessageId = null;
  @observable currentOfferingId = null;
  @observable currentOfferingIssuerId = get(offeringsStore.offerData, 'data.getOfferingById.issuerId');
  @observable editMessageId = null;
  @observable editScope = null;
  @observable buttonLoader = false;

  @action
  setDataValue = (key, value) => {
    this[key] = value;
  }

  @action
  setCommentForEdit = (id, comment, scope) => {
    this.editMessageId = id;
    this.editScope = scope;
    this.MESSAGE_FRM = Validator.onChange(this.MESSAGE_FRM, { name: 'comment', value: comment });
  }

  @action
  newPostComment = () => {
    if (this.data && this.data.data && this.data.data.offeringCommentsByOfferId
      && this.currentMessageId) {
      this.data.data.offeringCommentsByOfferId.splice(0, 0, {
        id: null,
        offeringId: this.data.data.offeringCommentsByOfferId[0].offeringId,
        thread: null,
        createdUserInfo: this.data.data.offeringCommentsByOfferId[0].createdUserInfo,
        created: { id: '', by: '', date: moment().toISOString() },
        comment: 'Post New Comment',
        scope: 'PUBLIC',
      });
    }
    this.setDataValue('currentMessageId', null);
    this.resetMessageForm();
  }

  @action
  initRequest = () => {
    this.data = graphql({
      client,
      query: offeringCommentsByOfferId,
      variables: { offerId: offeringCreationStore.currentOfferingId },
      fetchPolicy: 'network-only',
      onFetch: (data) => {
        if (data.offeringCommentsByOfferId && data.offeringCommentsByOfferId.length) {
          if (this.currentMessageId) {
            this.setDataValue('currentMessageId', this.currentMessageId);
          } else {
            this.setDataValue('currentMessageId', data.offeringCommentsByOfferId[0].id);
          }
        }
      },
    });
  }

  @action
  createNewComment = (scope) => {
    this.setDataValue('buttonLoader', scope);
    const data = Validator.ExtractValues(this.MESSAGE_FRM.fields);
    const payload = {
      commentInput: {
        offeringId: offeringCreationStore.currentOfferingId || this.currentOfferingId,
        scope,
        comment: data.comment,
      },
    };
    if (this.editMessageId) {
      payload.id = this.editMessageId;
    }
    if (this.currentMessageId) {
      payload.commentInput.thread = this.currentMessageId;
    }
    client
      .mutate({
        mutation: this.editMessageId ? updateOfferingCommentsInfo : createOfferingComments,
        variables: payload,
        refetchQueries: [{
          query: offeringCommentsByOfferId,
          variables: { offerId: offeringCreationStore.currentOfferingId },
        }],
      })
      .then(() => {
        if (!offeringCreationStore.currentOfferingId) {
          campaignStore.getCampaignDetails(this.currentOfferingId, false);
        }
        this.resetMessageForm();
        Helper.toast('Message sent.', 'success');
      })
      .catch(() => Helper.toast('Something went wrong please try again after sometime.', 'error'))
      .finally(() => this.setDataValue('buttonLoader', false));
  }

  @action
  approveComment = (e, id) => {
    e.preventDefault();
    this.setDataValue('buttonLoader', id);
    client
      .mutate({
        mutation: offeringCommentsApprovedByInfo,
        variables: {
          id,
        },
        refetchQueries: [{
          query: offeringCommentsByOfferId,
          variables: { offerId: offeringCreationStore.currentOfferingId },
        }],
      })
      .then(() => {
        this.resetMessageForm();
        Helper.toast('Message approved.', 'success');
      })
      .catch(() => Helper.toast('Something went wrong please try again after sometime.', 'error'))
      .finally(() => this.setDataValue('buttonLoader', false));
  }

  @action
  deleteMessage = id =>
    client
      .mutate({
        mutation: deleteMessage,
        variables: { id: [id] },
        refetchQueries: [{
          query: offeringCommentsByOfferId,
          variables: { offerId: offeringCreationStore.currentOfferingId },
        }],
      })
      .then(() => Helper.toast('Message deleted successfully.', 'success'))
      .catch(() => Helper.toast('Error while deleting message', 'error'));

  @computed get allData() {
    return this.data;
  }

  @computed get messages() {
    return (this.allData.data && this.allData.data.offeringCommentsByOfferId &&
      toJS(this.allData.data.offeringCommentsByOfferId)) || [];
  }

  @computed get error() {
    return (this.allData.error && this.allData.error.message) || null;
  }

  @computed get loading() {
    return this.allData.loading;
  }

  @computed get thread() {
    const msg = filter(this.messages, message => message.id === this.currentMessageId);
    return (msg && msg.length && msg[0].threadComments &&
      toJS(msg[0].threadComments)) || [];
  }

  @computed get threadMainMessage() {
    const msg = filter(this.messages, message => message.id === this.currentMessageId);
    return (msg && msg.length && msg[0] &&
      [toJS(msg[0])]) || [];
  }

  @computed get getSelectedMessage() {
    const msg = filter(
      campaignStore.campaign && campaignStore.campaign.comments,
      message => message.id === this.currentMessageId,
    );
    return (msg && msg.length && msg[0] &&
      toJS(msg[0])) || null;
  }

  threadUsersList = threadComments => uniqBy(threadComments, 'createdUserInfo.id');

  @action
  resetMessageForm = () => {
    this.editMessageId = null;
    this.editScope = null;
    this.MESSAGE_FRM = Validator.prepareFormObject(DRAFT_NEW);
  }

  @action
  msgEleChange = (e, result) => {
    this.MESSAGE_FRM = Validator.onChange(this.MESSAGE_FRM, Validator.pullValues(e, result));
  };
}

export default new NewMessage();
