import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject } from 'mobx-react';
import { Header, Divider } from 'semantic-ui-react';
import KeytermsDetails from './investmentDetails/KeytermsDetails';
import { InlineLoader, Image64 } from '../../../../../theme/shared';

@inject('campaignStore', 'navStore')
class InvestmentDetails extends Component {
  componentWillMount() {
    this.props.campaignStore.calculateTotalPaymentData();
    window.addEventListener('scroll', this.handleOnScroll);
  }
  componentDidMount() {
    if (this.props.location.hash && this.props.location.hash !== '') {
      this.props.navStore.setFieldValue('currentActiveHash', null);
      setTimeout(() => document.querySelector(`${this.props.location.hash}`).scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      }), 100);
    } else {
      const sel = 'use-of-proceeds';
      document.querySelector(`#${sel}`).scrollIntoView(true);
    }
  }
  componentWillUnmount() {
    this.props.navStore.setFieldValue('currentActiveHash', null);
    window.removeEventListener('scroll', this.handleOnScroll);
  }
  handleOnScroll = () => {
    const { investmentDetailsSubNavs } = this.props.campaignStore;
    investmentDetailsSubNavs.forEach((item) => {
      if (document.getElementById(item.to.slice(1)) &&
      document.getElementById(item.to.slice(1)).getBoundingClientRect().top < 100 &&
      document.getElementById(item.to.slice(1)).getBoundingClientRect().top > 0) {
        this.props.navStore.setFieldValue('currentActiveHash', item.to);
      }
    });
  }
  render() {
    const { campaign } = this.props.campaignStore;
    const emptyContent = 'No data found.';
    const minOfferingExpenseDesc = campaign && campaign.legal &&
      campaign.legal.general && campaign.legal.general.useOfProceeds &&
      campaign.legal.general.useOfProceeds.minOfferingExpenseAmountDescription ?
      campaign.legal.general.useOfProceeds.minOfferingExpenseAmountDescription
      :
      null;
    const maxOfferingExpenseDesc = campaign && campaign.legal &&
      campaign.legal.general && campaign.legal.general.useOfProceeds &&
      campaign.legal.general.useOfProceeds.maxOfferingExpenseAmountDescription ?
      campaign.legal.general.useOfProceeds.maxOfferingExpenseAmountDescription
      :
      null;
    return (
      <Aux>
        <Header as="h3" className="mt-10 mb-30 anchor-wrap">
          Use of Proceeds
          <span className="anchor" id="use-of-proceeds" />
        </Header>
        {campaign && campaign.legal &&
          campaign.legal.general && campaign.legal.general.useOfProceeds ?
            <Aux>
              <Header as="h6">If minimum offering amount is reached:</Header>
              <p>{minOfferingExpenseDesc || emptyContent}</p>
              <Header as="h6">If maximum offering amount is reached:</Header>
              <p>{maxOfferingExpenseDesc || emptyContent}</p>
            </Aux>
            :
            <InlineLoader text={emptyContent} className="bg-offwhite" />
        }
        <Divider hidden />
        <Image64
          srcUrl={campaign && campaign.media &&
            campaign.media.useOfProceeds &&
            campaign.media.useOfProceeds.url ?
            campaign.media.useOfProceeds.url : null
          }
          imgType="useOfProceeds"
          fluid
        />
        <Divider section hidden />
        <Header as="h3" className="mb-30 anchor-wrap">
          Key Terms
          <span className="anchor" id="key-terms" />
        </Header>
        <KeytermsDetails
          refLink={this.props.refLink}
          KeyTerms={campaign && campaign.keyTerms}
          {...this.props}
        />
      </Aux>
    );
  }
}

export default InvestmentDetails;
