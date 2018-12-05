import { observable, action, computed } from 'mobx';
import graphql from 'mobx-apollo';
import { orderBy } from 'lodash';
import { GqlClient as client } from '../../../../../api/gqlApi';
import { FormValidator as Validator, ClientDb } from '../../../../../helper';
import Helper from '../../../../../helper/utility';
import { UPDATES } from '../../../../constants/offering';
import { offeringCreationStore } from '../../../index';
import {
  allUpdates, newUpdate, getUpdate, editUpdate, approveUpdate, deleteOfferingUpdate,
} from '../../../queries/offering/Updates';

export class UpdateStore {
    @observable data = [];
    @observable filters = false;
    @observable currentUpdate = {};
    @observable requestState = {
      skip: 0,
      page: 1,
      perPage: 10,
      displayTillIndex: 10,
      search: {},
    };
    @observable db;
    @observable PBUILDER_FRM = Validator.prepareFormObject(UPDATES);

    @action
    initRequest = () => {
      const variables = { offerId: offeringCreationStore.currentOfferingId };
      this.data = graphql({
        client,
        query: allUpdates,
        variables,
        onFetch: (res) => {
          this.setDb(res.offeringUpdatesByOfferId);
        },
      });
    }

  @action
  setDb = (data) => {
    const orderedData = orderBy(data, ['updated.date'], ['desc']);
    this.db = ClientDb.initiateDb(orderedData);
  }


  @action
  initiateFilters = () => {
    const { keyword } = this.requestState.search;
    let resultArray = [];
    if (keyword) {
      resultArray = ClientDb.filterData('title', keyword, 'likenocase');
      this.setDb(resultArray);
      this.requestState.page = 1;
      this.requestState.skip = 0;
    } else {
      this.setDb(this.data.data.offeringUpdatesByOfferId);
    }
  }

    @action
    setInitiateSrch = (name, value) => {
      this.requestState.search[name] = value;
      this.initiateFilters();
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
          if (isManager && !isAlreadyPublished && status !== 'DRAFT') {
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
      this.reset();
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
    @action
    pageRequest = ({ skip, page }) => {
      this.requestState.displayTillIndex = this.requestState.perPage * page;
      this.requestState.page = page;
      this.requestState.skip = skip;
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
      return (this.db && this.db.length &&
        this.db.slice(this.requestState.skip, this.requestState.displayTillIndex)) || [];
    }

    @computed get loadingCurrentUpdate() {
      return this.currentUpdate.loading;
    }
    @computed get count() {
      return (this.db && this.db.length) || 0;
    }

    @action
    deleteOfferingUpdates = (id) => {
      const variables = { offerId: offeringCreationStore.currentOfferingId };
      client
        .mutate({
          mutation: deleteOfferingUpdate,
          variables: {
            id: [id],
          },
          refetchQueries: [{ query: allUpdates, variables }],
        }).then(() => {
          Helper.toast('Update deleted.', 'success');
        })
        .catch(() => Helper.toast('Error', 'error'));
    }

    @computed get loading() {
      return this.data.loading;
    }
}


export default new UpdateStore();
