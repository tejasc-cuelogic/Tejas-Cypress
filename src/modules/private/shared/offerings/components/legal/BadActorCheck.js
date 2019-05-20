import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { DataFormatter } from '../../../../../../helper';
import Issuer from './badActorCheck/Issuer';
import AffiliatedIssuer from './badActorCheck/AffiliatedIssuer';
import Leadership from './badActorCheck/Leadership';

export default class BadActorCheck extends Component {
  module = name => DataFormatter.upperCamelCase(name);

  render() {
    const badActorCheckInfo = [
      { title: 'Issuer', to: 'issuer', component: Issuer },
      { title: 'Affiliated Issuer', to: 'affiliated-issuer', component: AffiliatedIssuer },
      { title: 'Leadership', to: 'leadership', component: Leadership },
    ];
    const { match } = this.props;

    return (
      <Switch>
        <Route
          exact
          path={match.url}
          component={badActorCheckInfo[0].component}
        />
        {
          badActorCheckInfo.map(item => (
            <Route key={item.to} path={`${match.url}/${item.to}`} component={item.component} />
          ))
        }
      </Switch>
    );
  }
}
