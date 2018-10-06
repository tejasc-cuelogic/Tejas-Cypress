import React, { Component } from 'react';
import Loadable from 'react-loadable';
import { Grid } from 'semantic-ui-react';
import { inject } from 'mobx-react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { InlineLoader } from '../../../../../theme/shared';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';
import { DataFormatter } from '../../../../../helper';

const getModule = component => Loadable({
  loader: () => import(`./legal/${component}`),
  loading() {
    return <InlineLoader />;
  },
});

@inject('userStore', 'offeringsStore')
@withRouter
export default class Legal extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.push(`${this.props.match.url}/general`);
    }
  }

  module = name => DataFormatter.upperCamelCase(name);

  render() {
    const userLegalInfo = [
      { title: 'General', to: 'general' },
      { title: 'Risk Factors', to: 'risk-factors' },
      { title: 'Documentation', to: 'documentation' },
    ];
    const adminLegalInfo = [
      { title: 'Generate Docs', to: 'generate-docs' },
      {
        title: 'Bad Actor Check',
        to: 'bad-actor-check',
        subNavigations: [
          { title: 'Issuer', to: 'bad-actor-check/issuer' },
          { title: 'Affiliated Issuer', to: 'bad-actor-check/affiliated-issuer' },
          { title: 'Leadership', to: 'bad-actor-check/leadership' },
        ],
      },
    ];
    const { match, offeringsStore } = this.props;
    const { isIssuer } = this.props.userStore;
    const { offer, offerLoading } = offeringsStore;
    if (offerLoading || (offer && !offer.keyTerms)) {
      return <InlineLoader />;
    }
    return (
      <div className={!isIssuer || (isIssuer && match.url.includes('offering-creation')) ? 'inner-content-spacer' : ''}>
        <Grid>
          <Grid.Column widescreen={4} computer={3} tablet={3} mobile={16}>
            <SecondaryMenu heading="User Legal Info" secondary vertical match={match} navItems={userLegalInfo} />
            <SecondaryMenu heading="Admin Legal Info" secondary vertical match={match} navItems={adminLegalInfo} />
          </Grid.Column>
          <Grid.Column widescreen={12} computer={13} tablet={13} mobile={16}>
            <Switch>
              <Route
                exact
                path={match.url}
                component={getModule(this.module(userLegalInfo[0].title))}
              />
              {
                userLegalInfo.map(item => (
                  <Route exact={false} key={item.to} path={`${match.url}/${item.to}`} component={getModule(this.module(item.title))} />
                ))
              }
              {
                adminLegalInfo.map(item => (
                  <Route exact={false} key={item.to} path={`${match.url}/${item.to}`} component={getModule(this.module(item.title))} />
                ))
              }
            </Switch>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
