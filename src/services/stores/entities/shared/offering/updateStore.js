import { observable, action, computed, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../../../../../api/gqlApi';
import { FormValidator as Validator } from '../../../../../helper';
import Helper from '../../../../../helper/utility';
import { UPDATES } from '../../../../constants/offering';
import { offeringCreationStore } from '../../../index';
import {
  allUpdates, newUpdate, getUpdate, editUpdate, approveUpdate,
} from '../../../queries/offering/Updates';

export class UpdateStore {
    @observable data = [];
    @observable filters = false;
    @observable currentUpdate = {};
    @observable requestState = {
      search: {},
    };
    @observable PBUILDER_FRM = Validator.prepareFormObject(UPDATES);

    @action
    initRequest = () => {
      const variables = { offerId: offeringCreationStore.currentOfferingId };
      this.data = graphql({ client, query: allUpdates, variables });
    }

    @action
    setInitiateSrch = (name, value) => {
      this.requestState.search[name] = value;
      this.initRequest({ ...this.requestState.search });
    }

    @action
    toggleSearch = () => {
      this.filters = !this.filters;
    }

    @action
    UpdateChange = (e, result) => {
      this.PBUILDER_FRM = Validator.onChange(this.PBUILDER_FRM, Validator.pullValues(e, result));
    };

    @action
    FChange = (field, value) => {
      this.PBUILDER_FRM.fields[field].value = value;
      Validator.validateForm(this.PBUILDER_FRM);
    }

    @action
    save = (id, status, isManager = false, isAlreadyPublished = false) => {
      const data = Validator.ExtractValues(this.PBUILDER_FRM.fields);
      const variables = { offerId: offeringCreationStore.currentOfferingId };
      data.status = status;
      data.lastUpdate = this.lastUpdateText;
      data.offeringId = offeringCreationStore.currentOfferingId;
      data.isEarlyBirdOnly = false;
      client
        .mutate({
          mutation: id === 'new' ? newUpdate : editUpdate,
          variables: id === 'new' ? { updatesInput: data } :
            { ...{ updatesInput: data }, id },
          refetchQueries: [{ query: allUpdates, variables }],
        })
        .then((res) => {
          if (isManager && !isAlreadyPublished) {
            const UpdateId = res.data.createOfferingUpdates ?
              res.data.createOfferingUpdates.id : res.data.updateOfferingUpdatesInfo.id;
            this.approveUpdate(UpdateId);
          } else {
            Helper.toast('Update added.', 'success');
          }
          this.reset();
        })
        .catch(res => Helper.toast(`${res} Error`, 'error'));
    }

    @action
    approveUpdate = (id) => {
      const variables = { offerId: offeringCreationStore.currentOfferingId };
      client.mutate({
        mutation: approveUpdate,
        variables: { id },
        refetchQueries: [{ query: allUpdates, variables }],
      }).then(() => {
        Helper.toast('Update published.', 'success');
      })
        .catch(() => Helper.toast('Error', 'error'));
    }

    @action
    getOne = (id) => {
      this.currentUpdate = graphql({
        client,
        query: getUpdate,
        variables: { id },
        onFetch: (res) => {
          Object.keys(this.PBUILDER_FRM.fields).map((key) => {
            this.PBUILDER_FRM.fields[key].value = res.offeringUpdatesById[key];
            return null;
          });
          Validator.validateForm(this.PBUILDER_FRM);
        },
      });
    }

    @action
    reset = () => {
      this.PBUILDER_FRM = Validator.prepareFormObject(UPDATES);
    }

    @computed get lastUpdateText() {
      const { status } = Validator.ExtractValues(this.PBUILDER_FRM.fields);
      const lastUpdateMeta = {
        draft: 'saved as Draft',
        submit_for_approval: 'Brandon sent update for review',
      };
      return lastUpdateMeta[status];
    }

    @computed get updates() {
      return (this.data.data && toJS(this.data.data.offeringUpdatesByOfferId)) || [];
    }

    @computed get loading() {
      return this.data.loading;
    }
}


export default new UpdateStore();
