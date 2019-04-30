import React, { Component } from 'react';
import { Link, withRouter, matchPath } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import Aux from 'react-aux';
import { Menu, Icon, Button } from 'semantic-ui-react';
import { PRIVATE_NAV, PUBLIC_NAV, FOOTER_NAV } from '../../constants/NavigationMeta';
import { NavItems } from './NavigationItems';
import { REACT_APP_DEPLOY_ENV } from '../../constants/common';

const isMobile = document.documentElement.clientWidth < 768;

@inject('navStore', 'offeringsStore', 'uiStore')
@withRouter
@observer
export class SidebarNav extends Component {
  componentWillMount() {
    this.props.navStore.setAccessParams('roles', this.props.roles);
    this.props.navStore.setAccessParams('currentNav', this.props.match.url);
    if (this.props.roles.includes('issuer')) {
      this.props.offeringsStore.initRequest({ stage: 'active' });
    }
  }
  componentWillReceiveProps(nextProps) {
    this.props.navStore.setAccessParams('currentNav', nextProps.match.url);
  }
  toggleMobile = () => this.props.uiStore.updateLayoutState('leftPanelMobile');

  render() {
    const { props } = this;
    const {
      roles, location, isVerified, createdAccount, navStore, onlyMount,
    } = props;
    if (onlyMount) return null;
    return (
      <Aux>
        <NavItems
          location={location}
          navItems={navStore.sidebarItems}
          roles={roles}
          isUserVerified={isVerified}
          createdAccount={createdAccount}
          isApp
          onToggle={this.toggleMobile}
          isMobile={isMobile}
        />
        <Menu.Item key="logout" name="logout" onClick={this.props.handleLogOut}>
          <Icon name="sign out" />
          <span>Logout</span>
        </Menu.Item>
        {props.UserInfo.roles && props.UserInfo.roles.includes('investor') &&
          props.signupStatus &&
          !props.signupStatus.finalStatus && props.accForm.fields.accType.values.length !== 0 &&
          props.signupStatus.investorProfileCompleted &&
            // <Button as={Link} to="/app/summary/account-creation">Add New Account</Button>
            // <Menu.Item as={Link} className="add-account" to="/app/summary/account-creation">
            //   <Icon name="add" />
            //   <span>Add New Account</span>
            // </Menu.Item>
            <Menu.Item>
              <Button fluid basic compact as={Link} to="/app/summary/account-creation" content="Open New Account" />
            </Menu.Item>
        }
      </Aux>
    );
  }
}

export const GetNavItem = (item, roles) => {
  const result = _.find(PRIVATE_NAV, i => i.to === item);
  const link = <h3><Link to={`/app/${result.to}`}>{result.title}</Link></h3>;
  return (result && (!result.accessibleTo || result.accessibleTo.length === 0 ||
    _.intersection(result.accessibleTo, roles).length > 0) &&
    (!result.env || result.env.length === 0 ||
      _.intersection(result.env, [REACT_APP_DEPLOY_ENV]).length > 0)) ? link : false;
};

export const GetNavMeta = (item, roles, nonprivate) => {
  const ALL_PUBLIC = [...PUBLIC_NAV, ...FOOTER_NAV];
  const navMeta = !nonprivate ? _.find(PRIVATE_NAV, i => matchPath(item, { path: `/app/${i.to}` })) :
    _.find(ALL_PUBLIC, i => matchPath(item, { path: `/${i.to}`, exact: i.exact || false }));
  if (navMeta) {
    navMeta.title = typeof navMeta.title === 'object' && roles ? navMeta.title[roles[0]] :
      navMeta.title;
    if (navMeta.subNavigations && roles) {
      navMeta.subNavigations = navMeta.subNavigations.filter(n =>
        ((!n.accessibleTo || n.accessibleTo.length === 0 ||
        _.intersection(n.accessibleTo, roles).length > 0)) &&
        ((!n.env || n.env.length === 0 ||
        _.intersection(n.env, [REACT_APP_DEPLOY_ENV]).length > 0)));
    }
  }
  if (!navMeta) {
    return { subNavigations: [] };
  }
  return navMeta;
};
