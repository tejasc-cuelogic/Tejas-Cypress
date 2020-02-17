/* eslint-disable react/no-multi-comp  */
import React, { Component } from 'react';
import { Link, NavLink, withRouter, matchPath } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Container, Icon, Menu, Dropdown, Label, Button, Accordion, Divider } from 'semantic-ui-react';
import { PUBLIC_NAV } from '../../constants/NavigationMeta';
import { Logo } from '../shared';
import { SubmitButton } from '../../modules/shared/businessApplication/components/HeaderButtons';

const isTablet = document.documentElement.clientWidth < 992;
@withRouter
@inject('navStore', 'uiStore', 'userDetailsStore', 'userStore')
@observer
export class NavItems extends Component {
  state = {
    active: '',
    active2: '',
    byHideArrow: '',
    activeIndex: 0,
  };

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  }

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
      this.props.history.replace(`/dashboard/${name}`);
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
    return ((to !== '' && active === to)
      || ((this.props.refLoc !== 'public' && (location.pathname.startsWith(`/${app}/${to}`) || defaultNavExpanded === to))
        || (this.props.refLoc === 'public' && to !== '' && location.pathname.startsWith(`/${to}`))));
  }

  isActiveSubMenu = (to, location, hashCheck = false) => (hashCheck ? (this.props.navStore.currentActiveHash === null && location.hash === '') : this.props.navStore.currentActiveHash === null ? location.hash === to : this.props.navStore.currentActiveHash === to);

  isOpen = (to, location, subNavigations) => {
    if (to !== '' && subNavigations) {
      return location.pathname.includes(`/${to}`);
    }
    return false;
  }

  mobileMenuClick = () => {
    this.props.onToggle();
    this.setState({ activeIndex: 0 });
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
    const { activeIndex } = this.state;
    const {
      location, isApp, roles, refMatch, isMobile, onToggle, refLink, newLayout, userDetailsStore, needNavLink,
    } = this.props;
    let { match } = this.props;
    const { signupStatus, hasAnyAccount } = userDetailsStore;
    const app = (isApp) ? 'dashboard' : '';
    const myNavItems = this.props.navItems.filter(n => (n.headerMobile !== false && n.title === 'My Account' ? this.props.userStore.isInvestor : n.headerMobile !== false && n.noNav !== true));
    const investorAccounts = this.props.userDetailsStore.getAccountList;
    const hasMoreThanOneAcc = investorAccounts.length > 1;
    const hideSetupNav = signupStatus.investorProfileCompleted && (hasAnyAccount);
    const isPrivateApp = location.pathname.includes('/dashboard');
    match = refMatch || match;
    return myNavItems.map((item, key) => (
      <>
        {item.subPanel === 1 && item.subNavigations && isMobile && !isApp ? (
          <Accordion as={Menu} vertical fluid>
            <Menu.Item>
              <Accordion.Title
                active={
                  activeIndex === key
                  || (this.isActive(item.to, location, app, item.subNavigations))
                }
                content={typeof item.title === 'object' && roles ? item.title[roles[0]] : item.title}
                index={key}
                onClick={this.handleClick}
              />
              <Accordion.Content
                active={
                  activeIndex === key
                  || (this.isActive(item.to, location, app, item.subNavigations))
                }
                content={(
                  <Menu.Menu>
                    {item.subNavigations.map(sn => (
                      sn.external ? (
                        <a className="item" href={sn.to} rel="noopener noreferrer">NextSeed Space</a>
                      ) : (
                          <Menu.Item
                            key={sn.to}
                            className={`${((sn.defaultActive && this.isActiveSubMenu(`${sn.to}`, location, true))) ? 'active' : ''} ${this.isActiveSubMenu(sn.to, location) ? 'active' : ''}`}
                            as={NavLink}
                            onClick={
                              isMobile ? onToggle : e => this.doNothing(e, false, item.clickable)
                            }
                            to={sn.useRefLink ? `${refLink}/${item.to}/${sn.to}` : `${(isApp) ? '/dashboard' : ''}${(item.to !== '' ? `/${item.to}` : '')}/${sn.to}`}
                          >
                            {sn.title}
                          </Menu.Item>
                      )
                    ))}
                  </Menu.Menu>
                )}
              />
            </Menu.Item>
          </Accordion>
        )
          : (item.subPanel === 1 && item.subNavigations && !item.hideSubOnSideBar) ? (
            <Dropdown
              open={item.clickable && this.isOpen(item.to, location, item.subNavigations)}
              item
              defaultOpen={item.defaultOpen}
              key={item.to}
              className={`${(investorAccounts.length && item.to.includes('account-details') && !hasMoreThanOneAcc) ? 'visible hide-dropdown' : this.isActive(item.to, location, app, item.subNavigations) ? 'active' : ''}`}
              name={item.to}
              // disabled={isMobile && item.title === 'How NextSeed Works'}
              onClick={(isMobile || isApp) ? this.navClick : e => this.doNothing(e, item.clickable ? `${refLink}/${item.to}` : false, item.clickable)}
              text={(
                <>
                  {item.icon && <Icon className={item.icon} />}
                  <span>{typeof item.title === 'object' && roles ? item.title[roles[0]] : item.title}</span>
                </>
              )}
            >
              <Dropdown.Menu className={`${this.isActive(item.to, location, app, item.subNavigations) && (isMobile || isApp) ? 'visible' : ''} ${(investorAccounts.length && item.to.includes('account-details') && !hasMoreThanOneAcc) ? 'visible' : ''}`}>
                {item.subNavigations.map(sn => (
                  sn.external ? (
                    <a className="item" href={sn.to} rel="noopener noreferrer">NextSeed Space</a>
                  ) : (
                      <Dropdown.Item
                        key={sn.to}
                        className={`${((sn.defaultActive && this.isActiveSubMenu(`${sn.to}`, location, true))) ? 'active' : ''} ${this.isActiveSubMenu(sn.to, location) ? 'active' : ''}`}
                        as={NavLink}
                        onClick={sn.title === 'Log out' ? this.handleLogOut : isMobile ? onToggle : e => this.doNothing(e, false, item.clickable)}
                        to={sn.useRefLink ? `${refLink}/${item.to}/${sn.to}` : `${(isApp) ? '/dashboard' : ''}${(item.to !== '' ? `/${item.to}` : '')}/${sn.to}`}
                      >
                        {sn.title}
                      </Dropdown.Item>
                  )
                ))}
              </Dropdown.Menu>
            </Dropdown>
          ) : (item.isMenuHeader)
            ? (
                <Menu.Item className="menu-header">
                  <Menu.Header>{typeof item.title === 'object' && roles ? item.title[roles[0]] : item.title}</Menu.Header>
                </Menu.Item>
            )
            : (item.title === 'Bonus Rewards' && !this.props.bonusRewards) || (item.isMenuHeader) || (item.title === 'Setup' && hideSetupNav)
              ? null
              : (((item.to === 'updates' || item.to === '#updates') && this.props.countData && this.props.countData[item.to])
                  || (item.to !== 'updates' || item.to !== '#updates')
                ? (item.title === 'Bonus Rewards' && this.props.isBonusReward)
                    || (item.title !== 'Bonus Rewards') ? (
                      <>
                        {(item.title === 'Account Settings' && this.props.userStore.isInvestor && investorAccounts.length !== 0)
                          && (
                            <Divider />)
                        }
                        {item.external
                          ? (<a className="item" href={item.to} rel="noopener noreferrer" target="_blank">{item.title}</a>)
                          : (
                            <>
                              <Menu.Item
                                key={item.to}
                                name={item.to}
                                id={(newLayout && isTablet) ? `${item.to.slice(1)}-mob-nav` : ''}
                                className={`${((isMobile && item.title === 'Home' && location.pathname !== '/') || (!isMobile && item.title === 'Dashboard' && location.pathname !== '/dashboard')) ? 'no-active' : `${((item.defaultActive && this.isActiveSubMenu(`${item.to}`, location, true))) ? 'active' : ''} ${this.isActiveSubMenu(item.to, location) ? 'active' : ''}`} ${(item.title === 'Account Settings' && hasMoreThanOneAcc) ? 'mt-10' : ''} ${(newLayout && ((item.to === 'updates' || item.to === '#updates') || (item.to === 'comments' || item.to === '#comments')) ? 'hasLabel' : '')}`}
                                as={needNavLink ? Link : NavLink}
                                onClick={isMobile ? this.mobileMenuClick : this.doNothing}
                                target={item.forced ? '_blank' : false}
                                to={item.forced || `${(isApp) ? '/dashboard' : (this.props.sub ? match.url : '')}${(item.useRefLink || item.asRoot) ? '' : '/'}${item.asRoot ? '' : item.to}`}
                              >
                                {item.icon && <Icon className={item.icon} />}
                                {item.to === 'messages' && <Label circular color="red" size="mini" horizontal>3</Label>}
                                {(item.title !== 'Updates' || (item.title === 'Updates' && item.to.includes('updates') && this.props.countData) || isPrivateApp) ? <span>{typeof item.title === 'object' && roles ? item.title[roles[0]] : item.title}</span> : ''}
                                {((item.to === 'updates' || item.to === '#updates') || (item.to === 'comments' || item.to === '#comments')) && this.props.countData
                                  ? <Label basic circular color="grey">{this.props.countData[item.to === '#updates' ? 'updates' : item.to === '#comments' ? 'comments' : item.to]}</Label> : null
                                }
                              </Menu.Item>
                              {this.props.userStore.isInvestor && item.title === 'Setup' && !investorAccounts.length
                                && (
                                  <Divider />
                                )
                              }
                            </>
                          )}
                      </>
                  ) : '' : ''
              )}
      </>
    ));
  }
}

const getLogo = path => (path.includes('/lendio') ? 'LogoNsAndLendio' : 'LogoGreenGrey');

const getLogoStyle = path => (path.includes('/lendio') ? { height: '28px', width: 'auto' } : {});


@inject('navStore', 'uiStore', 'userStore', 'userDetailsStore')
@withRouter
@observer
export class NavigationItems extends Component {
  setAuthRef = () => {
    this.props.uiStore.setAuthRef(this.props.location.pathname);
  }

  handleDashboardBtn = () => {
    this.props.history.push('/init-dashboard');
  }

  render() {
    const {
      stepInRoute, location, currentUser, loading, isMobBussinessApp,
      isPrequalQulify, canSubmitApp, preQualSubmit, navStore,
      isMobile,
    } = this.props;
    const { navStatus, subNavStatus } = navStore;
    const logInSignUp = stepInRoute.to !== 'login' ? [
      { to: 'login', title: 'Log In', className: 'basic primary' },
      { to: 'register', title: 'Sign Up', className: 'primary' },
    ]
      : [{ ...stepInRoute, className: 'primary basic' }];
    return (
      <Menu
        stackable={!isMobBussinessApp}
        borderless
        fixed="top"
        className={`${navStatus === 'sub' ? 'active' : ''} ${subNavStatus}`}
      >
        <Container fluid>
          {!isMobBussinessApp
            && (
              <Menu.Item as={Link} to="/" header>
                <Logo
                  alt="NextSeed.com"
                  dataSrc={getLogo(location.pathname)}
                  style={getLogoStyle(location.pathname)}
                  size={isTablet && 'small'}
                />
              </Menu.Item>
            )
          }
          <Menu.Menu position="right">
            <NavItems
              refLoc="public"
              currentUser={currentUser}
              location={location}
              navItems={
                isMobile ? PUBLIC_NAV.filter(nav => nav.header !== false)
                  : PUBLIC_NAV.filter(nav => nav.header !== false && nav.title !== 'Legal')
              }
            />
          </Menu.Menu>
          {location.pathname.includes('/business-application') && !location.pathname.includes('commercial-real-estate/')
            ? (
              <Menu.Item position={isMobBussinessApp ? 'right' : ''}>
                <Button.Group>
                  <Button as={Link} to="/business" loading={loading} inverted color="red">Cancel</Button>
                  {(isPrequalQulify || location.pathname.endsWith('/pre-qualification'))
                    && (
                      <SubmitButton
                        canSubmitApp={canSubmitApp}
                        click={preQualSubmit}
                        loading={loading}
                      />
                    )}
                </Button.Group>
              </Menu.Item>
            )
            : !location.pathname.includes('/business-application') && (!matchPath(location.pathname, { path: '/dashboard' }))
            && (
              !currentUser ? (
                <>
                  {logInSignUp.map(route => (
                    <Menu.Item className="menu-button">
                      <Button as={Link} onClick={this.setAuthRef} to={`/${route.to}`} className={`${route.className}`}>{route.title}</Button>
                    </Menu.Item>
                  ))}
                </>
              ) : (
                  <Menu.Item
                    className="menu-button"
                    onClick={this.handleDashboardBtn}
                  >
                    <Button
                      loading={this.props.userDetailsStore.currentUser.loading}
                      disabled={this.props.userDetailsStore.currentUser.loading}
                      primary
                    >Dashboard
                  </Button>
                  </Menu.Item>
              ))}
        </Container>
      </Menu>
    );
  }
}
