import React, { Component } from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import Aux from 'react-aux';
import { Container, Icon, Image, Menu, Dropdown, Label, Button } from 'semantic-ui-react';
import { PUBLIC_NAV } from '../../constants/NavigationMeta';
import LogoC from '../../assets/images/nextseed_logo_white.svg';
import LogoW from '../../assets/images/logo.svg';
import LogoNsAndLendio from '../../assets/images/nextseed_and_lendio.svg';

@withRouter
export class NavItems extends Component {
  state = { active: '' };
  navClick = (e, { name }) => {
    this.setState({ active: name });
    if (this.props.refLoc !== 'public' && e.target.getAttribute('role') !== 'option') {
      this.props.history.replace(`/app/${name}`);
    }
  };
  isActive = (to, location, app) => (to !== '' && this.state.active === to) || location.pathname.startsWith(`/${app}/${to}`);
  render() {
    const {
      location,
      isApp,
      refLoc,
    } = this.props;
    const app = (isApp) ? 'app' : '';
    const myNavItems = [...this.props.navItems];
    if (refLoc === 'public') {
      const kickMe = this.props.currentUser ? 4 : 5;
      myNavItems.splice(kickMe, 1);
    }
    return myNavItems.map(item => (
      <Aux>
        {(item.subPanel === 1 && item.subNavigations) ? (
          <Dropdown
            item
            key={item.to}
            className={this.isActive(item.to, location, app) ? 'active' : ''}
            name={item.to}
            onClick={this.navClick}
            text={
              <Aux>
                {item.icon &&
                  <Icon className={item.icon} />
                }
                <span>{item.title}</span>
              </Aux>
            }
          >
            <Dropdown.Menu className={this.isActive(item.to, location) ? 'visible' : ''}>
              {item.subNavigations.map(sn => (
                <Dropdown.Item
                  key={sn.to}
                  as={NavLink}
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
            as={NavLink}
            to={`${(isApp) ? '/app' : ''}/${item.to}`}
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

const getLogo = path => (path.includes('/lendio') ? LogoNsAndLendio : (
  (path.includes('business-application') || path.includes('/offerings') ? LogoW : LogoC)
));

const getLogoStyle = path => (path.includes('/lendio') ? { height: '28px', width: 'auto' } : {});

export const NavigationItems = props => (
  <Menu borderless inverted={props.location.pathname.includes('/business-application')} fixed="top" className={props.location.pathname.includes('/offerings') ? '' : 'inverted'}>
    <Container fluid>
      <Menu.Item as={Link} to="/" header>
        <Image
          size="small"
          src={getLogo(props.location.pathname)}
          style={getLogoStyle(props.location.pathname)}
          alt="NextSeed.com"
        />
      </Menu.Item>
      <Menu.Menu position="right">
        {!props.location.pathname.includes('/business-application') &&
          <NavItems refLoc="public" currentUser={props.currentUser} location={props.location} navItems={PUBLIC_NAV} />
        }
        <Button secondary compact>Sign Up/Log In</Button>
      </Menu.Menu>
    </Container>
  </Menu>
);
