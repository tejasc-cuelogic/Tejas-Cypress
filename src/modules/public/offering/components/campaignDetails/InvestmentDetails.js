import React, { Component } from 'react';
import { get } from 'lodash';
import { inject } from 'mobx-react';
import { Header, Divider } from 'semantic-ui-react';
import KeytermsDetails from './investmentDetails/KeytermsDetails';
import { InlineLoader } from '../../../../../theme/shared';
import HtmlEditor from '../../../../shared/HtmlEditor';

const isMobile = document.documentElement.clientWidth < 992;
@inject('campaignStore', 'navStore')
class InvestmentDetails extends Component {
  componentWillMount() {
    this.props.campaignStore.calculateTotalPaymentData();
    window.addEventListener('scroll', this.handleOnScroll);
  }

  componentDidMount() {
    if (this.props.location.hash && this.props.location.hash !== '') {
      this.props.navStore.setFieldValue('currentActiveHash', null);
      document.querySelector(`${this.props.location.hash}`).scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });
    } else if (!isMobile) {
      const { campaignNavData } = this.props.campaignStore;
      const navs = (campaignNavData.find(i => i.title === 'Investment Details')).subNavigations;
      const sel = navs && navs[0] && navs[0].to;
      if (sel) {
        document.querySelector(sel).scrollIntoView(true);
      }
    }
  }

  componentWillUnmount() {
    this.props.navStore.setFieldValue('currentActiveHash', null);
    window.removeEventListener('scroll', this.handleOnScroll);
  }

  handleOnScroll = () => {
    const { campaignNavData } = this.props.campaignStore;
    const navs = (campaignNavData.find(i => i.title === 'Investment Details')).subNavigations;
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
        {campaignStatus.useOfProcceds
        && (
          <>
          <Header as="h3" className={`${isMobile ? 'mb-20' : 'mb-30'} mt-20 anchor-wrap`}>
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
    );
  }
}

export default InvestmentDetails;
