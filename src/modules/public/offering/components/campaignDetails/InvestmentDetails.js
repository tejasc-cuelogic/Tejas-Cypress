import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject } from 'mobx-react';
import { Grid, Header, Segment, Image, Responsive } from 'semantic-ui-react';
// import businessModel from '../../../../../assets/images/investment-1.jpg';
import businessModel from '../../../../../assets/images/investment-2.jpg';
import termnotes from '../../../../../assets/images/investment-1.jpg';
import TermNoteDetails from './investmentDetails/TermNoteDetails';
import RevenueSharingDetails from './investmentDetails/RevenueSharingDetails';
import { CAMPAIGN_KEYTERMS_SECURITIES } from '../../../../../constants/offering';

const isTabletLand = document.documentElement.clientWidth >= 992
  && document.documentElement.clientWidth < 1200;
@inject('campaignStore')
class InvestmentDetails extends Component {
  render() {
    const { campaign } = this.props.campaignStore;
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
                      CAMPAIGN_KEYTERMS_SECURITIES.REVENUE_SHARING_NOTE ? businessModel : termnotes}
                    fluid
                  />
                </Segment>
              </Grid.Column>
            </Responsive>
            <Grid.Column widescreen={7} largeScreen={8} computer={16} tablet={16}>
              <Segment padded>
                <Header as="h3">Use of Proceeds</Header>
                {campaign && campaign.keyTerms &&
                  campaign.keyTerms.securities && campaign.keyTerms.securities ===
                  CAMPAIGN_KEYTERMS_SECURITIES.REVENUE_SHARING_NOTE ?
                    <Aux>
                      <p>
                      BuffBrew expects the complete buildout of the new building and brewery to be a
                      $14 million project. The scope of the Buffbrew Taproom is $3.4 million.
                      Buffbrew is committed to financing the total project, while opening up a
                      portion of the financing for BuffBrew Taproom through NextSeed.
                      </p>
                      <p>
                      100% of the funding proceeds will be used towards the buildout of the new
                      Buffbrew Taproom facility. The spend includes construction as well as the
                      purchasing of equipment, furniture and supplies.
                      </p>
                    </Aux>
                  :
                    <Aux>
                      <Header as="h6">If minimum offering amount is reached:</Header>
                      <p>
                        The buildout and launch of America Gardens in East Midtown Houston
                        is estimated at $1.8 million.
                      </p>
                      <Header as="h6">If maximum offering amount is reached:</Header>
                      <p>
                        Jonathan Serrano and Shawn Rao have raised equity commitments of $1,800,000
                        (contributed cash of $750,000) in equity for the project thus far. Through
                        the NextSeed campaign, the business is seeking to raise between $200,000 and
                        $1,000,000 to complete construction. Upon completion of the NextSeed
                        campaign, the equity commitments will cover any remaining balance of the
                        project cost.
                      </p>
                    </Aux>
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
                      businessModel : termnotes
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
