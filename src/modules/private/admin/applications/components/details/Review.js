import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Grid, Icon, Button, Divider } from 'semantic-ui-react';
import Loadable from 'react-loadable';
import { mapValues } from 'lodash';
import SecondaryMenu from '../../../../../../theme/layout/SecondaryMenu';
import { DataFormatter } from '../../../../../../helper';
import { InlineLoader } from '../../../../../../theme/shared';
// import { NEXTSEED_BOX_URL } from '../../../../../../constants/common';
import { NEXTSEED_SECURITIES_BOX_URL } from '../../../../../../constants/common';

const getModule = component => Loadable({
  loader: () => import(`./review/${component}`),
  loading() {
    return <InlineLoader />;
  },
});

const navItems = [
  { title: 'Overview', to: 'overview' },
  { title: 'PreQualification', to: 'preQualification' },
  { title: 'Business Plan', to: 'businessPlan' },
  { title: 'Projections', to: 'projections' },
  { title: 'Documentation', to: 'documentation' },
  { title: 'Miscellaneous', to: 'miscellaneous' },
  { title: 'Contingencies', to: 'contingencies' },
  {
    title: 'Model',
    to: 'model',
    subNavigations: [
      { title: 'Inputs', to: 'model/inputs', component: 'Inputs' },
      { title: 'Variables', to: 'model/variables', component: 'Variables' },
      { title: 'Results', to: 'model/results', component: 'Results' },
    ],
  },
  { title: 'Offer', to: 'offer' },
];

@inject('businessAppReviewStore')
@withRouter
@observer
export default class Review extends Component {
  componentWillMount() {
    this.props.businessAppReviewStore.setFieldvalue('showGeneratePA', false);
    if (this.props.match.isExact) {
      this.props.history.push(`${this.props.match.url}/${navItems[0].to}`);
    }
  }

  module = name => DataFormatter.upperCamelCase(name);

  representAddon = summary => mapValues(summary, s => (
    s !== '' && <Icon color={s === 'ns-check-circle' ? 'green' : 'orange'} name={s} />
  ));
  render() {
    const { match, businessAppReviewStore } = this.props;
    const {
      subNavPresentation, updateStatuses, paBoxFolderId,
      generatePortalAgreement, showGeneratePA, inProgress,
    } = businessAppReviewStore;
    updateStatuses(navItems);
    return (
      <div className="inner-content-spacer">
        <Grid>
          <Grid.Column widescreen={4} computer={3} tablet={3} mobile={16}>
            <div className="sticky-sidebar">
              <SecondaryMenu
                addon={{ data: this.representAddon(subNavPresentation) }}
                secondary
                vertical
                match={match}
                navItems={navItems}
              />
              <Divider hidden />
              {showGeneratePA &&
              <Button.Group size="mini">
                <Button color="blue" content="Generate PA" loading={inProgress === 'GENERATE_PA'} onClick={generatePortalAgreement} />
                {paBoxFolderId &&
                <Button color="blue" className="link-button" content="PA BOX Link" onClick={() => window.open(`${NEXTSEED_SECURITIES_BOX_URL}folder/${paBoxFolderId}`, '_blank')} />
                }
              </Button.Group>
              }
            </div>
          </Grid.Column>
          <Grid.Column widescreen={12} computer={13} tablet={13} mobile={16}>
            <Switch>
              <Route exact path={match.url} component={getModule(this.module(navItems[0].title))} />
              {
                navItems.map(item => (
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
