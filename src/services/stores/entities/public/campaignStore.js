import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../../../../api/gcoolApi';
import { allCampaigns, campaignDetailsQuery } from '../../queries/campagin';

export class CampaignStore {
  @observable data = [];
  @observable details = {};
  @observable option = false;


  @action
  initRequest = () => {
    this.data = graphql({ client, query: allCampaigns });
  }

  @action
  getCampaignDetails = (id) => {
    this.details = graphql({ client, query: campaignDetailsQuery, variables: { id } });
  }

  @computed get allData() {
    return this.data;
  }

  @computed get campaigns() {
    return (this.allData.data && this.allData.data.allCampaigns &&
      toJS(this.allData.data.allCampaigns)) || [];
  }

  @computed get campaign() {
    return (this.details.data && this.details.data.Campaign &&
      toJS(this.details.data.Campaign)) || [];
  }

  @computed get loading() {
    return this.allData.loading;
  }
}

export default new CampaignStore();
