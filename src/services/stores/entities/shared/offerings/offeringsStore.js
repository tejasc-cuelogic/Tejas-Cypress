/* eslint-disable no-underscore-dangle */
import { observable, computed, action, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import money from 'money-math';
import { pickBy, mapValues, values, map, sortBy, remove, findIndex, get, includes } from 'lodash';
import { GqlClient as client } from '../../../../../api/gqlApi';
import { GqlClient as clientPublic } from '../../../../../api/publicApi';
import { STAGES } from '../../../../constants/admin/offerings';
import {
  allOfferings, allOfferingsCompact, updateOffering,
  deleteOffering, getOfferingDetails, getTotalAmount, setOrderForOfferings,
} from '../../../queries/offerings/manage';
import { offeringCreationStore, userStore, uiStore } from '../../../index';
import { ClientDb, DataFormatter } from '../../../../../helper';
import Helper from '../../../../../helper/utility';

export class OfferingsStore {
  @observable data = {};

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

  @observable db = {};

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
    this.data[stage] = graphql({
      client,
      query: stage === 'active' ? allOfferingsCompact : allOfferings,
      variables: stage !== 'active' ? { stage: reqStages }
        : { stage: reqStages, ...{ issuerId: userStore.currentUser.sub } },
      // fetchPolicy: 'network-only',
      onFetch: (res) => {
        if (res && !this.data[stage].loading && !this.db[stage]) {
          this.requestState.page = 1;
          this.requestState.skip = 0;
          this.setDb(res.getOfferings, stage);
        }
      },
      onError: (err) => {
        Helper.toast('Something went wrong, please try again later.', 'error');
        console.log(err);
      },
    });
  }

  @action
  setFieldValue = (field, value) => {
    this[field] = value;
  }

  @action
  updateOfferingPublicaly = (id, isAvailablePublicly) => {
    uiStore.addMoreInProgressArray('publish');
    const variables = {
      id,
      offeringDetails: { isAvailablePublicly },
    };
    client
      .mutate({
        mutation: updateOffering,
        variables,
      }).then(() => {
        uiStore.removeOneFromProgressArray('publish');
        this.changePublicFlagForOffer(id, isAvailablePublicly);
        Helper.toast('Offering updated successfully.', 'success');
      }).catch(() => {
        uiStore.removeOneFromProgressArray('publish');
        Helper.toast('Error while updating offering', 'error');
      });
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
    return (this.totalRaisedAmount.data
      && toJS(this.totalRaisedAmount.data.getNSOfferingAmountRaised)) || [];
  }

  @action
  setDb = (data, stage = false) => {
    const updatedData = map(data, d => (
      {
        ...d,
        BusinessName: d.keyTerms ? d.keyTerms.legalBusinessName : '',
      }));
    const tempDb = this.db;
    tempDb[stage || this.requestState.stage] = ClientDb.initiateDb(updatedData);
    this.db = { ...tempDb };
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
      const tempDb = this.db;
      tempDb[this.requestState.stage] = ClientDb.getDatabase();
      this.db = { ...tempDb };
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
    uiStore.addMoreInProgressArray('delete');
    client
      .mutate({
        mutation: deleteOffering,
        variables: {
          id,
        },
      })
      .then(() => {
        this.removeOneFromData(id);
        uiStore.removeOneFromProgressArray('delete');
        Helper.toast('Offering deleted successfully.', 'success');
      })
      .catch(() => {
        uiStore.removeOneFromProgressArray('delete');
        Helper.toast('Error while deleting offering', 'error');
      });
  }

  @action
  changePublicFlagForOffer = (id, isAvailablePublicly) => {
    const db = { ...toJS(this.db) };
    const offer = db[this.requestState.stage].find(o => o.id === id);
    offer.isAvailablePublicly = isAvailablePublicly;
    this.db = { ...db };
    const data = { ...toJS(this.data) };
    const offerInData = data[this.requestState.stage].data.getOfferings.find(o => o.id === id);
    offerInData.isAvailablePublicly = isAvailablePublicly;
    this.data = { ...data };
  }

  @action
  removeOneFromData = (id, Stage) => {
    const stage = Stage || this.requestState.stage;
    const db = { ...toJS(this.db) };
    remove(db[stage], i => i.id === id);
    remove(db.overview, i => i.id === id);
    ClientDb.initiateDb(db);
    this.db = { ...db };
    const data = { ...toJS(this.data) };
    if (data[stage]) {
      remove(data[stage].data.getOfferings, i => i.id === id);
    }
    if (data.overview) {
      remove(data.overview.data.getOfferings, i => i.id === id);
    }
    this.data = { ...data };
  }

  @action
  addNewOne = (offer, Stage) => {
    const stage = Stage || this.requestState.stage;
    const db = { ...toJS(this.db) };
    if (db[stage]) {
      db[stage].unshift(offer);
      ClientDb.initiateDb(db);
      this.db = { ...db };
    }
    const data = { ...toJS(this.data) };
    if (data[stage]) {
      data[stage].data.getOfferings.unshift(offer);
      this.data = { ...data };
    }
  }

  @action
  updateOfferingList = (id, payload, key) => {
    const db = { ...toJS(this.db) };
    const data = { ...toJS(this.data) };
    if (Object.keys(db).length === 0 && Object.keys(data).length === 0) {
      return;
    }
    const offerIndex = findIndex(db[this.requestState.stage], o => o.id === id);
    const offerIndexInData = findIndex(data[this.requestState.stage].data.getOfferings, o => o.id === id);
    if (key === 'CLOSEOFFERING') {
      this.removeOneFromData(id, 'live');
      this.addNewOne(payload, 'completed');
    } else if (key === 'LAUNCHOFFERING') {
      this.removeOneFromData(id, 'creation');
      this.addNewOne(payload, 'live');
    } else {
      if (offerIndex !== -1) {
        db[this.requestState.stage][offerIndex] = { ...db[this.requestState.stage][offerIndex], ...payload };
        ClientDb.initiateDb(db);
        this.db = { ...db };
      }
      if (offerIndexInData !== -1) {
        data[this.requestState.stage].data.getOfferings[offerIndexInData] = { ...data[this.requestState.stage].data.getOfferings[offerIndexInData], ...payload };
        this.data = { ...data };
      }
    }
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

  @action
  setOrderForOfferings = (newArr, stage) => {
    const offeringOrderDetails = [];
    newArr.forEach((item, index) => {
      offeringOrderDetails.push({
        offeringId: item.id,
        order: index + 1,
      });
      // eslint-disable-next-line no-param-reassign
      newArr[index].order = index + 1;
    });
    this.setDb(newArr);
    client
      .mutate({
        mutation: setOrderForOfferings,
        variables: { offeringOrderDetails },
      }).then(() => {
        Helper.toast('Order updated successfully.', 'success');
        this.initRequest({ stage });
      }).catch(() => {
        Helper.toast('Error while updating order', 'error');
      });
  }

  @computed get allPhases() {
    return values(mapValues(this.phases, s => s.ref.toUpperCase()));
  }

  @computed get allOfferingsList() {
    const data = toJS(this.data[this.requestState.stage]);
    return (data && data.data
      && data.data.getOfferings
      && toJS(data.data.getOfferings)) || [];
  }

  @computed get totalRecords() {
    return (this.data[this.requestState.stage].data
      && this.data[this.requestState.stage].data.getOfferings
      && this.data[this.requestState.stage].data.getOfferings.count) || 0;
  }

  @computed get allOfferingsSorted() {
    return this.db[this.requestState.stage]
    && this.db[this.requestState.stage].length ? toJS(sortBy(this.db[this.requestState.stage], ['order'])) : [];
  }

  @computed get allOfferings() {
    return this.db[this.requestState.stage]
    && this.db[this.requestState.stage].length ? this.db[this.requestState.stage] : [];
  }

  @computed get offerings() {
    const list = toJS(this.db[this.requestState.stage]);
    return (list && list.length
      && list
        .slice(this.requestState.skip, this.requestState.displayTillIndex)) || [];
  }

  @action
  pageRequest = ({ skip, page }) => {
    this.requestState.displayTillIndex = this.requestState.perPage * page;
    this.requestState.page = page;
    this.requestState.skip = skip;
  }

  @action
  resetPagination = () => {
    this.requestState.skip = 0;
    this.requestState.page = 1;
    this.requestState.perPage = 10;
    this.requestState.displayTillIndex = 10;
  }

  @computed get count() {
    return (this.db[this.requestState.stage] && this.db[this.requestState.stage].length) || 0;
  }

  @computed get offer() {
    return (this.offerData.data && toJS(this.offerData.data.getOfferingById)) || {};
  }

  @computed get offerOld() {
    return (this.oldOfferData.data && toJS(this.oldOfferData.data.getOfferingById)) || {};
  }

  @computed get loading() {
    return this.data[this.requestState.stage].loading;
  }

  @action resetInitLoad() {
    this.initLoad = [];
  }

  @computed get closingBinderDocs() {
    const closingBinder = get(this.offer, 'closingBinder') || [];
    const filteredData = closingBinder.filter(c => c.aliasAccreditedOnly).map(c => ({ name: c.name, documentId: get(c, 'upload.fileHandle.boxFileId') }));
    return filteredData;
  }

  @computed get offerStatus() {
    const offerStatus = {};
    const { offer } = this;
    offerStatus.collected = get(offer, 'closureSummary.totalInvestmentAmount') || 0;
    const closeDate = offer.closureSummary && offer.closureSummary.processingDate;
    offerStatus.hoursToClose = DataFormatter.diffDays(closeDate, true) + 24;
    const offeringRegulation = get(offer, 'keyTerms.regulation');
    const minOffering = get(offer, 'keyTerms.minOfferingAmountCF') || 0;
    const minOfferingD = get(offer, 'keyTerms.minOfferingAmount506') && get(offer, 'keyTerms.minOfferingAmount506') !== '0.00' ? get(offer, 'keyTerms.minOfferingAmount506') : get(offer, 'keyTerms.minOfferingAmount506C') ? get(offer, 'keyTerms.minOfferingAmount506C') : '0.00';
    offerStatus.minOffering = parseFloat(get(offer, 'keyTerms.regulation') === 'BD_CF_506C' ? money.add(minOfferingD, minOffering) : includes(['BD_506C', 'BD_506B'], offeringRegulation) ? minOfferingD : minOffering);
    offerStatus.isFailed = !(offerStatus.collected >= offerStatus.minOffering);
    offerStatus.diff = DataFormatter.diffDays(closeDate || null, false, true);
    offerStatus.diffForProcessing = DataFormatter.getDateDifferenceInHoursOrMinutes(closeDate, true, true);
    offerStatus.countDown = (includes(['Minute Left', 'Minutes Left'], offerStatus.diffForProcessing.label) && offerStatus.diffForProcessing.value > 0) || offerStatus.diffForProcessing.value < 48 ? { valueToShow: offerStatus.diffForProcessing.value, labelToShow: offerStatus.diffForProcessing.label } : { valueToShow: offerStatus.diff, labelToShow: offerStatus.diff === 1 ? 'Day Left' : 'Days Left' };
    offerStatus.offeringLiveTitle = offerStatus.diff < 0 || offerStatus.diffForProcessing.value === 0 ? 'Close Date' : offerStatus.diffForProcessing.value < 48 ? `${offerStatus.diffForProcessing.label} Till Close` : 'Days Till Close';
    offerStatus.offeringLiveContent = closeDate ? offerStatus.diff < 0 || offerStatus.diffForProcessing.value === 0 ? closeDate : offerStatus.diffForProcessing.value < 48 ? `${offerStatus.diffForProcessing.value} ${offerStatus.diffForProcessing.label}` : DataFormatter.diffInDaysHoursMin(closeDate).diffText : 'N/A';
    return offerStatus;
  }
}

export default new OfferingsStore();
