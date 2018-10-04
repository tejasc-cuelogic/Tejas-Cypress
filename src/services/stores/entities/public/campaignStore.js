import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../../../../api/gcoolApi';
import { GqlClient as clientPublic } from '../../../../api/publicApi';
import { allCampaigns, campaignDetailsQuery } from '../../queries/campagin';

export class CampaignStore {
  @observable data = [];
  @observable details = {};
  @observable option = false;
  @observable campaignSideBarShow = false;


  @action
  setFieldValue = (field, val) => {
    this[field] = val;
  }

  @action
  initRequest = () => {
    this.data = graphql({ client, query: allCampaigns });
  }

  @action
  getCampaignDetails = (id) => {
    this.details = graphql({
      client: clientPublic,
      query: campaignDetailsQuery,
      variables: { id },
    });
  }

  @computed get allData() {
    return this.data;
  }

  @computed get campaigns() {
    return (this.allData.data && this.allData.data.allCampaigns &&
      toJS(this.allData.data.allCampaigns)) || [];
  }

  @computed get campaign() {
    return (this.details.data && this.details.data.getOfferingDetailsById &&
      toJS(this.details.data.getOfferingDetailsById)) || [];
  }

  @computed get loading() {
    return this.allData.loading;
  }
}

export default new CampaignStore();
