import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { DataFormatter } from '../../../../../../helper';
import { SuspenseBoundary, lazyRetry } from '../../../../../../theme/shared';

const getModule = component => lazyRetry(() => import(`./badActorCheck/${component}`));

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
      <SuspenseBoundary>
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
      </SuspenseBoundary>
    );
  }
}
