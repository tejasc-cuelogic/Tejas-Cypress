/* eslint-disable no-unused-vars, navItems, prefer-const */
import { toJS, observable, action, computed } from 'mobx';
import _ from 'lodash';
import { ALL_NAV_ITEMS } from '../../constants/privateNavigationMeta';
import userStore from '../userStore';
import userDetailsStore from '../user/userDetailsStore';

export class NavStore {
  @observable NAV_ITEMS = { ...ALL_NAV_ITEMS };
  @observable params = {
    roles: [],
  };

  constructor() {
    if (userStore.currentUser) {
      userDetailsStore.getUser(userStore.currentUser.sub);
    }
  }

  @computed get myNavItems() {
    console.log('currentUser', userDetailsStore.currentUser);
    let navItems = _.filter(
      this.NAV_ITEMS,
      n => n.to !== 'profile-settings' && n.to !== 'business-application' &&
      (n.accessibleTo.length === 0 || _.intersection(n.accessibleTo, this.params.roles).length > 0),
    );
    return navItems;
  }

  @action
  setAccessParams(key, value) {
    this.params[key] = value;
    console.log('im here', this.params);
  }
}

export default new NavStore();
