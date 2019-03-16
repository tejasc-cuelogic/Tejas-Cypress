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
  @observable currentActiveHash = null;

  constructor() {
    if (userStore.currentUser) {
      userDetailsStore.getUser(userStore.currentUser.sub);
    }
  }
  @action
  setFieldValue = (key, val) => {
    this[key] = val;
  }
  canAccessBasedOnCapability = (capab) => {
    const rest = capab.substring(0, capab.lastIndexOf('_'));
    const last = capab.substring(capab.lastIndexOf('_') + 1, capab.length);
    const capabilityCheck = (last !== 'ANY') ? [capab] :
      [`${rest}_FULL`, `${rest}_MANAGER`, `${rest}_SUPPORT`];
    return _.intersection(userStore.myCapabilities, capabilityCheck).length > 0;
  }

  @computed get myRoutes() {
    let permitted = [];
    if (userDetailsStore.signupStatus.isMigratedFullAccount
      && !userDetailsStore.isBasicVerDoneForMigratedFullUser) {
      permitted = [...this.params.roles];
    } else {
      permitted = [...this.params.roles,
        ...userDetailsStore.signupStatus.partialAccounts,
        ...userDetailsStore.signupStatus.activeAccounts,
        ...userDetailsStore.signupStatus.processingAccounts];
    }
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
      (sN.accessFor.includes(typeof phase === 'number' ? (phase <= 4 ? phase : 4) : phase) && !exclude.includes(sN.to))));

  businessName = b => ((b.keyTerms && b.keyTerms.shorthandBusinessName) ?
    b.keyTerms.shorthandBusinessName : (
      (b.keyTerms && b.keyTerms.legalBusinessName) ? b.keyTerms.legalBusinessName : 'N/A'
    ));

  @computed get allNavItems() {
    const navItems = [...toJS(this.myRoutes)];
    const filteredNavs = [];
    navItems.forEach((navitem) => {
      const nItem = toJS(navitem);
      if (nItem.subNavigations) {
        const newSubNav = nItem.subNavigations.filter(n => !n.accessibleTo ||
          n.accessibleTo.length === 0 ||
          _.intersection(n.accessibleTo, this.params.roles).length > 0);
        nItem.subNavigations = [...newSubNav];
      }
      filteredNavs.push(nItem);
    });
    const bIndex = filteredNavs.findIndex(r => r.title === 'Offering');
    if (bIndex !== -1) {
      const subNavigations = [...filteredNavs[bIndex].subNavigations];
      offeringsStore.offerings.forEach((b) => {
        const sNav = this.filterByAccess(
          subNavigations,
          _.find(offeringsStore.phases, (s, i) => i === b.stage).accessKey,
        );
        filteredNavs.splice(
          bIndex,
          0,
          {
            ...filteredNavs[bIndex],
            ...{
              title: this.businessName(b),
              to: `offering/${b.id}`,
              subNavigations: sNav,
            },
          },
        );
      });
    }
    return filteredNavs;
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
      topVisible, direction, bottomPassed, isMoveTop,
    } = calculations;
    if (typeof topVisible === 'boolean') {
      this.navStatus = forced || (!topVisible ? 'sub' : 'main');
      if ((this.navStatus === 'sub') && (bottomPassed)) {
        this.subNavStatus = (direction === 'down' ? 'animate' : 'animate reverse');
      } else if ((this.navStatus === 'main') && (bottomPassed) && (isMoveTop)) {
        this.subNavStatus = (direction === 'down' ? 'animate' : 'animate reverse');
      }
    }
  }
}

export default new NavStore();
