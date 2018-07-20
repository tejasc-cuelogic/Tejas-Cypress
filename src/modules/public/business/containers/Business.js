import React, { Component } from 'react';
import Aux from 'react-aux';
import { Route, Switch, Link } from 'react-router-dom';
import Loadable from 'react-loadable';
import { Menu, Visibility, Container, Button } from 'semantic-ui-react';
import { DataFormatter } from '../../../../helper';
import { GetNavMeta } from '../../../../theme/layout/SidebarNav';
import { NavItems } from '../../../../theme/layout/NavigationItems';
import Banner from '../components/Banner';
import { Logo } from '../../../../theme/shared/';

const getModule = component => Loadable({
  loader: () => import(`../components/${component}`),
  loading() {
    return <div>Loading...</div>;
  },
});
const getLogo = path => (path.includes('/lendio') ? 'LogoNsAndLendio' : (
  (path.includes('business-application') || path.includes('business') ? 'LogoWhite' : 'LogoColor')
));

class Business extends Component {
  state = { subnavOnTop: false };
  module = name => DataFormatter.upperCamelCase(name);
  handleUpdate = (e, { calculations }) => {
    const { percentagePassed, topVisible } = calculations;
    this.setState({ subnavOnTop: percentagePassed > 0 && !topVisible });
  }
  render() {
    const {
      location, match,
    } = this.props;
    const navItems = GetNavMeta(match.url, [], true).subNavigations;
    return (
      <Aux>
        {location.pathname === '/business' && <Banner />}
        <Visibility as={Aux} onUpdate={this.handleUpdate} continuous>
          <Menu secondary className={`center-align menu-secondary-fixed ${this.state.subnavOnTop ? 'active' : ''}`}>
            <Container fluid>
              <Menu.Item as={Link} to="/" header>
                <Logo
                  size="small"
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
          <Switch>
            <Route exact path={match.url} component={getModule(this.module(navItems[0].title))} />
            {
              navItems.map(item => (
                <Route
                  key={item.to}
                  path={`${match.url}/${item.to}`}
                  component={getModule(this.module(item.title))}
                />
              ))
            }
          </Switch>
        </Visibility>
      </Aux>
    );
  }
}

export default Business;
