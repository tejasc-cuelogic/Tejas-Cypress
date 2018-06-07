/* eslint-disable no-unused-vars, navItems, prefer-const */
import { toJS, observable, action, computed } from 'mobx';
import _ from 'lodash';
import { PRIVATE_NAV } from '../../constants/NavigationMeta';
import userStore from '../userStore';
import userDetailsStore from '../user/userDetailsStore';

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
    let navItems = _.filter(
      this.NAV_ITEMS,
      n => n.to !== 'profile-settings' && n.to !== 'business-application' &&
      (n.accessibleTo.length === 0 || _.intersection(n.accessibleTo, permitted).length > 0),
    );
    return navItems;
  }

  @action
  setAccessParams(key, value) {
    this.params[key] = value;
  }
}

export default new NavStore();
