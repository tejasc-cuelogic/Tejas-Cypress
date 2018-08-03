import { toJS, observable, action, computed } from 'mobx';
import graphql from 'mobx-apollo';
import { forEach } from 'lodash';
import { GqlClient as client } from '../../../../../api/gcoolApi';
import { allAgreements } from '../../../queries/agreements';

export class AgreementsStore {
  @observable agreementsList = [];

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
}

export default new AgreementsStore();
