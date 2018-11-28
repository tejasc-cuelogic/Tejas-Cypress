import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import { pickBy } from 'lodash';
import { GqlClient as clientPublic } from '../../../../api/publicApi';
import { allOfferings, campaignDetailsQuery, getOfferingById, campaignDetailsForInvestmentQuery } from '../../queries/campagin';
import { STAGES } from '../../../constants/admin/offerings';

export class CampaignStore {
  @observable data = [];
  @observable details = {};
  @observable option = false;
  @observable campaignSideBarShow = false;
  @observable selectedReadMore = {};
  @observable selectedReadLess = {};
  @observable RECORDS_TO_DISPLAY = 9;
  @observable completedToDisplay = this.RECORDS_TO_DISPLAY;
  @observable activeToDisplay = this.RECORDS_TO_DISPLAY;

  @action
  setFieldValue = (field, val) => {
    this[field] = val;
  }

  @action
  initRequest = (publicRef) => {
    const stage = Object.keys(pickBy(STAGES, s => publicRef.includes(s.publicRef)));
    this.data =
      graphql({
        client: clientPublic,
        query: allOfferings,
        variables: { filters: { stage } },
      });
  }

  @action
  getCampaignDetails = (id, queryType) => {
    this.details = graphql({
      client: clientPublic,
      query: queryType ? campaignDetailsForInvestmentQuery : campaignDetailsQuery,
      variables: { id },
      fetchPolicy: 'network-only',
    });
  }

  @action
  getIssuerIdForOffering = id => new Promise((resolve) => {
    this.details = graphql({
      client: clientPublic,
      query: getOfferingById,
      variables: { id },
      onFetch: (data) => {
        if (data) {
          resolve(data.getOfferingDetailsById);
        }
      },
      fetchPolicy: 'network-only',
    });
  });

  @computed get allData() {
    return this.data;
  }

  @computed get OfferingList() {
    return (this.allData.data && this.allData.data.getOfferingList &&
      toJS(this.allData.data.getOfferingList)) || [];
  }

  @computed get active() {
    const offeringList = this.activeList.slice();
    return offeringList.splice(0, this.activeToDisplay);
  }

  @computed get activeList() {
    return this.OfferingList.filter(o => Object.keys(pickBy(STAGES, s => s.publicRef === 'active')).includes(o.stage));
  }

  @computed get completed() {
    const offeringList = this.completedList.slice();
    return offeringList.splice(0, this.completedToDisplay);
  }
  @computed get completedList() {
    return this.OfferingList.filter(o => Object.keys(pickBy(STAGES, s => s.publicRef === 'completed')).includes(o.stage));
  }
  @action
  loadMoreRecord = (type) => {
    const offeringsList = type === 'completedToDisplay' ? this.completedList : this.activeList;
    if (offeringsList.length > this[type]) {
      this[type] = this[type] + 9;
    }
  }

  @action
  resetDisplayCounts = () => {
    this.completedToDisplay = 9;
    this.activeToDisplay = 9;
  }

  @computed get campaign() {
    return (this.details.data && this.details.data.getOfferingDetailsById &&
      toJS(this.details.data.getOfferingDetailsById)) || null;
  }

  @computed get getOfferingId() {
    return (this.campaign && this.campaign.id);
  }

  @computed get loading() {
    return this.allData.loading;
  }
  @action
  setInitialStateForReadMoreAndReadLess(updatesData) {
    if (updatesData.length) {
      this.selectedReadMore = updatesData.map(() => true);
      this.selectedReadLess = updatesData.map(() => true);
    }
  }
  @computed get curretnStatusForReadMore() {
    return this.selectedReadMore;
  }
  @computed get curretnStatusForReadLess() {
    return this.selectedReadLess;
  }
  @action
  handleReadMoreReadLess(index) {
    const newReadMoreStatus = [...this.selectedReadMore];
    newReadMoreStatus[index] = !this.selectedReadMore[index];
    this.selectedReadMore = newReadMoreStatus;

    const newReadLessStatus = [...this.selectedReadLess];
    newReadLessStatus[index] = !this.selectedReadLess[index];
    this.selectedReadLess = newReadLessStatus;
  }

  @computed get minInvestAmt() {
    return this.campaign && this.campaign.keyTerms ? this.campaign.keyTerms.minInvestAmt : null;
  }

  @computed get maxInvestAmt() {
    return this.campaign && this.campaign.keyTerms ? this.campaign.keyTerms.maxInvestAmt : null;
  }
}

export default new CampaignStore();
