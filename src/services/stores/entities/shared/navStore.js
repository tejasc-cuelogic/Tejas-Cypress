import { toJS, observable, action, computed } from 'mobx';
import { matchPath } from 'react-router-dom';
import cookie from 'react-cookies';
import _ from 'lodash';
import { PRIVATE_NAV } from '../../../../constants/NavigationMeta';
import { userStore, userDetailsStore, offeringsStore } from '../../index';

export class NavStore {
  @observable NAV_ITEMS = [...PRIVATE_NAV];
  @observable params = {
    roles: [], currentNav: [], appStatus: null, specificNav: null,
  };
  @observable navStatus = 'main';
  @observable subNavStatus = '';
  @observable navMeta = [];
  @observable specificNavMeta = [];
  @observable everLogsIn = cookie.load('EVER_LOGS_IN') || false;

  constructor() {
    if (userStore.currentUser) {
      userDetailsStore.getUser(userStore.currentUser.sub);
    }
  }

  canAccessBasedOnCapability = (capability) => {
    const key = capability.split('_');
    const capabilityCheck = (key[1] !== 'ANY') ? [capability] :
      [`${key[0]}_FULL`, `${key[0]}_MANAGER`, `${key[0]}_SUPPORT`];
    return _.intersection(userStore.myCapabilities, capabilityCheck).length > 0;
  }

  @computed get myRoutes() {
    const permitted = [...this.params.roles, ...userDetailsStore.signupStatus.activeAccounts];
    const routes = _.filter(
      this.NAV_ITEMS,
      n => ((n.accessibleTo.length === 0 || _.intersection(n.accessibleTo, permitted).length > 0) &&
        (!n.capability || this.canAccessBasedOnCapability(n.capability))),
    );
    return routes;
  }

  @action
  setEverLogsIn = () => {
    this.everLogsIn = cookie.load('EVER_LOGS_IN');
  }

  @action
  filterByAccess = (sNavs, phase, exclude = []) => toJS(sNavs.filter(sN => !sN.accessFor ||
      (sN.accessFor.includes(phase <= 4 ? phase : 4) && !exclude.includes(sN.to))));

  @computed get allNavItems() {
    const navItems = [...this.myRoutes];
    const bIndex = navItems.findIndex(r => r.title === 'Offering');
    if (bIndex !== -1) {
      const subNavigations = [...navItems[bIndex].subNavigations];
      offeringsStore.offerings.forEach((b) => {
        const sNav = this.filterByAccess(
          subNavigations,
          offeringsStore.allPhases.indexOf(b.stage) + 1,
        );
        navItems.splice(
          bIndex,
          0,
          {
            ...navItems[bIndex],
            ...{
              title: b.keyTerms ?
                b.keyTerms.legalBusinessName : b.businessGeneralInfo.businessName,
              to: `offering/${b.id}`,
              subNavigations: sNav,
            },
          },
        );
      });
    }
    return navItems;
  }

  @computed get sidebarItems() {
    const reject = ['profile-settings', 'business-application/:applicationType/:applicationId', 'edgar'];
    return this.allNavItems.filter(r => !reject.includes(r.to) && r.title !== 'Offering');
  }

  @computed get stepInRoute() {
    return this.everLogsIn ? { to: 'login', title: 'Log In' } :
      { to: 'register', title: 'Sign Up' };
  }

  @computed get specificNavs() {
    const { roles, specificNav } = this.params;
    let nav = [];
    if (roles && specificNav) {
      nav = toJS(this.NAV_ITEMS.find(i => matchPath(specificNav, { path: `/app/${i.to}` })));
      if (nav && nav.subNavigations) {
        nav.title = typeof nav.title === 'object' && roles ? nav.title[roles[0]] : nav.title;
        nav.subNavigations = nav.subNavigations.filter(n => !n.accessibleTo ||
          n.accessibleTo.length === 0 || _.intersection(n.accessibleTo, roles).length > 0);
      }
    }
    return nav;
  }

  @action
  setAccessParams(key, value) {
    this.params[key] = value;
    const { roles, currentNav, appStatus } = this.params;
    if (roles && currentNav) {
      const nav = toJS(this.allNavItems.find(i => matchPath(currentNav, { path: `/app/${i.to}` })));
      if (nav && nav.subNavigations) {
        nav.title = typeof nav.title === 'object' && roles ? nav.title[roles[0]] : nav.title;
        nav.subNavigations = nav.subNavigations.filter(n => !n.accessibleTo ||
          n.accessibleTo.length === 0 || _.intersection(n.accessibleTo, roles).length > 0);
        if (nav.title === 'Application' && key === 'appStatus') {
          nav.subNavigations = this.filterByAccess(nav.subNavigations, appStatus);
        }
      }
      this.navMeta = nav;
    }
  }

  @action
  setNavStatus(calculations, forced) {
    const {
      topVisible, direction, bottomPassed,
    } = calculations;
    if (typeof topVisible === 'boolean') {
      this.navStatus = forced || (!topVisible ? 'sub' : 'main');
      if ((this.navStatus === 'sub') && (bottomPassed)) {
        this.subNavStatus = (direction === 'down' ? 'animate' : 'animate reverse');
      }
    }
  }
}

export default new NavStore();
