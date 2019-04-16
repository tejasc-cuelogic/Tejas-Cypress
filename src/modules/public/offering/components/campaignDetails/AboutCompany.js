import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Divider } from 'semantic-ui-react';
import CompanyTopThings from './AboutCompany/CompanyTopThings';
import MeetOurTeam from './AboutCompany/MeetOurTeam';
import BusinessModel from './AboutCompany/BusinessModel';
import LocationAnalysis from './AboutCompany/LocationAnalysis';
import CompanyHistory from './AboutCompany/CompanyHistory';


const isTabletLand = document.documentElement.clientWidth >= 992
  && document.documentElement.clientWidth < 1200;
const topsAsPerWindowheight = window.innerHeight > 1000 ? 550 : 200;

@inject('campaignStore', 'navStore')
@observer
class AboutCompany extends Component {
  componentWillMount() {
    window.addEventListener('scroll', this.handleOnScroll);
  }
  componentDidMount() {
    if (this.props.location.hash && this.props.location.hash !== '') {
      this.props.navStore.setFieldValue('currentActiveHash', null);
      document.querySelector(`${this.props.location.hash}`).scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });
    } else {
      const sel = 'company-description';
      document.querySelector(`#${sel}`).scrollIntoView(true);
    }
  }
  componentWillUnmount() {
    this.props.navStore.setFieldValue('currentActiveHash', null);
    window.removeEventListener('scroll', this.handleOnScroll);
  }
  handleOnScroll = () => {
    ['company-description', 'business-model', 'location-analysis', 'history', 'team'].forEach((item) => {
      if (item === 'business-model' || item === 'company-description') {
        console.log(item, document.getElementById(item).getBoundingClientRect().top);
      }
      if (document.getElementById(item).getBoundingClientRect().top <= topsAsPerWindowheight &&
        document.getElementById(item).getBoundingClientRect().top >= -1) {
        this.props.navStore.setFieldValue('currentActiveHash', `#${item}`);
      }
    });
  }
  render() {
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
        <CompanyHistory campaign={campaign} emptyStatement={emptyStatement} />
        <Divider hidden section />
        <MeetOurTeam
          campaign={campaign}
          emptyStatement={emptyStatement}
          meetOurTeamUrl={this.props.match.url}
        />
      </div>
    );
  }
}

export default AboutCompany;
