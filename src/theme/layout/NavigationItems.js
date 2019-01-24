/* eslint-disable react/no-multi-comp  */
import React, { Component } from 'react';
import { Link, NavLink, withRouter, matchPath } from 'react-router-dom';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Container, Icon, Menu, Dropdown, Label, Button } from 'semantic-ui-react';
import { PUBLIC_NAV } from '../../constants/NavigationMeta';
import { Logo } from '../shared';
import { SubmitButton } from '../../modules/shared/businessApplication/components/HeaderButtons';

@withRouter
@observer
export class NavItems extends Component {
  state = { active: '' };
  navClick = (e, { name }) => {
    if (this.props.refLoc !== 'public') {
      const newState = this.state.active === name ? '' : name;
      this.setState({ active: newState });
    }
    if (this.props.refLoc !== 'public' && e.target.getAttribute('role') !== 'option') {
      this.props.history.replace(`/app/${name}`);
    }
  };
  isActive = (to, location, app, subNavigations) => {
    if (to === '' && subNavigations) {
      return subNavigations.find(s => location.pathname.startsWith(`/${s.to}`));
    }
    return ((to !== '' && this.state.active === to) ||
      ((this.props.refLoc !== 'public' && location.pathname.startsWith(`/${app}/${to}`)) ||
        (this.props.refLoc === 'public' && to !== '' && location.pathname.startsWith(`/${to}`))));
  }
  isActiveSubMenu = (to, location, hashCheck = false) =>
    (hashCheck ? location.hash === '' : location.hash === to);

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
            className={`${this.isActive(item.to, location, app, item.subNavigations) ? 'active really' : ''}
            ${item.title === 'How NextSeed Works' && isMobile ? 'visible' : ''}
            `}
            name={item.to}
            disabled={isMobile && item.title === 'How NextSeed Works'}
            onClick={item.title !== 'How NextSeed Works' && isMobile ? this.navClick : e => this.doNothing(e, item.clickable ? `${refLink}/${item.to}` : false, item.clickable)}
            text={
              <Aux>
                {item.icon &&
                  <Icon className={item.icon} />
                }
                <span>
                  {typeof item.title === 'object' && roles ? item.title[roles[0]] : item.title}
                </span>
              </Aux>
            }
          >
            <Dropdown.Menu
              className={`${this.isActive(item.to, location, app, item.subNavigations) && isMobile ? 'visible' : ''} ${item.title === 'How NextSeed Works' && isMobile ? 'visible' : ''}
              `}
            >
              {item.subNavigations.map(sn => (
                <Dropdown.Item
                  key={sn.to}
                  className={`${((sn.defaultActive && this.isActiveSubMenu(`${sn.to}`, location, true))) ? 'active' : ''} ${this.isActiveSubMenu(sn.to, location) ? 'active' : ''}`}
                  as={NavLink}
                  onClick={isMobile ? onToggle : e => this.doNothing(e, false, item.clickable)}
                  to={sn.useRefLink ? `${refLink}/${item.to}/${sn.to}` : `${(isApp) ? '/app' : ''}${(item.to !== '' ? `/${item.to}` : '')}/${sn.to}`}
                >
                  {sn.title}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        ) :
          item.title === 'Bonus Rewards' && !this.props.bonusRewards ?
            null
            : (
              <Menu.Item
                key={item.to}
                name={item.to}
                className={isMobile && item.title === 'Home' && location.pathname !== '/' ? 'no-active' : ''}
                as={NavLink}
                onClick={isMobile ? onToggle : this.doNothing}
                to={`${(isApp) ? '/app' : (this.props.sub ? match.url : '')}/${item.to}`}
              >
                {item.icon &&
                  <Icon className={item.icon} />
                }
                {item.to === 'messages' &&
                  <Label circular color="red" size="mini" horizontal>3</Label>
                }
                <span>{item.title}</span>
                {(item.to === 'updates' || item.to === 'comments') && this.props.countData ?
                  <Label circular color="blue" size="small">{this.props.countData[item.to]}</Label> : null
                }
              </Menu.Item>
            )}
      </Aux>
    ));
  }
}

const getLogo = path => (path.includes('/lendio') ? 'LogoNsAndLendio' : (
  (matchPath(path, { path: '/offerings/:id/:section?' }) ? 'LogoColor' :
    (path.includes('business-application') ? 'LogoWhiteGreen' : 'LogoWhite'))
));

const getLogoStyle = path => (path.includes('/lendio') ? { height: '28px', width: 'auto' } : {});


@inject('navStore', 'uiStore')
@observer
export class NavigationItems extends Component {
  setAuthRef = () => {
    this.props.uiStore.setAuthRef(this.props.location.pathname);
  }
  render() {
    const {
      stepInRoute, location, currentUser, loading,
      isPrequalQulify, canSubmitApp, preQualSubmit, navStore,
    } = this.props;
    const { navStatus, subNavStatus } = navStore;
    return (
      <Menu
        stackable
        borderless
        inverted={!matchPath(location.pathname, { path: '/offerings/:id/:section?' }) || navStatus === 'sub'}
        fixed="top"
        // className={navStatus === 'sub' ? 'slide-up1' : ''}
        className={`${navStatus === 'sub' ? 'active' : ''} ${subNavStatus}`}
      // className={`${navStatus === 'sub' ? 'active' : ''}
      // ${bottomPassed ? { subNavStatus } : ''}`}
      >
        <Container fluid>
          <Menu.Item as={Link} to="/" header>
            <Logo
              size="small"
              alt="NextSeed.com"
              dataSrc={getLogo(location.pathname)}
              style={getLogoStyle(location.pathname)}
            />
          </Menu.Item>
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
            <Menu.Item>
              <Button.Group>
                <Button as={Link} to="/business/how-it-works" inverted color="red">Cancel</Button>
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
                <Menu.Item as={Link} onClick={this.setAuthRef} to={`/auth/${stepInRoute.to}`}>
                  <Button secondary compact>{stepInRoute.title}</Button>
                </Menu.Item>
              ) : (
                <Menu.Item
                  as={Link}
                  to={`/app/${currentUser.roles && currentUser.roles.includes('investor') ? 'summary' : 'dashboard'}`}
                >
                  <Button secondary compact>Dashboard</Button>
                </Menu.Item>
                ))}
        </Container>
      </Menu>
    );
  }
}
