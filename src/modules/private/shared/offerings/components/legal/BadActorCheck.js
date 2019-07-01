import React, { Component, Suspense, lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
import { DataFormatter } from '../../../../../../helper';
import { InlineLoader } from '../../../../../../theme/shared';

const getModule = component => lazy(() => import(`./badActorCheck/${component}`));

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
      <Suspense fallback={<InlineLoader />}>
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
      </Suspense>
    );
  }
}
