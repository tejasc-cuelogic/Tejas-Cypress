import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Grid } from 'semantic-ui-react';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';
import { EmptyDataSet, InlineLoader } from '../../../../../theme/shared';
import AgreementsPdfLoader from '../components/agreements/AgreementsPdfLoader';


@inject('agreementsStore')
@observer
export default class Agreements extends Component {
  render() {
    const { match } = this.props;
    const { getNavItems, docIdsLoading } = this.props.agreementsStore;
    if (docIdsLoading) {
      return <InlineLoader />;
    }
    return (
      <div>
        {getNavItems && getNavItems.length ?
          <Grid>
            <Grid.Column widescreen={3} largeScreen={4} computer={4} tablet={4} mobile={16}>
              <SecondaryMenu secondary vertical match={match} navItems={getNavItems} />
            </Grid.Column>
            <Grid.Column floated="right" widescreen={12} largeScreen={11} computer={12} tablet={12} mobile={16}>
              <Switch>
                <Route exact path={`${match.url}/:agreementKey?`} component={AgreementsPdfLoader} />
              </Switch>
            </Grid.Column>
          </Grid> : <EmptyDataSet title="No data available for agreements." />
        }
      </div>
    );
  }
}
