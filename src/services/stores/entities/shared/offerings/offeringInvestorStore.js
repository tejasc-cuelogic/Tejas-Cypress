/* eslint-disable no-underscore-dangle */
import { observable, computed, action, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { orderBy, get, find, map, cloneDeep, isEmpty } from 'lodash';
import moment from 'moment';
import { GqlClient as client } from '../../../../../api/gqlApi';
import { getInvestorListForOffering } from '../../../queries/offering/investor';
import { ClientDb } from '../../../../../helper';
import { offeringsStore } from '../../../index';
import Helper from '../../../../../helper/utility';

export class OfferingInvestorStore {
  @observable data = [];

  @observable filters = false;

  @observable requestState = {
    skip: 0,
    page: 1,
    perPage: 10,
    displayTillIndex: 10,
    search: {},
  };

  @observable db;

  @observable sortOrder = {
    column: null,
    direction: 'asc',
  }

  @action
  setData = (key, value) => {
    this[key] = value;
  }

  @action
  setDb = (data) => {
    this.db = ClientDb.initiateDb(data, null, null, null, true);
  }

  @action
  initRequest = (offeringId) => {
    this.data = graphql({
      client,
      query: getInvestorListForOffering,
      variables: { offeringId },
      fetchPolicy: 'network-only',
      onFetch: (res) => {
        if (res && !this.data.loading) {
          this.requestState.page = 1;
          this.requestState.skip = 0;
          const data = this.filterReferralData(res.getInvestorListForOffering);
          this.setDb(data);
        }
      },
      onError: () => {
        Helper.toast('Something went wrong, please try again later.', 'error');
      },
    });
  }

  @action
  initiateFilters = () => {
    const { keyword } = this.requestState.search;
    if (keyword) {
      this.setDb(this.allInvestorList);
      ClientDb.filterFromNestedObjs(['firstName', 'lastName', 'city'], keyword);
      this.db = ClientDb.getDatabase();
      this.requestState.page = 1;
      this.requestState.skip = 0;
    } else {
      this.setDb(this.allInvestorList);
    }
  }

  @action
  setInitiateSrch = (name, value) => {
    this.requestState.search[name] = value;
    this.initiateFilters();
  }

  @computed get allInvestorList() {
    return (this.data.data && this.data.data.getInvestorListForOffering
      && toJS(this.data.data.getInvestorListForOffering)) || [];
  }

  @computed get investorLists() {
    if (this.sortOrder.column && this.sortOrder.direction && this.db) {
      return orderBy(
        this.db,
        [user => (this.sortOrder.column === 'investmentDate' ? moment(user[this.sortOrder.column]).unix() : (this.sortOrder.column === 'amount' || this.sortOrder.column === 'earlyBirdEligibility') ? user[this.sortOrder.column]
          : user[this.sortOrder.column] && user[this.sortOrder.column].toString().toLowerCase())],
        [this.sortOrder.direction],
      );
    }
    return this.db || [];
    // return (this.db && this.db.length &&
    //   this.db.slice(this.requestState.skip, this.requestState.displayTillIndex)) || [];
  }

  @computed get investorListsForCsvExport() {
    const { offer } = offeringsStore;
    const referralCode = get(offer, 'referralCode');
    const investorList = map(toJS(this.investorLists), (i) => {
      const investorObj = cloneDeep(toJS({ ...i }));
      // eslint-disable-next-line no-param-reassign
      ['street', 'streetTwo'].forEach((el) => { investorObj[el] = !isEmpty(investorObj[el]) ? investorObj[el].split(',').join(' ') : null; });
      const matchReferral = find(investorObj.referralCode, r => r.code === referralCode);
      const iReferralCode = (matchReferral && get(matchReferral, 'isValid')) ? get(matchReferral, 'code') : '';
      return { ...investorObj, referralCode: iReferralCode };
    });
    return investorList;
  }

  @action
  setSortingOrder = (column = null, direction = null) => {
    this.sortOrder.column = column;
    // this.sortOrder.listData = listData;
    this.sortOrder.direction = direction;
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

  @computed get loading() {
    return this.data.loading;
  }

  filterReferralData = (prevData) => {
    const filteredArr = [];
    const { offer } = offeringsStore;
    const offerRefCode = get(offer, 'referralCode');
    prevData.forEach((obj) => {
      if (obj.referralCode) {
        const matchReferral = find(obj.referralCode, r => r.code === offerRefCode);
        filteredArr.push(matchReferral ? obj : { ...obj, referralCode: null });
      } else {
        filteredArr.push(obj);
      }
    });
    return filteredArr;
  }
}

export default new OfferingInvestorStore();
