import { observable, action, computed } from 'mobx';
import _ from 'lodash';
import { PRIVATE_NAV } from '../../../../constants/NavigationMeta';
import { userStore, userDetailsStore } from '../../index';

export class NavStore {
  @observable NAV_ITEMS = { ...PRIVATE_NAV };
  @observable params = {
    roles: [],
  };

  constructor() {
    if (userStore.currentUser) {
      userDetailsStore.getUser(userStore.currentUser.sub);
    }
  }

  @computed get myNavItems() {
    const permitted = [...this.params.roles, ...userDetailsStore.signupStatus.activeAccounts];
    return _.filter(
      this.NAV_ITEMS,
      n => n.to !== 'profile-settings' && n.to !== 'business-application' &&
      (n.accessibleTo.length === 0 || _.intersection(n.accessibleTo, permitted).length > 0),
    );
  }

  @computed get myRoutes() {
    const permitted = [...this.params.roles, ...userDetailsStore.signupStatus.activeAccounts];
    return _.filter(
      this.NAV_ITEMS,
      n => n.accessibleTo.length === 0 || _.intersection(n.accessibleTo, permitted).length > 0,
    );
  }

  @action
  setAccessParams(key, value) {
    this.params[key] = value;
  }
}

export default new NavStore();
