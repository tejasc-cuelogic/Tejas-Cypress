import React, { Component } from 'react';
import { get } from 'lodash';
import { toJS } from 'mobx';
import { inject } from 'mobx-react';
import { Header, Divider } from 'semantic-ui-react';
import KeytermsDetails from './investmentDetails/KeytermsDetails';
import { InlineLoader } from '../../../../../theme/shared';
import HtmlEditor from '../../../../shared/HtmlEditor';
import Helper from '../../../../../helper/utility';

const isMobile = document.documentElement.clientWidth < 992;
@inject('campaignStore', 'navStore')
class InvestmentDetails extends Component {
  componentWillMount() {
    this.props.campaignStore.calculateTotalPaymentData();
    if (!this.props.newLayout) {
      window.addEventListener('scroll', this.handleOnScroll);
    }
  }

  componentDidMount() {
    if (!this.props.newLayout && this.props.location.hash && this.props.location.hash !== '') {
      this.props.navStore.setFieldValue('currentActiveHash', null);
      document.querySelector(`${this.props.location.hash}`).scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });
    } else if (!this.props.newLayout && !isMobile) {
      const { campaignNavData } = this.props.campaignStore;
      const navs = (campaignNavData.find(i => i.title === 'Investment Details')).subNavigations;
      const sel = navs && navs[0] && navs[0].to;
      if (sel) {
        this.props.navStore.setFieldValue('currentActiveHash', sel);
        document.querySelector(sel).scrollIntoView(true);
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
    const navs = toJS((campaignNavData.find(i => i.title === 'Investment Details')).subNavigations);
    if (navs && Array.isArray(navs)) {
      navs.forEach((item) => {
        if (document.getElementById(item.to.slice(1))
        && document.getElementById(item.to.slice(1)).getBoundingClientRect().top < 200
        && document.getElementById(item.to.slice(1)).getBoundingClientRect().top > -1) {
          this.props.navStore.setFieldValue('currentActiveHash', item.to);
        }
      });
    }
  }

  render() {
    const { campaign, campaignStatus } = this.props.campaignStore;
    const emptyContent = 'No data found.';
    const offeringExpenseAmountDescription = get(campaign, 'legal.general.useOfProceeds.offeringExpenseAmountDescription');
    return (
      <>
        {this.props.newLayout
        && (
        <>
        <Header as="h3" className={`${this.props.newLayout ? 'mt-40' : ''} ${!isMobile ? 'mb-40' : 'mb-20'} anchor-wrap`}>
          Investment Terms
          <span className="anchor" id="key-terms" />
        </Header>
        <KeytermsDetails
          refLink={this.props.refLink}
          KeyTerms={campaign && campaign.keyTerms}
          {...this.props}
        />
        </>
        )}
        {campaignStatus.useOfProcceds
        && (
          <>
          <Header as="h3" className={`${isMobile ? 'mb-20 mt-20' : this.props.newLayout ? 'mt-40' : 'mb-30 mt-20'} anchor-wrap`}>
          Use of Proceeds
          <span className="anchor" id="use-of-proceeds" />
        </Header>
        {campaign && campaign.legal
          && campaign.legal.general && campaign.legal.general.useOfProceeds
          ? <HtmlEditor readOnly content={offeringExpenseAmountDescription || emptyContent} />
          : <InlineLoader text={emptyContent} className="bg-offwhite" />
        }
        {/* <Divider hidden />
        <Image64
          srcUrl={campaign && campaign.media &&
            campaign.media.useOfProceeds &&
            campaign.media.useOfProceeds.url ?
            campaign.media.useOfProceeds.url : null
          }
          imgType="useOfProceeds"
          fluid
        /> */}
        <Divider section hidden />
        </>
        )}
        {!this.props.newLayout
        && (
        <>
        <Header as="h3" className="mb-30 anchor-wrap">
          Key Terms
          <span className="anchor" id="key-terms" />
        </Header>
        <KeytermsDetails
          refLink={this.props.refLink}
          KeyTerms={campaign && campaign.keyTerms}
          {...this.props}
        />
        </>
        )}
      </>
    );
  }
}

export default InvestmentDetails;
