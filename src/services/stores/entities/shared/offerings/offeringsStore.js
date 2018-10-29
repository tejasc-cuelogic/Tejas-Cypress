/* eslint-disable no-underscore-dangle */
import { observable, computed, action, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { pickBy, mapValues, values } from 'lodash';
import { GqlClient as client } from '../../../../../api/gqlApi';
import { STAGES } from '../../../../constants/admin/offerings';
import {
  allOfferings, allOfferingsCompact, deleteOffering, getOfferingDetails,
} from '../../../queries/offerings/manage';
import { offeringCreationStore, userStore } from '../../../index';
import Helper from '../../../../../helper/utility';

export class OfferingsStore {
  @observable data = [];
  @observable filters = false;
  @observable offerData = {};
  @observable offerLoading = false;
  @observable phases = STAGES;
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
    const {
      first, skip, page, stage,
    } = props ||
    {
      first: this.requestState.perPage,
      skip: this.requestState.skip,
      page: this.requestState.page,
      stage: this.requestState.stage,
    };
    this.requestState.page = page || this.requestState.page;
    this.requestState.perPage = first || this.requestState.perPage;
    this.requestState.skip = skip || this.requestState.skip;
    this.requestState.stage = stage || this.requestState.stage;
    const reqStages = Object.keys(pickBy(STAGES, s => s.ref === stage));
    const params = {
      first: first || this.requestState.perPage,
      skip,
    };
    if (reqStages.length > 0) {
      params.stage = reqStages;
    }
    this.data = graphql({
      client,
      query: stage === 'active' ? allOfferingsCompact : allOfferings,
      variables: stage !== 'active' ? params :
        { ...params, ...{ issuerId: userStore.currentUser.sub } },
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
      fetchPolicy: 'network-only',
      variables: { id },
      onFetch: () => {
        this.offerLoading = false;
        const { setFormData } = offeringCreationStore;
        setFormData('OFFERING_DETAILS_FRM', false);
        setFormData('LAUNCH_CONTITNGENCIES_FRM', 'contingencies', false);
        setFormData('CLOSING_CONTITNGENCIES_FRM', 'contingencies', false);
      },
    });
  }

  @computed get allPhases() {
    return values(mapValues(this.phases, s => s.ref.toUpperCase()));
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
