import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { get, orderBy } from 'lodash';
import { Header, Grid, Segment, Label } from 'semantic-ui-react';
import { InlineLoader } from '../../../../../theme/shared';
import BonusRewardsList from './BonusRewardsList';
import Helper from '../../../../../helper/utility';
import HtmlEditor from '../../../../shared/HtmlEditor';

const isMobile = document.documentElement.clientWidth < 992;
const isTablet = document.documentElement.clientWidth >= 768
  && document.documentElement.clientWidth < 992;
const isTabletLand = document.documentElement.clientWidth >= 992
  && document.documentElement.clientWidth < 1200;
@inject('campaignStore')
@observer
class BonusRewards extends Component {
  componentDidMount() {
    if (!this.props.newLayout && !isMobile) {
      const sel = 'anchor';
      document.querySelector(`.${sel}`).scrollIntoView(true);
    }
  }

  render() {
    const { campaign } = this.props.campaignStore;
    let rewardsTiers = get(campaign, 'rewardsTiers') || [];
    const earlyBird = get(campaign, 'earlyBird') || null;
    const bonusRewards = orderBy(get(campaign, 'bonusRewards'), 'created.date', 'asc') || [];
    rewardsTiers = rewardsTiers.filter(r => bonusRewards.filter(b => b.tiers.includes(r)).length);
    const isEarlyBirdRewards = bonusRewards.filter(b => b.earlyBirdQuantity > 0).length;
    // const earlyBirdsCount = get(campaign, 'earlyBirdsCount') || 0;
    const offeringMISC = campaign && campaign.offering && campaign.offering.misc
      && campaign.offering.misc.additionalBonusRewardsContent
      ? campaign.offering.misc.additionalBonusRewardsContent : null;
    return (
      <div className={this.props.newLayout ? '' : 'campaign-content-wrapper'}>
        <Header as="h3" className={`${this.props.newLayout ? 'mt-50 mb-50' : 'mt-20 mb-30'} anchor-wrap`}>
          <span className="anchor" id={this.props.newLayout ? 'bonus-rewards' : ''} />
          Bonus Rewards
        </Header>
        {((rewardsTiers && rewardsTiers.length) || (earlyBird && earlyBird.quantity > 0))
          ? (
<>
            {((rewardsTiers && rewardsTiers.length) || (earlyBird && earlyBird.quantity > 0))
            && bonusRewards
              ? (
<Grid stackable doubling columns={isTablet ? 1 : isTabletLand ? 2 : 2}>
                {(earlyBird && earlyBird.quantity && isEarlyBirdRewards)
                  ? (
<Grid.Column>
                    <Segment padded className="reward-block">
                      <>
                        <Header textAlign="left" as="h6" className={`${isMobile ? 'mb-20' : 'mb-40'} text-uppercase`}>Early Bird Reward
                          <Label size="small" color="green" className="text-uppercase pull-right">{get(earlyBird, 'available') || 0} remaining</Label>
                        </Header>
                        <Header as="h5" className="note">First {earlyBird.quantity} {earlyBird.amount > 0 ? `investors who invest ${Helper.CurrencyFormat(earlyBird.amount, 0)} or more` : ''} will receive:</Header>
                      </>
                      <BonusRewardsList
                        earlyBird
                        bonusRewards={bonusRewards}
                        tier={earlyBird.amount}
                      />
                    </Segment>
                  </Grid.Column>
                  ) : ''
                }
                {rewardsTiers.map(tier => (
                  <Grid.Column>
                    <Segment padded className="reward-block">
                      <>
                        <Header as="h6" className={`${isMobile && 'mb-0'} text-uppercase`}>Invest</Header>
                        <Header as="h3" className="highlight-text">{`${Helper.CurrencyFormat(tier, 0)}+`}</Header>
                      </>
                      <BonusRewardsList bonusRewards={bonusRewards} tier={tier} />
                    </Segment>
                  </Grid.Column>
                ))}
              </Grid>
              ) : <InlineLoader text="No bonus rewards are available." className="bg-offwhite" />
            }
            {offeringMISC
            && (
<Grid columns="1">
              <Grid.Column>
                <Segment padded className="reward-block">
                  <HtmlEditor readOnly content={offeringMISC} />
                </Segment>
              </Grid.Column>
            </Grid>
            )
            }
            </>
          )
          : <InlineLoader text="No Bonus Rewards" className="bg-offwhite" />
        }
      </div>
    );
  }
}

export default BonusRewards;
