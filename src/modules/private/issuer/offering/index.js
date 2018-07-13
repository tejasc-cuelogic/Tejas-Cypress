import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Loadable from 'react-loadable';
import { Route, Switch } from 'react-router-dom';
import PrivateLayout from '../../shared/PrivateHOC';
import { DataFormatter } from '../../../../helper';

const getModule = component => Loadable({
  loader: () => import(`./containers/${component}`),
  loading() {
    return <div>Loading...</div>;
  },
});

@inject('uiStore', 'navStore')
@observer
export default class Offering extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.replace(`${this.props.match.url}/overview`);
    }
  }
  module = name => DataFormatter.upperCamelCase(name);
  render() {
    const { match } = this.props;
    const navItems = this.props.navStore.navMeta.subNavigations;
    return (
      <PrivateLayout {...this.props}>
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
      </PrivateLayout>
    );
  }
}
