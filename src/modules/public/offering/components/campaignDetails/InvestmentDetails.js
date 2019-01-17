import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject } from 'mobx-react';
import { Route } from 'react-router-dom';
import { Header, Divider } from 'semantic-ui-react';
import TermNoteDetails from './investmentDetails/TermNoteDetails';
import RevenueSharingDetails from './investmentDetails/RevenueSharingDetails';
import { CAMPAIGN_KEYTERMS_SECURITIES_ENUM } from '../../../../../constants/offering';
import { InlineLoader, Image64 } from '../../../../../theme/shared';
import SummaryModal from '../campaignDetails/investmentDetails/SummaryModal';

// const isTabletLand = document.documentElement.clientWidth >= 992
//   && document.documentElement.clientWidth < 1200;
@inject('campaignStore')
class InvestmentDetails extends Component {
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
      <div className="campaign-content-wrapper">
        <Aux>
          <Header as="h3" className="mb-30">Use of Proceeds</Header>
          {campaign && campaign.legal &&
            campaign.legal.general && campaign.legal.general.useOfProceeds ?
              <Aux>
                <Header as="h6">If minimum offering amount is reached:</Header>
                <p>
                  {minOfferingExpenseDesc || emptyContent}
                </p>
                <Header as="h6">If maximum offering amount is reached:</Header>
                <p>
                  {maxOfferingExpenseDesc || emptyContent}
                </p>
              </Aux>
              :
              <section className="bg-offwhite">
                <InlineLoader text={emptyContent} />
              </section>
          }
          <Divider hidden />
          {/* <Image64
            srcUrl={campaign && campaign.media &&
              campaign.media.heroImage &&
              campaign.media.heroImage.url ?
              campaign.media.heroImage.url : null
            }
            imgType="heroImage"
            /> */}
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
          <Route path={`${this.props.match.url}/summary`} render={props => <SummaryModal refLink={this.props.match.ur} campaign={campaign} {...props} />} />
        </Aux>
      </div>
    );
  }
}

export default InvestmentDetails;
