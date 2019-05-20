import React, { Component } from 'react';
import Loadable from 'react-loadable';
import { Route, Switch } from 'react-router-dom';
import { DataFormatter } from '../../../../../../helper';
import { InlineLoader } from '../../../../../../theme/shared';

const getModule = component => Loadable({
  loader: () => import(`./badActorCheck/${component}`),
  loading() {
    return <InlineLoader />;
  },
});

export default class BadActorCheck extends Component {
  module = name => DataFormatter.upperCamelCase(name);

  render() {
    const badActorCheckInfo = [
      { title: 'Issuer', to: 'issuer' },
      { title: 'Affiliated Issuer', to: 'affiliated-issuer' },
      { title: 'Leadership', to: 'leadership' },
    ];
    const { match } = this.props;

    return (
      <Switch>
        <Route
          exact
          path={match.url}
          component={getModule(this.module(badActorCheckInfo[0].title))}
        />
        {
          badActorCheckInfo.map(item => (
            <Route key={item.to} path={`${match.url}/${item.to}`} component={getModule(this.module(item.title))} />
          ))
        }
      </Switch>
    );
  }
}
