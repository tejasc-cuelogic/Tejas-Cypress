/* eslint-disable react/no-multi-comp  */
import React, { Component } from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import Aux from 'react-aux';
import { Container, Icon, Menu, Dropdown, Label, Button } from 'semantic-ui-react';
import { PUBLIC_NAV } from '../../constants/NavigationMeta';
import { Logo } from '../shared';
import { SubmitButton } from '../../modules/shared/businessApplication/components/HeaderButtons';

@withRouter
export class NavItems extends Component {
  state = { active: '' };
  navClick = (e, { name }) => {
    const newState = this.state.active === name ? '' : name;
    this.setState({ active: newState });
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
  doNothing = () => console.log('nothing');
  render() {
    const {
      location, isApp, roles, match, isMobile, onToggle,
    } = this.props;
    const app = (isApp) ? 'app' : '';
    const myNavItems = this.props.navItems.filter(n => n.noNav !== true);
    return myNavItems.map(item => (
      <Aux>
        {(item.subPanel === 1 && item.subNavigations) ? (
          <Dropdown
            item
            key={item.to}
            className={`${this.isActive(item.to, location, app, item.subNavigations) ? 'active' : ''}
            ${item.title === 'How NextSeed Works' && isMobile ? 'visible' : ''}
            `}
            name={item.to}
            onClick={item.title !== 'How NextSeed Works' && isMobile ? this.navClick : this.doNothing}
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
                  as={NavLink}
                  onClick={isMobile ? onToggle : this.doNothing}
                  to={`${(isApp) ? '/app' : ''}${(item.to !== '' ? `/${item.to}` : '')}/${sn.to}`}
                >
                  {sn.title}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <Menu.Item
            key={item.to}
            name={item.to}
            as={location.pathname === '/' ? NavLink : Link}
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
          </Menu.Item>
        )}
      </Aux>
    ));
  }
}

const getLogo = path => (path.includes('/lendio') ? 'LogoNsAndLendio' : (
  (path.includes('offerings') ? 'LogoColor' : (path.includes('business-application') ? 'LogoWhiteGreen' : 'LogoWhite'))
));

const getLogoStyle = path => (path.includes('/lendio') ? { height: '28px', width: 'auto' } : {});


export class NavigationItems extends Component {
  render() {
    const {
      stepInRoute, navStatus, location, currentUser, loading,
      isPrequalQulify, canSubmitApp, preQualSubmit,
    } = this.props;
    return (
      <Menu
        stackable
        borderless
        inverted={!location.pathname.includes('/offerings')}
        fixed="top"
        className={navStatus === 'sub' ? 'slide-up' : ''}
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
                <Button as={Link} to="/" inverted color="red">Cancel</Button>
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
              <Menu.Item as={Link} to={`/auth/${stepInRoute.to}`}>
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
