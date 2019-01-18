import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import Loadable from 'react-loadable';
import { Divider } from 'semantic-ui-react';
import { InlineLoader } from '../../../../../theme/shared';
import CompanyDescriptionModal from './CompanyDescriptionModal';
import CompanyTopThings from './AboutCompany/CompanyTopThings';
import MeetOurTeam from './AboutCompany/MeetOurTeam';
import BusinessModel from './AboutCompany/BusinessModel';
import LocationAnalysis from './AboutCompany/LocationAnalysis';
import CompanyHistory from './AboutCompany/CompanyHistory';

const getModule = component => Loadable({
  loader: () => import(`../${component}`),
  loading() {
    return <InlineLoader />;
  },
});

const isTabletLand = document.documentElement.clientWidth >= 992
  && document.documentElement.clientWidth < 1200;

@inject('campaignStore')
@observer
class AboutCompany extends Component {
  componentDidMount() {
    if (this.props.location.hash && this.props.location.hash !== '') {
      document.querySelector(`${this.props.location.hash}`).scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });
    }
  }
  render() {
    const navItems = [
      { to: 'business', component: 'BusinessModal' },
      { to: 'locationanalysis', component: 'LocationAnalysisModal' },
      { to: 'meetourteam', component: 'MeetTeamModal' },
    ];
    const { campaign } = this.props.campaignStore;
    const emptyStatement = 'Detail not found';
    return (
      <div className="campaign-content-wrapper">
        <CompanyTopThings emptyStatement={emptyStatement} campaign={campaign} />
        <Divider hidden section />
        <BusinessModel businessModelUrl={this.props.match.url} campaign={campaign} />
        <Divider hidden section />
        <LocationAnalysis
          isTabletLand={isTabletLand}
          LocationAnalysisDetailUrl={this.props.match.url}
          campaign={campaign}
        />
        <Divider hidden section />
        <MeetOurTeam
          campaign={campaign}
          emptyStatement={emptyStatement}
          meetOurTeamUrl={this.props.match.url}
        />
        <Divider hidden section />
        <CompanyHistory campaign={campaign} emptyStatement={emptyStatement} />
        <Switch>
          {
            navItems.map(item => (
              <Route key={item.to} path={`${this.props.match.url}/${item.to}`} component={getModule(item.component)} />
            ))
          }
        </Switch>
        <Route path={`${this.props.match.url}/company-description`} component={CompanyDescriptionModal} />
      </div>
    );
  }
}

export default AboutCompany;
