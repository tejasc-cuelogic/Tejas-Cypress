import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { toJS } from 'mobx';
import { Divider } from 'semantic-ui-react';
import CompanyTopThings from './AboutCompany/CompanyTopThings';
import MeetOurTeam from './AboutCompany/MeetOurTeam';
import BusinessModel from './AboutCompany/BusinessModel';
import LocationAnalysis from './AboutCompany/LocationAnalysis';
import CompanyHistory from './AboutCompany/CompanyHistory';
import Helper from '../../../../../helper/utility';

const isTabletLand = document.documentElement.clientWidth >= 992
  && document.documentElement.clientWidth < 1200;
const topsAsPerWindowheight = window.innerHeight > 1000 ? 550 : 200;
const isMobile = document.documentElement.clientWidth < 992;

@inject('campaignStore', 'navStore')
@withRouter
@observer
class AboutCompany extends Component {
  componentWillMount() {
    if (!this.props.newLayout) {
      window.addEventListener('scroll', this.handleOnScroll);
    }
  }

  componentDidMount() {
    if (!this.props.newLayout && this.props.location.hash && this.props.location.hash !== '') {
      this.props.navStore.setFieldValue('currentActiveHash', null);
      if (document.querySelector(`${this.props.location.hash}`)) {
        document.querySelector(`${this.props.location.hash}`).scrollIntoView({
          block: 'start',
          behavior: 'smooth',
        });
      }
    } else if (!this.props.newLayout && !isMobile) {
      const { campaignNavData } = this.props.campaignStore;
      const navs = (campaignNavData.find(i => i.title === 'About the Company')).subNavigations;
      const sel = navs && navs[0] && navs[0].to;
      if (sel) {
        document.querySelector(sel).scrollIntoView(true);
        this.props.navStore.setFieldValue('currentActiveHash', sel);
      }
    }
    Helper.eventListnerHandler('toggleReadMore', 'toggleReadMore');
  }

  componentWillUnmount() {
    if (!this.props.newLayout) {
      this.props.navStore.setFieldValue('currentActiveHash', null);
      window.removeEventListener('scroll', this.handleOnScroll);
    }
    Helper.eventListnerHandler('toggleReadMore', 'toggleReadMore', 'remove');
  }

  handleOnScroll = () => {
    const { campaignNavData } = this.props.campaignStore;
    const navs = toJS((campaignNavData.find(i => i.title === 'About the Company')).subNavigations);
    if (navs && Array.isArray(navs)) {
      navs.forEach((item) => {
        if (document.getElementById(item.to.slice(1))
        && document.getElementById(item.to.slice(1)).getBoundingClientRect().top < topsAsPerWindowheight
        && document.getElementById(item.to.slice(1)).getBoundingClientRect().top > -1) {
          this.props.navStore.setFieldValue('currentActiveHash', item.to);
        }
      });
    }
  }

  render() {
    const { campaign, campaignStatus } = this.props.campaignStore;
    const emptyStatement = 'Detail not found';
    return (
      <div className={this.props.newLayout ? '' : 'campaign-content-wrapper'}>
        {campaignStatus.companyDescription ? (
        <>
          <CompanyTopThings newLayout={this.props.newLayout} emptyStatement={emptyStatement} campaign={campaign} />
          <Divider hidden section={!isMobile} />
        </>
        ) : null}
        {campaignStatus.businessModel ? (
        <>
          <BusinessModel newLayout={this.props.newLayout} businessModelUrl={this.props.match.url} campaign={campaign} />
          <Divider hidden section={!isMobile} />
        </>
        ) : null}
        {campaignStatus.localAnalysis ? (
        <>
        <LocationAnalysis
          isTabletLand={isTabletLand}
          LocationAnalysisDetailUrl={this.props.match.url}
          campaign={campaign}
          newLayout={this.props.newLayout}
        />
        <Divider hidden section={!isMobile} />
        </>
        ) : null}
        {campaignStatus.history ? (
        <>
        <CompanyHistory newLayout={this.props.newLayout} campaign={campaign} emptyStatement={emptyStatement} />
        <Divider hidden section={!isMobile} />
        </>
        ) : null}
        {campaignStatus.team ? (
        <>
        <MeetOurTeam
          campaign={campaign}
          emptyStatement={emptyStatement}
          meetOurTeamUrl={this.props.match.url}
          newLayout={this.props.newLayout}
        />
        <Divider hidden section={!isMobile} />
        </>
        ) : null}
      </div>
    );
  }
}

export default AboutCompany;
