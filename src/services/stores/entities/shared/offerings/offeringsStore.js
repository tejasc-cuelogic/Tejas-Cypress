/* eslint-disable no-underscore-dangle */
import { observable, computed, action, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { pickBy, mapValues, values, map } from 'lodash';
import { GqlClient as client } from '../../../../../api/gqlApi';
import { GqlClient as clientPublic } from '../../../../../api/publicApi';
import { STAGES } from '../../../../constants/admin/offerings';
import {
  allOfferings, allOfferingsCompact, updateOffering,
  deleteOffering, getOfferingDetails, getTotalAmount,
} from '../../../queries/offerings/manage';
import { offeringCreationStore, userStore } from '../../../index';
import { ClientDb } from '../../../../../helper';
import Helper from '../../../../../helper/utility';

export class OfferingsStore {
  @observable data = [];
  @observable filters = false;
  @observable offerData = {};
  @observable oldOfferData = {};
  @observable offerLoading = false;
  @observable phases = STAGES;
  @observable subTabs = {
    creation: 35,
    live: 34,
    engagement: 76,
    completed: 40,
  };
  @observable requestState = {
    skip: 0,
    page: 1,
    perPage: 10,
    displayTillIndex: 10,
    search: {},
  };
  @observable db;
  @observable currentId = '';
  @observable initLoad = [];
  @observable totalRaisedAmount = [];

  @action
  initRequest = (props) => {
    const {
      stage,
    } = props;
    const reqStages = Object.keys(pickBy(STAGES, s => s.ref === stage));
    this.requestState.stage = stage;
    this.data = graphql({
      client,
      query: stage === 'active' ? allOfferingsCompact : allOfferings,
      variables: stage !== 'active' ? { stage: reqStages } :
        { stage: reqStages, ...{ issuerId: userStore.currentUser.sub } },
      fetchPolicy: 'network-only',
      onFetch: (res) => {
        if (res && !this.data.loading) {
          this.requestState.page = 1;
          this.requestState.skip = 0;
          this.setDb(res.getOfferings);
        }
      },
      onError: () => {
        Helper.toast('Something went wrong, please try again later.', 'error');
      },
    });
  }

  @action
  updateOfferingPublicaly = (id, isAvailablePublicly) => {
    const variables = {
      id,
      offeringDetails: { isAvailablePublicly },
    };
    client
      .mutate({
        mutation: updateOffering,
        variables,
      }).then(() => {
        this.initRequest(this.requestState);
        Helper.toast('Offering updated successfully.', 'success');
      }).catch(() => Helper.toast('Error while updating offering', 'error'));
  }

  @action
  getTotalAmount = () => {
    this.totalRaisedAmount = graphql({
      client: clientPublic,
      query: getTotalAmount,
      fetchPolicy: 'network-only',
    });
  }

  @computed get totalAmountRaised() {
    return (this.totalRaisedAmount.data &&
      toJS(this.totalRaisedAmount.data.getNSOfferingAmountRaised)) || [];
  }

  @action
  setDb = (data) => {
    const updatedData = map(data, d => (
      {
        ...d,
        BusinessName: d.keyTerms ? d.keyTerms.legalBusinessName : '',
      }));
    this.db = ClientDb.initiateDb(updatedData);
  }

  @action
  toggleSearch = () => {
    this.filters = !this.filters;
  }
  @action
  initiateFilters = () => {
    const { keyword } = this.requestState.search;
    if (keyword) {
      this.setDb(this.allOfferingsList);
      ClientDb.filterFromNestedObjs(['keyTerms.legalBusinessName', 'keyTerms.shorthandBusinessName'], keyword);
      this.db = ClientDb.getDatabase();
      this.requestState.page = 1;
      this.requestState.skip = 0;
    } else {
      this.setDb(this.allOfferingsList);
    }
  }
  @action
  setInitiateSrch = (name, value) => {
    this.requestState.search[name] = value;
    this.initiateFilters();
  }

  @action
  deleteOffering = (id) => {
    const reqStages = Object.keys(pickBy(STAGES, s => s.ref === this.requestState.stage));
    client
      .mutate({
        mutation: deleteOffering,
        variables: {
          id,
        },
        refetchQueries: [{
          query: allOfferings,
          variables: { stage: reqStages, ...{ issuerId: userStore.currentUser.sub } },
        }],
      })
      .then(() => Helper.toast('Offering deleted successfully.', 'success'))
      .catch(() => Helper.toast('Error while deleting offering', 'error'));
  }

  @action
  getOne = (id, loading = true) => {
    this.initLoad.push('getOne');
    if (loading) {
      this.offerLoading = true;
      this.oldOfferData = {};
    } else {
      this.oldOfferData = { ...this.offerData };
    }
    this.offerData = graphql({
      client,
      query: getOfferingDetails,
      fetchPolicy: 'no-cache',
      variables: { id },
      onFetch: () => {
        this.currentId = id;
        this.offerLoading = false;
        this.oldOfferData = {};
        const { setFormData } = offeringCreationStore;
        setFormData('OFFERING_DETAILS_FRM', false);
        setFormData('LAUNCH_CONTITNGENCIES_FRM', 'contingencies', false);
        setFormData('CLOSING_CONTITNGENCIES_FRM', 'contingencies', false);
        // offeringCreationStore.resetInitLoad();
      },
      onError: () => {
        Helper.toast('Something went wrong, please try again later.', 'error');
      },
    });
  }

  @computed get allPhases() {
    return values(mapValues(this.phases, s => s.ref.toUpperCase()));
  }

  @computed get allOfferingsList() {
    return (this.data.data && this.data.data.getOfferings &&
      toJS(this.data.data.getOfferings)) || [];
  }

  @computed get totalRecords() {
    return (this.data.data && this.data.data.getOfferings &&
      this.data.data.getOfferings.count) || 0;
  }

  @computed get offerings() {
    return (this.db && this.db.length &&
      this.db.slice(this.requestState.skip, this.requestState.displayTillIndex)) || [];
  }
  @action
  pageRequest = ({ skip, page }) => {
    this.requestState.displayTillIndex = this.requestState.perPage * page;
    this.requestState.page = page;
    this.requestState.skip = skip;
  }

  @computed get count() {
    return (this.db && this.db.length) || 0;
  }

  @computed get offer() {
    return (this.offerData.data && toJS(this.offerData.data.getOfferingById)) || {};
  }

  @computed get offerOld() {
    return (this.oldOfferData.data && toJS(this.oldOfferData.data.getOfferingById)) || {};
  }

  @computed get loading() {
    return this.data.loading;
  }
  @action resetInitLoad() {
    this.initLoad = [];
  }
}

export default new OfferingsStore();
