/* eslint-disable no-underscore-dangle */
import { observable, computed, action, toJS } from 'mobx';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../../../../../api/gqlApi';
import { getInvestorListForOffering } from '../../../queries/offering/investor';
import { ClientDb } from '../../../../../helper';
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

  @action
  setData = (key, value) => {
    this[key] = value;
  }

  @action
  setDb = (data) => {
    this.db = ClientDb.initiateDb(data);
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
          this.setDb(res.getInvestorListForOffering);
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
    return (this.data.data && this.data.data.getInvestorListForOffering &&
      toJS(this.data.data.getInvestorListForOffering)) || [];
  }

  @computed get investorLists() {
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

  @computed get loading() {
    return this.data.loading;
  }
}

export default new OfferingInvestorStore();