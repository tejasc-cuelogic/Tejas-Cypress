import React, { Component } from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import Aux from 'react-aux';
import { Container, Icon, Image, Menu, Dropdown, Label, Button } from 'semantic-ui-react';
import LogoC from '../../assets/images/nextseed_logo_color.svg';
import LogoW from '../../assets/images/nextseed_logo_white_green.svg';

const PUBLIC_NAV_ITEMS = [
  { title: 'Browse Deals', to: 'offerings' },
  { title: 'For Investers', to: 'invest' },
  { title: 'For Businesses', to: 'business' },
  {
    title: 'Learn',
    subPanel: 1,
    to: '',
    subNavigations: [
      { title: 'Team', to: 'about/team' },
      { title: 'Ambassadors', to: 'about/ambassadors' },
      { title: 'Blog', to: 'blog' },
      { title: 'Case Studies', to: 'case-studies' },
      { title: 'FAQ', to: 'about/faq' },
    ],
  },
  {
    title: 'Log In or Sign Up',
    subPanel: 1,
    to: 'auth',
    subNavigations: [
      { title: 'Log In', to: 'login' },
      { title: 'Register', to: 'register' },
    ],
  },
  { title: 'Dashboard', to: 'app/dashboard' },
];

@withRouter
export class NavItems extends Component {
  state = { active: '' };
  navClick = (e, { name }) => {
    this.setState({ active: name });
    console.log(e.target, 'e.target');
    if (this.props.refLoc !== 'public' && e.target.getAttribute('role') !== 'option') {
      this.props.history.replace(`/app/${name}`);
    }
  };
  isActive = (to, location, app) => (to !== '' && this.state.active === to) || location.pathname.startsWith(`/${app}/${to}`);
  render() {
    const { location, isApp, refLoc } = this.props;
    const app = (isApp) ? 'app' : '';
    const myNavItems = [...this.props.navItems];
    if (refLoc === 'public') {
      const kickMe = this.props.currentUser ? 4 : 5;
      myNavItems.splice(kickMe, 1);
    }
    return myNavItems.map(item => (
      <Aux>
        {(item.subNavigations && item.subNavigations.length > 0) ? (
          <Dropdown
            item
            key={item.to}
            className={this.isActive(item.to, location, app) ? 'active' : ''}
            name={item.to}
            onClick={this.navClick}
            text={<Aux><Icon className={item.icon} /><span>{item.title}</span></Aux>}
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

export const NavigationItems = props => (
  <Menu borderless inverted={props.location.pathname === '/business-application'} fixed="top" size="large">
    <Container fluid>
      <Menu.Item as={Link} to="/" header>
        <Image
          className="small"
          src={props.location.pathname === '/business-application' ? LogoW : LogoC}
          alt="NextSeed.com"
        />
      </Menu.Item>
      <Menu.Menu position="right">
        {props.location.pathname !== '/business-application' ?
          <NavItems refLoc="public" currentUser={props.currentUser} location={props.location} navItems={PUBLIC_NAV_ITEMS} /> : (
            <Button.Group style={{ padding: '19px' }}>
              <Button inverted color="green">Save and Continue later</Button>
              <Button color="grey" disabled>Submit</Button>
            </Button.Group>
          )
        }
      </Menu.Menu>
    </Container>
  </Menu>
);
