import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import { Container, Menu, Button } from 'semantic-ui-react';
import { NavItems } from './NavigationItems';
import { Logo } from '../shared';
import { DataFormatter } from '../../helper';
import { GetNavMeta } from './SidebarNav';

const getLogo = path => (path.includes('/lendio') ? 'LogoNsAndLendio' : (
  (path.includes('business-application') || path.includes('business') ? 'LogoWhite' : 'LogoColor')
));

class PublicSecondaryNav extends Component {
  state = { subnavOnTop: false };
  module = name => DataFormatter.upperCamelCase(name);
  handleUpdate = (e, { calculations }) => {
    const { percentagePassed, topVisible } = calculations;
    this.setState({ subnavOnTop: percentagePassed > 0 && !topVisible });
  }
  render() {
    const {
      location, refLoc, match,
    } = this.props;
    const myNavItems = [...this.props.navItems];
    if (refLoc === 'public') {
      const kickMe = this.props.currentUser ? 4 : 5;
      myNavItems.splice(kickMe, 1);
    }
    const navItems = GetNavMeta(match.url, [], true).subNavigations;
    return (
      <Aux>
        <Menu secondary className={`center-align menu-secondary-fixed ${this.state.subnavOnTop ? 'active' : ''}`}>
          <Container fluid>
            <Menu.Item as={Link} to="/" header>
              <Logo
                alt="NextSeed.com"
                dataSrc={getLogo(this.props.location.pathname)}
              />
            </Menu.Item>
            <Menu.Menu secondary className="center-align menu-secondary">
              <Menu.Item>Fundraising</Menu.Item>
              <NavItems sub refLoc="public" location={location} navItems={navItems} />
            </Menu.Menu>
            <Menu.Item as={Link} to="/" position="right">
              <Button secondary compact>Sign Up/Log In</Button>
            </Menu.Item>
          </Container>
        </Menu>
      </Aux>
    );
  }
}

export default PublicSecondaryNav;
