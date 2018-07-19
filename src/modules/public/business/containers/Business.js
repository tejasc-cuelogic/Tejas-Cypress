import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import { Menu } from 'semantic-ui-react';
import Aux from 'react-aux';
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
  module = name => DataFormatter.upperCamelCase(name);
  render() {
    const { match, location } = this.props;
    const navItems = GetNavMeta(match.url, [], true).subNavigations;
    return (
      <Aux>
        <Banner />
        <Menu secondary className="center-align menu-secondary">
          <Menu.Item>Fundraising</Menu.Item>
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
      </Aux>
    );
  }
}

export default Business;
