import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import { Visibility } from 'semantic-ui-react';
import { DataFormatter } from '../../../../helper';
import { GetNavMeta } from '../../../../theme/layout/SidebarNav';
import Banner from '../components/Banner';
import { PublicSubNav, InlineLoader } from '../../../../theme/shared/';

const getModule = component => Loadable({
  loader: () => import(`../components/${component}`),
  loading() {
    return <InlineLoader />;
  },
});

@inject('navStore', 'userStore')
@observer
class Business extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.replace(`${this.props.match.url}/how-it-works`);
    }
  }
  module = name => DataFormatter.upperCamelCase(name);
  handleUpdate = (e, { calculations }) => this.props.navStore.setNavStatus(calculations);
  render() {
    const { location, match, navStore } = this.props;
    const navItems = GetNavMeta(match.url, [], true).subNavigations;
    return (
      <Aux>
        {location.pathname === '/business/how-it-works' && <Banner />}
        <Visibility
          onUpdate={this.handleUpdate}
          continuous
          className={`slide-down ${location.pathname.split('/')[2]}`}
        >
          <PublicSubNav
            navStatus={navStore.navStatus}
            stepInRoute={navStore.stepInRoute}
            location={location}
            currentUser={this.props.userStore.currentUser}
            navItems={navItems}
            title="Fundraising"
          />
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
