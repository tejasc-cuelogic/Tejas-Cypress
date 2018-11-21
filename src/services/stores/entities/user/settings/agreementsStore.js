import { toJS, observable, action, computed } from 'mobx';
import graphql from 'mobx-apollo';
import { forEach } from 'lodash';
import { GqlClient as client } from '../../../../../api/gcoolApi';
import { allAgreements } from '../../../queries/agreements';

export class AgreementsStore {
  @observable agreementsList = [];
  @observable agreements = {
    welcomeKit: {
      title: 'Welcome Packet',
      boxRef: {
        demo: 'v7damnl8jh75ize4xrbu8dl0lj0rvxja',
        develop: 'qda0prkhki8pk9lxr8dc4vlstwgmia5b',
        qa: 'rbiewvvoyz787xempqimccrzxgjism7l',
      },
    },
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
    const agreementsList = this.getAgreementsList;
    const navList = [];
    forEach(agreementsList, (ele) => {
      navList.push({ title: ele.title, to: ele.id, url: ele.url });
    });
    return navList;
  }

  @action
  fetchNavItems = () => new Promise((resolve) => {
    this.agreementsList = graphql({
      client,
      query: allAgreements,
      fetchPolicy: 'network-only',
      onFetch: () => {
        resolve();
      },
    });
  })

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
