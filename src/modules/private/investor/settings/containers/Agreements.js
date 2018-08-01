import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Grid } from 'semantic-ui-react';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';
import { EmptyDataSet } from '../../../../../theme/shared';
import AgreementsPdfLoader from '../components/agreements/AgreementsPdfLoader';


@inject('agreementsStore')
@observer
export default class Agreements extends Component {
  componentWillMount() {
    const { match } = this.props;
    const { fetchNavItems } = this.props.agreementsStore;
    if (match.isExact && match.url === this.props.location.pathname) {
      fetchNavItems().then(() => {
        if (this.props.agreementsStore.getNavItems &&
          this.props.agreementsStore.getNavItems.length) {
          this.props.history.replace(`${match.url}/${this.props.agreementsStore.getNavItems[0].to}`);
        }
      });
    } else if (!this.props.agreementsStore.getNavItems.length) {
      fetchNavItems();
    }
  }

  render() {
    const { match } = this.props;
    const { getNavItems } = this.props.agreementsStore;
    return (
      <div>
        {getNavItems && getNavItems.length ?
          <Grid>
            <Grid.Column widescreen={3} largeScreen={4} computer={4} tablet={4} mobile={16}>
              <SecondaryMenu secondary vertical match={match} navItems={getNavItems} />
            </Grid.Column>
            <Grid.Column floated="right" widescreen={12} largeScreen={11} computer={12} tablet={12} mobile={16}>
              <Switch>
                <Route exact path={`${match.url}/:agreementId`} component={AgreementsPdfLoader} />
              </Switch>
            </Grid.Column>
          </Grid> : <EmptyDataSet title="No data available for agreements." />
        }
      </div>
    );
  }
}
