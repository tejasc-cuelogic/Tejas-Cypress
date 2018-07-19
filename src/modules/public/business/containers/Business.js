import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import { Menu, Visibility } from 'semantic-ui-react';
import { DataFormatter } from '../../../../helper';
import { GetNavMeta } from '../../../../theme/layout/SidebarNav';
import { NavItems } from '../../../../theme/layout/NavigationItems';
import Banner from '../components/Banner';

const getModule = component => Loadable({
  loader: () => import(`../components/${component}`),
  loading() {
    return <div>Loading...</div>;
  },
});

class Business extends Component {
  state = { subnavOnTop: false };
  module = name => DataFormatter.upperCamelCase(name);
  handleUpdate = (e, { calculations }) => {
    const { percentagePassed, topVisible } = calculations;
    this.setState({ subnavOnTop: percentagePassed > 0 && !topVisible });
  }
  render() {
    const { match, location } = this.props;
    const navItems = GetNavMeta(match.url, [], true).subNavigations;
    return (
      <div>
        {location.pathname === '/business' && <Banner />}
        <Visibility onUpdate={this.handleUpdate} continuous>
          <Menu secondary className={`center-align menu-secondary ${this.state.subnavOnTop ? 'top' : ''}`}>
            <NavItems sub refLoc="public" location={location} navItems={navItems} />
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
      </div>
    );
  }
}

export default Business;
