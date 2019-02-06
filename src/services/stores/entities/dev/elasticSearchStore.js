import { observable, action, computed, toJS } from 'mobx';

export class ElasticSearchStore {
  @observable opt = {};
  @computed get isIssuer() {
    const roles = (this.currentUser && toJS(this.currentUser.roles)) || [];
    return roles.includes('issuer');
  }
  @action setCurrentUser(user) {
    this.currentUser = user;
  }
}

export default new ElasticSearchStore();
