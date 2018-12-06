import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject } from 'mobx-react';
import { Route } from 'react-router-dom';
import { Grid, Header, Segment, Responsive } from 'semantic-ui-react';
import TermNoteDetails from './investmentDetails/TermNoteDetails';
import RevenueSharingDetails from './investmentDetails/RevenueSharingDetails';
import { CAMPAIGN_KEYTERMS_SECURITIES_ENUM } from '../../../../../constants/offering';
import { InlineLoader, Image64 } from '../../../../../theme/shared';
import SummaryModal from '../campaignDetails/investmentDetails/SummaryModal';

const isTabletLand = document.documentElement.clientWidth >= 992
  && document.documentElement.clientWidth < 1200;
@inject('campaignStore')
class InvestmentDetails extends Component {
  render() {
    const { campaign } = this.props.campaignStore;
    const emptyContent = 'No data found.';
    return (
      <div className="campaign-content-wrapper">
        <Aux>
          <Grid stackable doubling>
            <Grid.Row>
              <Responsive maxWidth={767} as={Aux}>
                <Grid.Column tablet={16}>
                  <Segment padded>
                    <Image64
                      srcUrl={campaign && campaign.media &&
                        campaign.media.heroImage &&
                        campaign.media.heroImage.url ?
                        campaign.media.heroImage.url : null
                      }
                    />
                  </Segment>
                </Grid.Column>
              </Responsive>
              <Grid.Column widescreen={6} largeScreen={6} computer={16} tablet={16}>
                <Segment padded>
                  <div className="segment-container small">
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
                              campaign.legal.general.useOfProceeds.reachedMinOfferingGoal
                              :
                              emptyContent
                            }
                          </p>
                          <Header as="h6">If maximum offering amount is reached:</Header>
                          <p>
                            {campaign && campaign.legal &&
                              campaign.legal.general && campaign.legal.general.useOfProceeds &&
                              campaign.legal.general.useOfProceeds.reachedMaxOfferingGoal ?
                              campaign.legal.general.useOfProceeds.reachedMaxOfferingGoal
                              :
                              emptyContent
                            }
                          </p>
                        </Aux>
                      :
                        <InlineLoader text={emptyContent} />
                    }
                  </div>
                </Segment>
              </Grid.Column>
              <Responsive minWidth={768} as={Aux}>
                <Grid.Column widescreen={10} largeScreen={10} computer={16} tablet={16} className={isTabletLand && 'mt-30'}>
                  <Segment padded className="overview-video">
                    <Image64
                      srcUrl={campaign && campaign.media &&
                        campaign.media.heroImage &&
                        campaign.media.heroImage.url ?
                        campaign.media.heroImage.url : null
                      }
                    />
                  </Segment>
                </Grid.Column>
              </Responsive>
            </Grid.Row>
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
          </Grid>
          <Route path={`${this.props.match.url}/summary`} render={props => <SummaryModal refLink={this.props.match.ur} campaign={campaign} {...props} />} />
        </Aux>
      </div>
    );
  }
}

export default InvestmentDetails;
