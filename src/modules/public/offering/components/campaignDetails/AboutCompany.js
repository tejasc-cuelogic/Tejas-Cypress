import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Grid } from 'semantic-ui-react';
import Loadable from 'react-loadable';
import { InlineLoader } from '../../../../../theme/shared';
import CompanyDescriptionModal from './CompanyDescriptionModal';
import AboutPhotoGallery from './AboutPhotoGallery';
import Gallery from './AboutCompany/Gallery';
import CompanyTopThings from './AboutCompany/CompanyTopThings';
import MeetOurTeam from './AboutCompany/MeetOurTeam';
import BusinessModel from './AboutCompany/BusinessModel';
import LocationAnalysis from './AboutCompany/LocationAnalysis';

const getModule = component => Loadable({
  loader: () => import(`../${component}`),
  loading() {
    return <InlineLoader />;
  },
});
const settings = {
  dots: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
};

const isTablet = document.documentElement.clientWidth >= 768
  && document.documentElement.clientWidth < 992;
const isTabletLand = document.documentElement.clientWidth >= 992
  && document.documentElement.clientWidth < 1200;

@inject('campaignStore')
@observer
class AboutCompany extends Component {
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
        <Grid stackable>
          <Grid.Row>
            <CompanyTopThings
              companyDescriptionUrl={this.props.match.url}
              emptyStatement={emptyStatement}
              campaign={campaign}
            />
            <Gallery
              settings={settings}
              isTabletLand={isTabletLand}
              isTablet={isTablet}
              galleryUrl={this.props.match.url}
              campaign={campaign}
            />
          </Grid.Row>
          <Grid.Row columns={isTablet ? 1 : isTabletLand ? 2 : 3} className="campaign-right-sidebar">
            <MeetOurTeam
              campaign={campaign}
              emptyStatement={emptyStatement}
              meetOurTeamUrl={this.props.match.url}
            />
            <BusinessModel
              businessModelUrl={this.props.match.url}
            />
            <LocationAnalysis
              isTabletLand={isTabletLand}
              LocationAnalysisDetailUrl={this.props.match.url}
              campaign={campaign}
            />
          </Grid.Row>
        </Grid>
        <Switch>
          {
            navItems.map(item => (
              <Route key={item.to} path={`${this.props.match.url}/${item.to}`} component={getModule(item.component)} />
            ))
          }
        </Switch>
        <Route path={`${this.props.match.url}/company-description`} component={CompanyDescriptionModal} />
        <Route path={`${this.props.match.url}/photogallery`} component={AboutPhotoGallery} />
      </div>
    );
  }
}

export default AboutCompany;
