import { toJS, observable, computed, action } from 'mobx';
import graphql from 'mobx-apollo';
import { GqlClient as clientPublic } from '../../../../api/publicApi';
import { allOfferings, campaignDetailsQuery, getOfferingById } from '../../queries/campagin';

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
  initRequest = (stage) => {
    this.data =
    graphql({ client: clientPublic, query: allOfferings, variables: { filters: { stage } } });
  }

  @action
  getCampaignDetails = (id) => {
    this.details = graphql({
      client: clientPublic,
      query: campaignDetailsQuery,
      variables: { id },
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
    });
  });

  @computed get allData() {
    return this.data;
  }

  @computed get OfferingList() {
    return (this.allData.data && this.allData.data.getOfferingList &&
      toJS(this.allData.data.getOfferingList)) || [];
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
