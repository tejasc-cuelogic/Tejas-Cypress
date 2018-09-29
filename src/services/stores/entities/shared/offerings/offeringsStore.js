/* eslint-disable no-underscore-dangle, no-unused-vars */
import { observable, computed, action, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../../../../../api/gqlApi';
import {
  allOfferings, allOfferingsCompact, deleteOffering, getOfferingDetails,
} from '../../../queries/offerings/manage';
import { offeringCreationStore } from '../../../index';
import Helper from '../../../../../helper/utility';

export class OfferingsStore {
  @observable data = [];
  @observable filters = false;
  @observable offerData = {};
  @observable offerLoading = false;
  @observable phases = ['CREATION', 'LIVE', 'ENGAGEMENT', 'CLOSE', 'COMPLETE', 'FAILED', 'TERMINATED'];
  @observable subTabs = {
    creation: 35,
    live: 34,
    engagement: 76,
    completed: 40,
  };
  @observable requestState = {
    search: {},
    page: 1,
    perPage: 10,
    skip: 0,
  };

  @action
  initRequest = (props) => {
    const stageMap = {
      completed: ['CLOSE', 'COMPLETE', 'FAILED', 'TERMINATED'],
      active: ['CREATION', 'LIVE', 'ENGAGEMENT'],
    };
    const {
      first, skip, page, stage,
    } = props ||
    {
      first: this.requestState.perPage,
      skip: this.requestState.skip,
      page: this.requestState.page,
      stage: this.requestState.stage,
    };
    const params = {};
    this.requestState.page = page || this.requestState.page;
    this.requestState.perPage = first || this.requestState.perPage;
    this.requestState.skip = skip || this.requestState.skip;
    this.requestState.stage = stage || this.requestState.stage;
    this.data = graphql({
      client,
      query: stage === 'active' ? allOfferingsCompact : allOfferings,
      variables: {
        stage: stageMap[stage] || [stage.toUpperCase()],
        first: first || this.requestState.perPage,
        skip,
      },
    });
  }

  @action
  toggleSearch = () => {
    this.filters = !this.filters;
  }

  @action
  setInitiateSrch = (name, value) => {
    this.requestState.search[name] = value;
    this.initRequest({ ...this.requestState.search });
  }

  @action
  deleteOffering = (id) => {
    client
      .mutate({
        mutation: deleteOffering,
        variables: {
          id,
        },
        refetchQueries: [{ query: allOfferings }],
      })
      .then(() => Helper.toast('Offering deleted successfully.', 'success'))
      .catch(() => Helper.toast('Error while deleting offering', 'error'));
  }

  @action
  getOne = (id) => {
    this.offerLoading = true;
    this.offerData = graphql({
      client,
      query: getOfferingDetails,
      variables: { id },
      onFetch: (res) => {
        this.offerLoading = false;
        offeringCreationStore.setFormData('OFFERING_DETAILS_FRM', false);
        offeringCreationStore.setFormData('LAUNCH_CONTITNGENCIES_FRM', 'contingencies', false);
        offeringCreationStore.setFormData('CLOSING_CONTITNGENCIES_FRM', 'contingencies', false);
      },
    });
  }

  @computed get allPhases() {
    return this.phases;
  }

  @computed get totalRecords() {
    return (this.data.data && this.data.data.getOfferings &&
      this.data.data.getOfferings.count) || 0;
  }

  @computed get offerings() {
    return (this.data.data && toJS(this.data.data.getOfferings)) || [];
  }

  @computed get offer() {
    return (this.offerData.data && toJS(this.offerData.data.getOfferingById)) || {};
  }

  @computed get loading() {
    return this.data.loading;
  }
}

export default new OfferingsStore();
