/* eslint-disable react/no-multi-comp  */
import React, { Component } from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Container, Icon, Menu, Dropdown, Label, Button } from 'semantic-ui-react';
import { PUBLIC_NAV } from '../../constants/NavigationMeta';
import { Logo } from '../shared';
import { SubmitButton } from '../../modules/shared/businessApplication/components/HeaderButtons';

const isTablet = document.documentElement.clientWidth < 992;
@withRouter
@inject('navStore', 'uiStore', 'userDetailsStore')
@observer
export class NavItems extends Component {
  state = { active: '', active2: '', byHideArrow: '' };
  navClick = (e, { name }) => {
    if (this.props.refLoc !== 'public') {
      const newState = this.state.active === name ? '' : name;
      const newState2 = name;
      this.setState({ active: newState, active2: newState2 });
    }
    if (!(this.props.userDetailsStore.getAccountList.length === 1
      && name === this.props.uiStore.defaultNavExpanded)) {
      if (this.props.isApp && e.target.className === 'dropdown icon') {
        const { active2 } = this.state;
        if (active2 === name) {
          this.setState({ byHideArrow: name });
        }
      }

      const { setNavExpanded } = this.props.uiStore;
      setNavExpanded(false); // reset defaultNavExpanded
    }
    if (this.props.refLoc !== 'public' && e.target.getAttribute('role') !== 'option') {
      this.props.history.replace(`/app/${name}`);
    }
  };
  isActive = (to, location, app, subNavigations) => {
    const { defaultNavExpanded } = this.props.uiStore;
    if (to === '' && subNavigations) {
      return subNavigations.find(s => location.pathname.startsWith(`/${s.to}`));
    }
    const { active, active2, byHideArrow } = this.state;
    if (active2 === byHideArrow && active2 !== '') {
      return false;
    }
    return ((to !== '' && active === to) ||
      ((this.props.refLoc !== 'public' && (location.pathname.startsWith(`/${app}/${to}`) || defaultNavExpanded === to)) ||
        (this.props.refLoc === 'public' && to !== '' && location.pathname.startsWith(`/${to}`))));
  }
  isActiveSubMenu = (to, location, hashCheck = false) => (hashCheck ? (this.props.navStore.currentActiveHash === null && location.hash === '') : this.props.navStore.currentActiveHash === null ? location.hash === to : this.props.navStore.currentActiveHash === to);

  isOpen = (to, location, subNavigations) => {
    if (to !== '' && subNavigations) {
      return location.pathname.includes(`/${to}`);
    }
    return false;
  }
  doNothing = (e, path = false, eHandeler = false) => {
    if (eHandeler) {
      e.stopPropagation();
    }
    if (path) {
      this.props.history.push(path);
    } else {
      console.log('nothing');
    }
  }
  render() {
    const {
      location, isApp, roles, match, isMobile, onToggle, refLink,
    } = this.props;
    const app = (isApp) ? 'app' : '';
    const myNavItems = this.props.navItems.filter(n => n.noNav !== true);
    return myNavItems.map(item => (
      <Aux>
        {(item.subPanel === 1 && item.subNavigations) ? (
          <Dropdown
            open={item.clickable && this.isOpen(item.to, location, item.subNavigations)}
            item
            defaultOpen={item.defaultOpen}
            key={item.to}
            className={`${this.isActive(item.to, location, app, item.subNavigations) ? 'active really' : ''} ${item.title === 'How NextSeed Works' && isMobile ? 'visible' : ''} ${(item.title === 'Account Settings' && this.props.userDetailsStore.getAccountList.length) ? 'mt-10' : ''}`}
            name={item.to}
            // disabled={isMobile && item.title === 'How NextSeed Works'}
            onClick={item.title !== 'How NextSeed Works' && (isMobile || isApp) ? this.navClick : e => this.doNothing(e, item.clickable ? `${refLink}/${item.to}` : false, item.clickable)}
            text={
              <Aux>
                {item.icon && <Icon className={item.icon} />}
                <span>{typeof item.title === 'object' && roles ? item.title[roles[0]] : item.title}</span>
              </Aux>
            }
          >
            <Dropdown.Menu className={`${this.isActive(item.to, location, app, item.subNavigations) && (isMobile || isApp) ? 'visible' : ''} ${item.title === 'How NextSeed Works' && isMobile ? 'visible' : ''}`}>
              {item.subNavigations.map(sn => (
                sn.external ? (
                  <a className="item" href={sn.to} rel="noopener noreferrer" target="_blank">NextSeed Space</a>
                ) : (
                  <Dropdown.Item
                    key={sn.to}
                    className={`${((sn.defaultActive && this.isActiveSubMenu(`${sn.to}`, location, true))) ? 'active' : ''} ${this.isActiveSubMenu(sn.to, location) ? 'active' : ''}`}
                    as={NavLink}
                    onClick={isMobile ? onToggle : e => this.doNothing(e, false, item.clickable)}
                    to={sn.useRefLink ? `${refLink}/${item.to}/${sn.to}` : `${(isApp) ? '/app' : ''}${(item.to !== '' ? `/${item.to}` : '')}/${sn.to}`}
                  >
                    {sn.title}
                  </Dropdown.Item>
                )
              ))}
            </Dropdown.Menu>
          </Dropdown>
        ) : item.isMenuHeader ?
          <Menu.Item className="menu-header">
            <Menu.Header>{item.title}</Menu.Header>
          </Menu.Item> :
          item.title === 'Bonus Rewards' && !this.props.bonusRewards ?
            null
            : ((item.to === 'updates' && this.props.countData && this.props.countData[item.to]) ||
            (item.to !== 'updates') ?
            (item.title === 'Bonus Rewards' && this.props.isBonusReward) ||
            (item.title !== 'Bonus Rewards') ? (
              <Menu.Item
                key={item.to}
                name={item.to}
                className={isMobile && item.title === 'Home' && location.pathname !== '/' ? 'no-active' : ''}
                as={NavLink}
                onClick={isMobile ? onToggle : this.doNothing}
                to={`${(isApp) ? '/app' : (this.props.sub ? match.url : '')}/${item.to}`}
              >
                {item.icon && <Icon className={item.icon} />}
                {item.to === 'messages' && <Label circular color="red" size="mini" horizontal>3</Label>}
                {item.title !== 'Updates' ? <span>{item.title}</span> : (item.title === 'Updates' && item.to === 'updates' && this.props.countData ? <span>{item.title}</span> : '')}
                {(item.to === 'updates' || item.to === 'comments') && this.props.countData ?
                  <Label circular color="blue" size="small">{this.props.countData[item.to]}</Label> : null
                }
              </Menu.Item>) : '' : ''
            )}
      </Aux>
    ));
  }
}

const getLogo = path => (path.includes('/lendio') ? 'LogoNsAndLendio' : 'LogoGreenGrey');

const getLogoStyle = path => (path.includes('/lendio') ? { height: '28px', width: 'auto' } : {});


@inject('navStore', 'uiStore')
@observer
export class NavigationItems extends Component {
  setAuthRef = () => {
    this.props.uiStore.setAuthRef(this.props.location.pathname);
  }
  render() {
    const {
      location, currentUser, loading, isMobBussinessApp,
      isPrequalQulify, canSubmitApp, preQualSubmit, navStore,
    } = this.props;
    const { navStatus, subNavStatus } = navStore;
    const stepInRoute = [
      { to: 'login', title: 'Log In', className: 'basic' },
      { to: 'register', title: 'Sign Up', className: 'secondary' },
    ];
    return (
      <Menu
        stackable={!isMobBussinessApp}
        borderless
        fixed="top"
        className={`${navStatus === 'sub' ? 'active' : ''} ${subNavStatus}`}
      >
        <Container fluid>
          {!isMobBussinessApp &&
            <Menu.Item as={Link} to="/" header>
              <Logo
                alt="NextSeed.com"
                dataSrc={getLogo(location.pathname)}
                style={getLogoStyle(location.pathname)}
                size={isTablet && 'small'}
              />
            </Menu.Item>
          }
          <Menu.Menu position="right">
            {!location.pathname.includes('/business-application') &&
              <NavItems
                refLoc="public"
                currentUser={currentUser}
                location={location}
                navItems={PUBLIC_NAV.filter(nav => nav.header !== false)}
              />
            }
          </Menu.Menu>
          {location.pathname.includes('/business-application') && !location.pathname.includes('business/') && !location.pathname.includes('commercial-real-estate/') ?
            <Menu.Item position={isMobBussinessApp ? 'right' : ''}>
              <Button.Group>
                <Button as={Link} to="/business/how-it-works" loading={loading} inverted color="red">Cancel</Button>
                {isPrequalQulify &&
                  <SubmitButton
                    canSubmitApp={canSubmitApp}
                    click={preQualSubmit}
                    loading={loading}
                  />}
              </Button.Group>
            </Menu.Item>
            : !location.pathname.includes('/business-application') &&
            (
              !currentUser ? (
                <Aux>
                  {stepInRoute.map(route => (
                    <Menu.Item className="menu-button">
                      <Button as={Link} onClick={this.setAuthRef} to={`/auth/${route.to}`} className={`${route.className}`}>{route.title}</Button>
                    </Menu.Item>
                  ))}
                </Aux>
              ) : (
                <Menu.Item
                  className="menu-button"
                  as={Link}
                  to={`/app/${currentUser.roles && currentUser.roles.includes('investor') ? 'summary' : 'dashboard'}`}
                >
                  <Button secondary>Dashboard</Button>
                </Menu.Item>
                ))}
        </Container>
      </Menu>
    );
  }
}
