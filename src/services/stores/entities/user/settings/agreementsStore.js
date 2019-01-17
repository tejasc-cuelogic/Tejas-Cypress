import { toJS, observable, computed, action } from 'mobx';
import { forEach } from 'lodash';
import graphql from 'mobx-apollo';
import { GqlClient as client } from '../../../../../api/publicApi';
import { getBoxEmbedLink, getLegalDocsFileIds } from '../../../queries/agreements';

export class AgreementsStore {
  @observable legalDocsList = [];
  @observable agreements = [
    {
      key: 'cCAgreement',
      title: 'Crowdpay Custodial Agreement',
      refEnum: 'CROWDPAY_CUSTODIAL_AGREEMENT',
    },
    {
      key: 'irsCertification',
      title: 'Subsitute IRS Form W-9 Certification',
      refEnum: 'IRS_W9_CERTIFICATION',
    },
    {
      key: 'businessPan',
      title: 'businessPan',
      refEnum: 'BUSINESS_PLAN_101',
    },
    {
      key: 'welcomeKit',
      title: 'Welcome Packet',
      refEnum: 'INVESTOR_WELCOME_PACKET',
    },
    {
      key: 'fPAgreemnt',
      title: 'Nextseed Funding Portal Agreement',
      refEnum: 'MEMBERSHIP_AGREEMENT',
    },
    {
      key: 'bDIAgreemnt',
      title: 'NextSeed Broker-Dealer Investor Agreement',
      refEnum: 'SECURITIES_INVESTOR_AGREEMENT',
    },
  ];
  @observable embedUrl = null;
  @observable docLoading = false;
  @observable docIdsLoading = false;
  @observable alreadySet = false;

  @computed get getAgreementsList() {
    return toJS(this.agreements);
  }

  @action
  setField = (key, status) => {
    this[key] = status;
  }

  @action
  setAgreementUrl = (of, url) => {
    const index = this.agreements.findIndex(ele => ele.key === of);
    this.agreements[index].embedUrl = url;
    this.embedUrl = url;
  }

  @action
  getBoxEmbedLink = (of, fileId) => {
    this.setField('docLoading', true);
    const fId = fileId || toJS(this.agreements).find(ele => ele.key === of).id;
    client.mutate({
      mutation: getBoxEmbedLink,
      variables: { fileId: fId },
    }).then((res) => {
      this.setAgreementUrl(of, res.data.getBoxEmbedLink);
      this.setField('docLoading', false);
    }).catch(() => this.setField('docLoading', false));
  }

  @action
  setNavItemsIds = (data) => {
    const agreementsList = this.getAgreementsList;
    const navList = [];
    forEach(agreementsList, (ele) => {
      navList.push({ ...ele, id: data[ele.refEnum] });
    });
    this.agreements = [...navList];
  }
  @computed get getNavItems() {
    const agreementsList = this.getAgreementsList;
    const navList = [];
    forEach(agreementsList, (ele) => {
      if (ele.key !== 'welcomeKit' && ele.key !== 'businessPan') {
        navList.push({ title: ele.title, to: ele.key, id: ele.id });
      }
    });
    return navList;
  }

  getBoxLink = fileId =>
    client.mutate({
      mutation: getBoxEmbedLink,
      variables: { fileId },
    });

  getLegalDocsFileIds = () => new Promise((resolve) => {
    this.setField('docIdsLoading', true);
    graphql({
      client,
      query: getLegalDocsFileIds,
      onFetch: (data) => {
        if (data) {
          this.setNavItemsIds(data.getLegalDocsFileIds);
          this.setField('alreadySet', true);
          this.setField('docIdsLoading', false);
          resolve(data);
        }
      },
    });
  });

  @action
  setFileIdsData = (meta, data) => {
    meta.forEach((item) => {
      const newItem = { ...item };
      newItem.boxId = data[item.refEnum];
      this.legalDocsList.push(newItem);
    });
  }
}

export default new AgreementsStore();
