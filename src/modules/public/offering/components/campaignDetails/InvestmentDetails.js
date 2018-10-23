import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject } from 'mobx-react';
import { Grid, Header, Segment, Image, Responsive } from 'semantic-ui-react';
import { ASSETS_URL } from '../../../../../constants/aws';
// import businessModel from '../../../../../assets/images/investment-1.jpg';
import TermNoteDetails from './investmentDetails/TermNoteDetails';
import RevenueSharingDetails from './investmentDetails/RevenueSharingDetails';
import { CAMPAIGN_KEYTERMS_SECURITIES } from '../../../../../constants/offering';
import { InlineLoader } from '../../../../../theme/shared';

const isTabletLand = document.documentElement.clientWidth >= 992
  && document.documentElement.clientWidth < 1200;
@inject('campaignStore')
class InvestmentDetails extends Component {
  render() {
    const { campaign } = this.props.campaignStore;
    const emptyContent = 'No data found.';
    return (
      <div className="campaign-content-wrapper">
        <Grid stackable doubling>
          <Grid.Row>
            <Responsive maxWidth={767} as={Aux}>
              <Grid.Column tablet={16}>
                <Segment padded>
                  <Image
                    src={campaign && campaign.keyTerms &&
                      campaign.keyTerms.securities && campaign.keyTerms.securities ===
                      CAMPAIGN_KEYTERMS_SECURITIES.REVENUE_SHARING_NOTE ? `${ASSETS_URL}images/investment-2.jpg` : `${ASSETS_URL}images/investment-1.jpg`}
                    fluid
                  />
                </Segment>
              </Grid.Column>
            </Responsive>
            <Grid.Column widescreen={7} largeScreen={8} computer={16} tablet={16}>
              <Segment padded>
                <Header as="h3">Use of Proceeds</Header>
                {campaign && campaign.legal &&
                  campaign.legal.general && campaign.legal.general.useOfProceeds &&
                  campaign.legal.general.useOfProceeds ?
                    <Aux>
                      <Header as="h6">If minimum offering amount is reached:</Header>
                      <p>
                        {campaign && campaign.legal &&
                          campaign.legal.general && campaign.legal.general.useOfProceeds &&
                          campaign.legal.general.useOfProceeds.reachedMinOfferingGoal ?
                          campaign.legal.general.useOfProceeds.reachedMinOfferingGoal : emptyContent
                        }
                      </p>
                      <Header as="h6">If maximum offering amount is reached:</Header>
                      <p>
                        {campaign && campaign.legal &&
                          campaign.legal.general && campaign.legal.general.useOfProceeds &&
                          campaign.legal.general.useOfProceeds.reachedMaxOfferingGoal ?
                          campaign.legal.general.useOfProceeds.reachedMaxOfferingGoal : emptyContent
                        }
                      </p>
                    </Aux>
                  :
                    <InlineLoader text={emptyContent} />
                }
              </Segment>
            </Grid.Column>
            <Responsive minWidth={768} as={Aux}>
              <Grid.Column widescreen={9} largeScreen={8} computer={16} tablet={16} className={isTabletLand && 'mt-30'}>
                <Segment padded>
                  <Image
                    src={campaign && campaign.keyTerms &&
                      campaign.keyTerms.securities &&
                      campaign.keyTerms.securities ===
                      CAMPAIGN_KEYTERMS_SECURITIES.REVENUE_SHARING_NOTE ?
                      `${ASSETS_URL}images/investment-2.jpg` : `${ASSETS_URL}images/investment-1.jpg`
                    }
                    fluid
                  />
                </Segment>
              </Grid.Column>
            </Responsive>
          </Grid.Row>
          {campaign && campaign.keyTerms &&
            campaign.keyTerms.securities &&
            campaign.keyTerms.securities ===
            CAMPAIGN_KEYTERMS_SECURITIES.REVENUE_SHARING_NOTE ?
              <RevenueSharingDetails
                refLink={this.props.refLink}
                KeyTerms={campaign.keyTerms}
                {...this.props}
              /> :
              <TermNoteDetails
                refLink={this.props.refLink}
                KeyTerms={campaign.keyTerms}
                {...this.props}
              />
          }
        </Grid>
      </div>
    );
  }
}

export default InvestmentDetails;
