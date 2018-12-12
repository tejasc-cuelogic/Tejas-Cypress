import { toJS, observable, computed, action } from 'mobx';
import { forEach } from 'lodash';
import { GqlClient as client } from '../../../../../api/publicApi';
import { getBoxEmbedLink } from '../../../queries/agreements';

export class AgreementsStore {
  @observable agreements = {
    cCAgreement: {
      title: 'Crowdpay Custodial Agreement',
      boxRef: { demo: '350609225244', develop: '350628768734', qa: '350614281589' },
    },
    irsCertification: {
      title: 'Subsitute IRS Form W-9 Certification',
      boxRef: { demo: '350621936982', develop: '350612351853', qa: '350633121944' },
    },
    membershipAgreement: {
      title: 'NextSeed US LLC Membership Agreement',
      boxRef: { demo: '350617165075', develop: '350612483063', qa: '350616705574' },
    },
    welcomeKit: {
      title: 'Welcome Packet',
      boxRef: { demo: '350613582871', develop: '350632240634', qa: '350638909011' },
    },
  }
  @observable embedUrl = null;
  @observable docLoading = false;

  @computed get getAgreementsList() {
    return toJS(this.agreements);
  }

  @action
  setLoading = (status) => {
    this.docLoading = status;
  }

  @action
  setAgreementUrl = (of, url) => {
    this.agreements[of].embedUrl = url;
    this.embedUrl = url;
  }

  @action
  getBoxEmbedLink = (of, fileId) => {
    this.docLoading = true;
    const boxFileId = fileId || this.getAgreementsList[of].boxRef[this.getCurrentEnv()];
    console.log(this.getAgreementsList, of, this.getCurrentEnv());
    client.mutate({
      mutation: getBoxEmbedLink,
      variables: { fileId: boxFileId },
    }).then((res) => {
      this.setAgreementUrl(of, res.data.getBoxEmbedLink);
      this.setLoading(false);
    }).catch(() => this.setLoading(false));
  }

  @computed get getNavItems() {
    const agreementsList = this.getAgreementsList;
    const navList = [];
    forEach(agreementsList, (ele, idx) => {
      if (idx !== 'welcomeKit') {
        navList.push({ title: ele.title, to: idx, url: ele.boxRef.develop });
      }
    });
    return navList;
  }

  getCurrentEnv = () => (process.env.REACT_APP_DEPLOY_ENV === 'localhost' ? 'develop' :
    process.env.REACT_APP_DEPLOY_ENV);

  @computed
  get ccAgreementId() {
    if (this.agreements.cCAgreement.boxRef[this.getCurrentEnv()]) {
      return this.agreements.cCAgreement.boxRef[this.getCurrentEnv()];
    }
    return this.agreements.cCAgreement.boxRef.develop;
  }

  @computed
  get irsCertificationId() {
    if (this.agreements.irsCertification.boxRef[this.getCurrentEnv()]) {
      return this.agreements.irsCertification.boxRef[this.getCurrentEnv()];
    }
    return this.agreements.irsCertification.boxRef.develop;
  }

  @computed
  get membershipAgreementId() {
    if (this.agreements.membershipAgreement.boxRef[this.getCurrentEnv()]) {
      return this.agreements.membershipAgreement.boxRef[this.getCurrentEnv()];
    }
    return this.agreements.membershipAgreement.boxRef.develop;
  }
}

export default new AgreementsStore();
