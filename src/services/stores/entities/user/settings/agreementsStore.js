import { toJS, observable, computed } from 'mobx';
import { forEach } from 'lodash';

export class AgreementsStore {
  @observable agreementsList = [];
  @observable agreements = {
    cCAgreement: {
      title: 'Crowdpay Custodial Agreement',
      boxRef: {
        demo: 'u8y3ul3l4fb8qwnewn5u2nyikt7t2lmo',
        develop: 'xkcu623s6p4279qxh07j89x73jeo6kcb',
        qa: 'kaizhkgfv0u3i6byx4toru2700373zaw',
      },
    },
    irsCertification: {
      title: 'Subsitute IRS Form W-9 Certification',
      boxRef: {
        demo: 'jb8xswuegog9f1466k78ldwocc2gxmv8',
        develop: '8acqrch3361a9xy1u6ey8rl86v278nfb',
        qa: 'cidf554o3crhtd0vbbw0h2pq0br2gncx',
      },
    },
    membershipAgreement: {
      title: 'NextSeed US LLC Membership Agreement',
      boxRef: {
        demo: 'zczuyza7blkv8erfr1m9bituhmw8qqg9',
        develop: 'z84yqcjpn58glkd0um9ibiro3n353sja',
        qa: '8crhx2vddztxdnnmvs391j9mss2imqfv',
      },
    },
  }

  @computed get getAgreementsList() {
    return (this.agreementsList && this.agreementsList.data &&
      toJS(this.agreementsList.data.allAgreements)) || [];
  }

  @computed get getNavItems() {
    const agreementsList = this.agreements;
    const navList = [];
    forEach(agreementsList, (ele, idx) => {
      navList.push({ title: ele.title, to: idx, url: ele.boxRef.develop });
    });
    return navList;
  }

  getCurrentEnv = () => process.env.REACT_APP_DEPLOY_ENV;

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
