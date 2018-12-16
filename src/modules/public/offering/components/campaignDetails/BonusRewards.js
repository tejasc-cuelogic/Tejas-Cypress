import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { intersectionBy, orderBy } from 'lodash';
import Parser from 'html-react-parser';
import { Header, Grid, Segment, Label, List, Image } from 'semantic-ui-react';
import { ASSETS_URL } from '../../../../../constants/aws';
import { InlineLoader } from '../../../../../theme/shared';

const isTablet = document.documentElement.clientWidth >= 768
  && document.documentElement.clientWidth < 992;
const isTabletLand = document.documentElement.clientWidth >= 992
  && document.documentElement.clientWidth < 1200;

@inject('campaignStore')
@observer
class BonusRewards extends Component {
  render() {
    const { campaign } = this.props.campaignStore;
    const rewardsTiers = campaign && campaign.rewardsTierIds &&
      campaign.rewardsTierIds.length && orderBy(campaign.rewardsTierIds, ['earlyBirdQuantity', 'amount'], ['desc', 'asc']);
    const bonusRewards = campaign && campaign.bonusRewards &&
      campaign.bonusRewards.length && campaign.bonusRewards;
    const earlyBirdsCount = ((campaign && campaign.earlyBirdsCount) || 0);
    const offeringMISC = campaign && campaign.offering && campaign.offering.misc &&
      campaign.offering.misc.additionalBonusRewardsContent ?
      campaign.offering.misc.additionalBonusRewardsContent : null;
    return (
      <div className="campaign-content-wrapper">
        {rewardsTiers && rewardsTiers.length ?
          <div>
            <Grid stackable>
              <Grid.Column>
                <Header as="h3">Bonus Rewards</Header>
              </Grid.Column>
            </Grid>
            {(rewardsTiers && rewardsTiers.length) || bonusRewards ?
              <Grid stackable doubling columns={isTablet ? 1 : isTabletLand ? 2 : 3}>
                {rewardsTiers.map(tier => (
                  <Grid.Column>
                    <Segment padded className="reward-block">
                      {tier.earlyBirdQuantity > 0 ?
                        <Aux>
                          <Header as="h6">Early Bird Reward
                            <Image src={`${ASSETS_URL}images/illustration.png`} floated="right" />
                            <Header.Subheader>
                              <Label size="small" color="green" className="text-uppercase">{earlyBirdsCount} remaining</Label>
                            </Header.Subheader>
                          </Header>
                          <Header as="h5" className="intro-text">First {tier.earlyBirdQuantity} {tier.amount > 0 ? 'investors who invest $1,000 or more' : ''} will receive:</Header>
                        </Aux>
                        :
                        <Aux>
                          <Header as="h6">Invest</Header>
                          <Header as="h3" className="highlight-text">${tier.amount}+</Header>
                        </Aux>
                      }
                      <List as="ul" className="rewards">
                        {bonusRewards &&
                          bonusRewards.map(reward => (
                            (intersectionBy([tier], (reward && reward.tiers), (tier.earlyBirdQuantity > 0 ? 'earlyBirdQuantity' : 'amount')).length > 0) &&
                            <List.Item as="li">
                              <List.Header>{reward.title}</List.Header>
                              <List.Description>
                                <p className="detail-section">
                                  {Parser(reward.description || '')}
                                </p>
                              </List.Description>
                            </List.Item>
                          ))}
                      </List>
                    </Segment>
                  </Grid.Column>
                ))}
              </Grid> : <InlineLoader text="No bonus rewards are available." />
            }
            {offeringMISC &&
              <Grid stackable>
                <Grid.Column>
                  <Segment padded>
                    <Grid columns={isTablet || isTabletLand ? 2 : 4} className="vertical-gutter" stackable divided>
                      <Grid.Column>
                        <p className="detail-section">
                          {Parser(offeringMISC)}
                        </p>
                      </Grid.Column>
                    </Grid>
                  </Segment>
                </Grid.Column>
              </Grid>
            }
          </div>
          :
          <div className="updates-modal">
            <div className="no-updates">
              <InlineLoader text="No Bonus Rewards for this campaign." />
            </div>
          </div>
        }
      </div>
    );
  }
}

export default BonusRewards;
