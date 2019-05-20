import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Grid, Icon, Button, Divider } from 'semantic-ui-react';
import { mapValues } from 'lodash';
import SecondaryMenu from '../../../../../../theme/layout/SecondaryMenu';
import { NEXTSEED_SECURITIES_BOX_URL } from '../../../../../../constants/common';
import Overview from './review/Overview';
import PreQualification from './review/PreQualification';
import BusinessPlan from './review/BusinessPlan';
import Projections from './review/Projections';
import Documentation from './review/Documentation';
import Miscellaneous from './review/Miscellaneous';
import Contingencies from './review/Contingencies';
import Offer from './review/Offer';
import Inputs from './review/Inputs';
import Variables from './review/Variables';
import Results from './review/Results';

const navItems = [
  { title: 'Overview', to: 'overview', component: Overview },
  { title: 'PreQualification', to: 'preQualification', component: PreQualification },
  { title: 'Business Plan', to: 'businessPlan', component: BusinessPlan },
  { title: 'Projections', to: 'projections', component: Projections },
  { title: 'Documentation', to: 'documentation', component: Documentation },
  { title: 'Miscellaneous', to: 'miscellaneous', component: Miscellaneous },
  { title: 'Contingencies', to: 'contingencies', component: Contingencies },
  {
    title: 'Model',
    to: 'model',
    subNavigations: [
      { title: 'Inputs', to: 'model/inputs', component: Inputs },
      { title: 'Variables', to: 'model/variables', component: Variables },
      { title: 'Results', to: 'model/results', component: Results },
    ],
  },
  { title: 'Offer', to: 'offer', component: Offer },
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

  representAddon = summary => mapValues(summary, s => (
    s !== '' && <Icon color={s === 'ns-check-circle' ? 'green' : 'orange'} name={s} />
  ));
  render() {
    const { match, businessAppReviewStore, appType } = this.props;
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
              <Route exact path={match.url} component={navItems[0].component} />
              {
                navItems.map((item) => {
                  const CurrentComponent = item.component;
                  return (
                    <Route
                      exact={false}
                      key={item.to}
                      path={`${match.url}/${item.to}`}
                      render={props =>
                        (<CurrentComponent
                          appType={appType}
                          {...props}
                        />)
                      }
                    />
                  );
                })
              }
            </Switch>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
