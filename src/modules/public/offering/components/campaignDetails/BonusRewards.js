import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { intersectionBy, orderBy } from 'lodash';
import { Header, Grid, Segment, Label, List, Image } from 'semantic-ui-react';
import noEarlyBird from '../../../../../assets/images/illustration.png';
import card1 from '../../../../../assets/images/cards/pour_cards_black.jpg';
import card2 from '../../../../../assets/images/cards/pour_cards_gold.jpg';
import card3 from '../../../../../assets/images/cards/pour_cards_plat.jpg';
import card4 from '../../../../../assets/images/cards/pour_cards_silver.jpg';
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
    return (
      <div className="campaign-content-wrapper">
        <Grid stackable>
          <Grid.Column>
            <Header as="h3">Bonus Rewards</Header>
          </Grid.Column>
        </Grid>
        <Grid stackable doubling columns={isTablet ? 1 : isTabletLand ? 2 : 3}>
          {rewardsTiers ?
            rewardsTiers.map(tier => (
              <Grid.Column>
                <Segment padded className="reward-block">
                  {tier.earlyBirdQuantity > 0 ?
                    <Aux>
                      <Header as="h6">Early Bird Reward
                        <Image src={noEarlyBird} floated="right" />
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
                            <p className="detail-section" dangerouslySetInnerHTML={{ __html: reward.description }} />
                          </List.Description>
                        </List.Item>
                      ))}
                  </List>
                </Segment>
              </Grid.Column>
            )) : <InlineLoader text="No bonus rewards are available." />
          }
        </Grid>
        <Grid stackable>
          <Grid.Column>
            <Segment padded>
              <Grid columns={isTablet || isTabletLand ? 2 : 4} className="vertical-gutter" stackable divided>
                <Grid.Column>
                  <Image src={card1} />
                  <Header as="h5">Black Card</Header>
                  <p>
                    One Premium bottle per year, VIP/Supercar Parking (with advanced notice), 25%
                    discount every visit and Skip the Line for you and up to 16 guests (Fridays and
                    Saturdays + Special Events)
                  </p>
                </Grid.Column>
                <Grid.Column>
                  <Image src={card3} />
                  <Header as="h5">Platinum Card</Header>
                  <p>
                    0% discount every visit and Skip the Line for you and up to 9 guests (Fridays
                    and Saturdays + Special Events)
                  </p>
                </Grid.Column>
                <Grid.Column>
                  <Image src={card2} />
                  <Header as="h5">Gold Card</Header>
                  <p>
                    15% discount every visit and Skip the Line for you and up to 9 guests (Fridays
                    and Saturdays + Special Events)
                  </p>
                </Grid.Column>
                <Grid.Column>
                  <Image src={card4} />
                  <Header as="h5">Silver Card</Header>
                  <p>10% discount every visit</p>
                </Grid.Column>
              </Grid>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default BonusRewards;
