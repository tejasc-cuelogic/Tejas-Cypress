/* eslint-disable no-underscore-dangle */
import { observable, computed, action, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import money from 'money-math';
import { pickBy, mapValues, values, map, sortBy, remove, findIndex, get, includes, orderBy, set } from 'lodash';
import { GqlClient as client } from '../../../../../api/gqlApi';
import { GqlClient as clientPublic } from '../../../../../api/publicApi';
import { STAGES, CAMPAIGN_KEYTERMS_SECURITIES_ENUM } from '../../../../constants/admin/offerings';
import {
  allOfferings, allOfferingsCompact, updateOffering,
  adminDeleteOffering, getOfferingDetails, getTotalAmount, setOrderForOfferings, getofferingById,
  getOfferingStoreDetails,
} from '../../../queries/offerings/manage';
import { offeringCreationStore, userStore, uiStore, campaignStore, collectionStore } from '../../../index';
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

  @observable orderedActiveLiveList = [];

  @observable offeringStorageDetails = null;

  @action
  initRequest = (props, forceResetDb = false) => new Promise(async (resolve) => {
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
      fetchPolicy: 'cache-and-network',
      onFetch: (res) => {
        if (res && !this.data[stage].loading && (!this.db[stage] || forceResetDb)) {
          this.requestState.page = 1;
          this.requestState.skip = 0;
          this.setDb(res.getOfferings, stage);
          if (stage === 'live') {
            this.orderedActiveListArr();
          }
          const stageValue = stage === 'live' ? 'LIVE' : 'COMPLETE';
          collectionStore.setFieldValue('collectionMappingList',
            res.getOfferings.filter(d => d.stage === stageValue).map(c => ({ key: c.id, text: c.offeringSlug, value: c.id })));
          resolve();
        }
      },
      onError: (err) => {
        Helper.toast('Something went wrong, please try again later.', 'error');
        window.logger(err);
      },
    });
  });

  @action
  setFieldValue = (field, value) => {
    this[field] = value;
  }

  @action
  updateOfferingPublicaly = (id, isAvailablePublicly) => {
    const { stage } = this.requestState;
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
        this.changePublicFlagForOffer(id, isAvailablePublicly, stage);
        Helper.toast('Offering updated successfully.', 'success');
      }).catch(() => {
        uiStore.removeOneFromProgressArray('publish');
        Helper.toast('Error while updating offering', 'error');
      });
  }

  @action
  updateLockOffering = (lockObj) => {
    const tempRef = this.offerData;
    this.offerData = set(tempRef, 'data.getOfferingDetailsBySlug.lock', lockObj);
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
    if (this.requestState.stage === 'live') {
      this.orderedActiveListArr();
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
        mutation: adminDeleteOffering,
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
  changePublicFlagForOffer = (id, isAvailablePublicly, stage) => {
    const db = { ...toJS(this.db) };
    const offer = db[this.requestState.stage].find(o => o.id === id);
    offer.isAvailablePublicly = isAvailablePublicly;
    this.db = { ...db };
    const data = { ...toJS(this.data) };
    const offerInData = data[this.requestState.stage].data.getOfferings.find(o => o.id === id);
    offerInData.isAvailablePublicly = isAvailablePublicly;
    this.data = { ...data };
    if (stage && stage === 'live') {
      this.orderedActiveListArr();
    }
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
    if (stage === 'live') {
      this.orderedActiveListArr();
    }
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
        if (this.requestState.stage === 'live') {
          this.orderedActiveListArr();
        }
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
      onFetch: (res) => {
        if (!this.offerDataLoading) {
          this.currentId = id;
          this.offerLoading = false;
          this.oldOfferData = {};
          const { setFormData, setCurrentOfferingId, setFieldValue } = offeringCreationStore;
          setFieldValue('currentOfferingSlug', id);
          setCurrentOfferingId(res.getOfferingDetailsBySlug.id);
          setFormData('OFFERING_DETAILS_FRM', false);
          setFormData('LAUNCH_CONTITNGENCIES_FRM', 'contingencies', false);
          setFormData('CLOSING_CONTITNGENCIES_FRM', 'contingencies', false);
        }
      },
      onError: () => {
        Helper.toast('Something went wrong, please try again later.', 'error');
      },
    });
  }

  @action
  getofferingById = id => new Promise((resolve) => {
    this.offerData = graphql({
      client,
      query: getofferingById,
      fetchPolicy: 'no-cache',
      variables: { id },
      onFetch: (res) => {
        if (!this.offerDataLoading) {
          resolve(res.getOfferingById.offeringSlug);
        }
      },
      onError: () => {
        Helper.toast('Something went wrong, please try again later.', 'error');
      },
    });
  });

  @action
  setOrderForOfferings = (newArr, stage, isMerge = false, indexVal) => {
    const offeringOrderDetails = [];
    newArr.forEach((item, index) => {
      offeringOrderDetails.push({
        offeringId: item.id,
        order: index + 1,
      });
      // eslint-disable-next-line no-param-reassign
      newArr[index].order = index + 1;
    });
    if (isMerge) {
      this.orderedActiveLiveList[indexVal].offerings = newArr;
    } else {
      this.setDb(newArr);
    }
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

  @action
  orderedActiveListArr = () => {
    const liveOfferingList = this.db.live
      && this.db.live.length ? toJS(this.db.live) : [];
    this.orderedActiveLiveList = campaignStore.generateBanner(liveOfferingList, true, true);
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

  @computed get issuerOfferings() {
    if (userStore.isIssuer) {
      const list = toJS(this.db[this.requestState.stage]);
      const offeringList = list && list.length ? list : [];
      const offeringListResult = this.orderedOfferingList(offeringList);
      return offeringListResult;
    }
    return [];
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
    return (this.offerData.data && toJS(this.offerData.data.getOfferingDetailsBySlug)) || {};
  }

  @computed get offerDataLoading() {
    return this.offerData.loading;
  }

  @computed get offerOld() {
    return (this.oldOfferData.data && toJS(this.oldOfferData.data.getOfferingDetailsBySlug)) || {};
  }

  @computed get loading() {
    return this.data[this.requestState.stage] && this.data[this.requestState.stage].loading;
  }

  @action resetInitLoad() {
    this.initLoad = [];
  }

  @action
  resetStoreData = () => {
    this.data = {};
    this.offerData = {};
    this.oldOfferData = {};
    this.db = {};
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

  orderedOfferingList = (offeringDetailsList) => {
    let offeringCreationArr = [];
    let offeringLiveArr = [];
    let offeringStartupArr = [];
    let offeringCompletedArr = [];
    let offeringFaildArr = [];

    offeringDetailsList.map((offeringDetails) => {
      if (offeringDetails.stage === 'CREATION') {
        return offeringCreationArr.push(offeringDetails);
      } if (offeringDetails.stage === 'LIVE') {
        return offeringLiveArr.push(offeringDetails);
      } if (offeringDetails.stage === 'STARTUP_PERIOD') {
        return offeringStartupArr.push(offeringDetails);
      } if (offeringDetails.stage === 'COMPLETE') {
        return offeringCompletedArr.push(offeringDetails);
      }
      return offeringFaildArr.push(offeringDetails);
    });

    offeringCreationArr = orderBy(offeringCreationArr, ['keyTerms.shorthandBusinessName'], ['asc']);
    offeringLiveArr = orderBy(offeringLiveArr, ['keyTerms.shorthandBusinessName'], ['asc']);
    offeringStartupArr = orderBy(offeringStartupArr, ['keyTerms.shorthandBusinessName'], ['asc']);
    offeringCompletedArr = orderBy(offeringCompletedArr, ['keyTerms.shorthandBusinessName'], ['asc']);
    offeringFaildArr = orderBy(offeringFaildArr, ['keyTerms.shorthandBusinessName'], ['asc']);

    const sortedResultObject = [
      ...offeringCreationArr,
      ...offeringLiveArr,
      ...offeringStartupArr,
      ...offeringCompletedArr,
      ...offeringFaildArr,
    ];
    return sortedResultObject;
  }

  @action
  getofferingStorageDetailBySlug = id => new Promise((resolve) => {
    this.offerLoading = true;
    this.offeringStorageDetails = graphql({
      client,
      query: getOfferingStoreDetails,
      fetchPolicy: 'no-cache',
      variables: { id },
      onFetch: (res) => {
        if (!this.offerLoading) {
          this.offerLoading = false;
          resolve(res.getOfferingDetailsBySlug.storageDetails);
        }
      },
      onError: () => {
        Helper.toast('Something went wrong, please try again later.', 'error');
      },
    });
  });

  @computed get offeringSecurity() {
    return get(this.offer, 'keyTerms.securities') || '';
  }

  @computed get offeringStatus() {
    const { offer } = this;
    const offeringStatus = {};
    offeringStatus.revenueSharingSummary = get(offer, 'keyTerms.revShareSummary');
    offeringStatus.isRevenueShare = this.offeringSecurity === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.REVENUE_SHARING_NOTE;
    offeringStatus.isTermNote = this.offeringSecurity === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.TERM_NOTE;
    offeringStatus.isFund = this.offeringSecurity === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.FUNDS;
    offeringStatus.isSafe = this.offeringSecurity === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.SAFE;
    offeringStatus.isConvertibleNotes = this.offeringSecurity === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.CONVERTIBLE_NOTES;
    offeringStatus.isEquity = this.offeringSecurity === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.EQUITY;
    offeringStatus.isRealEstate = ((this.offeringSecurity === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.EQUITY && get(offer, 'keyTerms.equityClass') === 'LLC_MEMBERSHIP_UNITS'));
    offeringStatus.isPreferredEquity = ((this.offeringSecurity === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.EQUITY && (get(offer, 'keyTerms.equityClass') === 'PREFERRED' || (['CLASS_A_SHARES', 'CLASS_B_SHARES', 'PARALLEL_CLASS_SHARES'].includes(get(offer, 'keyTerms.equityClass'))))));
    return offeringStatus;
  }
}

export default new OfferingsStore();
