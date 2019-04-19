import { toJS, observable, action, computed } from 'mobx';
import { matchPath } from 'react-router-dom';
import cookie from 'react-cookies';
import _ from 'lodash';
import { PRIVATE_NAV } from '../../../../constants/NavigationMeta';
import { userStore, userDetailsStore, offeringsStore, statementStore } from '../../index';
import { REACT_APP_DEPLOY_ENV } from '../../../../constants/common';

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
  @observable campaignHeaderStatus = false;

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
    try {
      let permitted = [];
      const { roles } = this.params;
      if (userDetailsStore.signupStatus.isMigratedFullAccount
        && !userDetailsStore.isBasicVerDoneForMigratedFullUser) {
        permitted = [...roles];
      } else {
        permitted = [...roles,
          ...userDetailsStore.signupStatus.partialAccounts,
          ...userDetailsStore.signupStatus.activeAccounts,
          ...userDetailsStore.signupStatus.processingAccounts,
          ...userDetailsStore.signupStatus.frozenAccounts];
      }
      if (permitted && permitted.length > 1 && permitted.includes('investor')) {
        const pInvestorInfo = {
          roles,
          signupStatus: userDetailsStore.signupStatus,
          permitted,
        };
        localStorage.setItem(`${userStore.currentUser.sub}_pInfo`, JSON.stringify(pInvestorInfo));
      }
      const pInvestorInfo = localStorage.getItem(`${userStore.currentUser.sub}_pInfo`);
      if (userDetailsStore.userFirstLoad !== true &&
        (!this.params.roles.length || !userDetailsStore.signupStatus.roles[0])) {
        if (pInvestorInfo) {
          permitted = JSON.parse(pInvestorInfo).permitted || permitted;
        } else {
          return [];
        }
      }
      if (pInvestorInfo && permitted.includes('investor')) {
        permitted = JSON.parse(pInvestorInfo).permitted || permitted;
      }
      const routes = _.filter(
        this.NAV_ITEMS,
        n => ((!n.accessibleTo || n.accessibleTo.length === 0 ||
          _.intersection(n.accessibleTo, permitted).length > 0) &&
        (!n.env || n.env.length === 0 ||
          _.intersection(n.env, [REACT_APP_DEPLOY_ENV]).length > 0) &&
          (!n.capability || this.canAccessBasedOnCapability(n.capability))),
      );
      return routes;
    } catch (err) {
      console.log(err);
      return [];
    }
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
        const newSubNav = nItem.subNavigations.filter(n => ((!n.accessibleTo ||
          n.accessibleTo.length === 0 ||
          _.intersection(n.accessibleTo, this.params.roles).length > 0)) && (!n.env ||
            n.env.length === 0 ||
            _.intersection(n.env, [REACT_APP_DEPLOY_ENV]).length > 0));
        nItem.subNavigations = [...newSubNav];
        if (userStore.isInvestor && ['Individual', 'IRA', 'Entity'].includes(nItem.title)) {
          if (statementStore.getTaxFormCountInNav(nItem.title.toLocaleLowerCase()) === 0) {
            nItem.subNavigations = _.filter(
              nItem.subNavigations,
              subNavigation => subNavigation.component !== 'Statements',
            );
          }
        }
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
        nav.subNavigations = nav.subNavigations.filter(n => ((!n.accessibleTo ||
          n.accessibleTo.length === 0 || _.intersection(n.accessibleTo, roles).length > 0) &&
          (!n.env || n.env.length === 0 ||
            _.intersection(n.env, [REACT_APP_DEPLOY_ENV]).length > 0)));
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
        nav.subNavigations = nav.subNavigations.filter(n => ((!n.accessibleTo ||
          n.accessibleTo.length === 0 || _.intersection(n.accessibleTo, roles).length > 0) &&
          (!n.env || n.env.length === 0 ||
            _.intersection(n.env, [REACT_APP_DEPLOY_ENV]).length > 0)));
        if (nav.title === 'Application' && key === 'appStatus') {
          nav.subNavigations = this.filterByAccess(nav.subNavigations, appStatus);
        }
      }
      this.navMeta = nav;
    }
    const acctiveAccountList = userDetailsStore.getActiveAccounts;
    if (this.navMeta && this.navMeta.subNavigations &&
        acctiveAccountList && acctiveAccountList.length === 0) {
      this.navMeta.subNavigations = _.filter(this.navMeta.subNavigations, subNavigation => subNavigation.component !== 'InvestmentLimits');
    }
    if (userStore.isInvestor && this.navMeta && this.navMeta.subNavigations &&
      statementStore.getTaxFormCountInNav(this.navMeta.title.toLocaleLowerCase()) === 0) {
      this.navMeta.subNavigations = _.filter(
        this.navMeta.subNavigations,
        subNavigation => subNavigation.component !== 'Statements',
      );
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
  @action
  setMobileNavStatus(calculations) {
    const {
      topVisible, bottomPassed,
    } = calculations;
    if (typeof topVisible === 'boolean') {
      // this.subNavStatus = 'main';
      this.campaignHeaderStatus = bottomPassed;
    }
  }
}

export default new NavStore();
