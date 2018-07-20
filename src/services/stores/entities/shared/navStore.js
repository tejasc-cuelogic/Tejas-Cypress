/* eslint-disable no-unneeded-ternary */
import { observable, action, computed } from 'mobx';
import { matchPath } from 'react-router-dom';
import _ from 'lodash';
import { PRIVATE_NAV } from '../../../../constants/NavigationMeta';
import { userStore, userDetailsStore, businesssStore } from '../../index';

export class NavStore {
  @observable NAV_ITEMS = { ...PRIVATE_NAV };
  @observable params = { roles: [], currentNav: [] };
  @observable navStatus = 'main';
  @observable navMeta = [];

  constructor() {
    if (userStore.currentUser) {
      userDetailsStore.getUser(userStore.currentUser.sub);
    }
  }

  @computed get myRoutes() {
    const permitted = [...this.params.roles, ...userDetailsStore.signupStatus.activeAccounts];
    return _.filter(
      this.NAV_ITEMS,
      n => n.accessibleTo.length === 0 || _.intersection(n.accessibleTo, permitted).length > 0,
    );
  }

  @computed get allNavItems() {
    const navItems = [...this.myRoutes];
    const bIndex = navItems.findIndex(r => r.title === 'Offering');
    if (bIndex !== -1) {
      const subNavigations = [...navItems[bIndex].subNavigations];
      businesssStore.businesses.forEach((b) => {
        const sNav = subNavigations.filter(sN => !sN.accessFor || sN.accessFor.includes(b.phase));
        navItems.splice(
          bIndex,
          0,
          { ...navItems[bIndex], ...{ title: b.name, to: `offering/${b.id}`, subNavigations: sNav } },
        );
      });
    }
    return navItems;
  }

  @computed get sidebarItems() {
    const reject = ['profile-settings', 'business-application'];
    return this.allNavItems.filter(r => !reject.includes(r.to) && r.title !== 'Offering');
  }

  @action
  setAccessParams(key, value) {
    this.params[key] = value;
    const { roles, currentNav } = this.params;
    if (roles && currentNav) {
      const nav = _.find(this.allNavItems, i => matchPath(currentNav, { path: `/app/${i.to}` }));
      if (nav && nav.subNavigations) {
        nav.title = typeof nav.title === 'object' && roles ? nav.title[roles[0]] : nav.title;
        nav.subNavigations = nav.subNavigations.filter(n => !n.accessibleTo ||
          n.accessibleTo.length === 0 || _.intersection(n.accessibleTo, roles).length > 0);
      }
      this.navMeta = nav;
    }
  }

  @action
  setNavStatus(calculations, forced) {
    const { percentagePassed, topVisible } = calculations;
    this.navStatus = forced ? forced : ((percentagePassed > 0 && !topVisible) ? 'sub' : 'main');
  }
}

export default new NavStore();
