import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject } from 'mobx-react';
import { Header, Divider } from 'semantic-ui-react';
import TermNoteDetails from './investmentDetails/TermNoteDetails';
import RevenueSharingDetails from './investmentDetails/RevenueSharingDetails';
import { CAMPAIGN_KEYTERMS_SECURITIES_ENUM } from '../../../../../constants/offering';
import { InlineLoader, Image64 } from '../../../../../theme/shared';

@inject('campaignStore')
class InvestmentDetails extends Component {
  componentDidMount() {
    if (this.props.location.hash && this.props.location.hash !== '') {
      document.querySelector(`${this.props.location.hash}`).scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });
    } else {
      const sel = 'use-of-proceeds';
      document.querySelector(`#${sel}`).scrollIntoView(true);
    }
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
        <Header as="h3" className="mb-30 anchor-wrap">
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
        {campaign && campaign.keyTerms &&
          campaign.keyTerms.securities &&
          campaign.keyTerms.securities ===
          CAMPAIGN_KEYTERMS_SECURITIES_ENUM.REVENUE_SHARING_NOTE ?
            <RevenueSharingDetails
              refLink={this.props.refLink}
              KeyTerms={campaign && campaign.keyTerms}
              {...this.props}
            /> :
            <TermNoteDetails
              refLink={this.props.refLink}
              KeyTerms={campaign && campaign.keyTerms}
              {...this.props}
            />
        }
      </Aux>
    );
  }
}

export default InvestmentDetails;
