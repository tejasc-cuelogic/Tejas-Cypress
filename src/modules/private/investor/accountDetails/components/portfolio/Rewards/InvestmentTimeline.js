import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { intersectionBy, orderBy, findLastIndex, filter, toInteger } from 'lodash';
import { Grid, Popup, Header } from 'semantic-ui-react';
import Helper from '../../../../../../../helper/utility';
<<<<<<< HEAD
import { InlineLoader } from '../../../../../../../theme/shared';
=======

const data = {
  invested: 10000,
  milestones: [
    {
      amount: 7689,
      reward: {
        head: 'Invest $7689 or more',
        subHead: 'Cooking Class',
        highlights: ['$50 Gift Card', 'Invitation for 2 to the Launch Party'],
      },
    },
    {
      amount: 25000,
      reward: {
        head: 'Invest $25000 or more',
        subHead: 'Cooking Class',
        highlights: ['$50 Gift Card', 'Invitation for 2 to the Launch Party'],
      },
    },
  ],
};
>>>>>>> origin/522-transactions-investnow-changeinvestment-api-integration

const calcSmartProgress = (milestones, amount) => {
  const pIndex = findLastIndex(milestones, m => toInteger(m.amount) < toInteger(amount));
  return ((pIndex / (milestones.length - 1)) * 100) +
    (((amount - milestones[pIndex].amount) /
      (milestones[pIndex + 1].amount - milestones[pIndex].amount)) *
      (100 / (milestones.length - 1)));
};

const calMargin = milestones => 50 / milestones.length;

@inject('portfolioStore', 'campaignStore')
@observer
class InvestmentTimeline extends Component {
  render() {
    const { campaign } = this.props.campaignStore;
    const { getInvestor } = this.props.portfolioStore;
    const rewardsTiers = campaign && campaign.rewardsTierIds &&
      campaign.rewardsTierIds.length && orderBy(campaign.rewardsTierIds, ['earlyBirdQuantity', 'amount'], ['desc', 'asc']);
    const bonusRewards = campaign && campaign.bonusRewards &&
      campaign.bonusRewards.length && campaign.bonusRewards;
    const investBoanusReward = filter(rewardsTiers, tier => tier.earlyBirdQuantity <= 0);
    // const investBoanusRewardLastIndex = findLastIndex(investBoanusReward);
    // const earlyBirdtBoanusAmount = filter(rewardsTiers, tier => tier.earlyBirdQuantity > 0);
    const progress = investBoanusReward.length ? calcSmartProgress(investBoanusReward, getInvestor
      && getInvestor.totalRaisedAmount) : 0;
    const calculatedMargin = calMargin(investBoanusReward);
    return (
      rewardsTiers && rewardsTiers.length ?
        <Aux>
          <Header as="h4">{this.props.title}</Header>
          <Grid columns="equal" textAlign="center" className="investment-scale">
            <div className="invested" style={{ margin: `0 ${calculatedMargin}%` }}>
              <span className="investment-progress" style={{ width: `${progress}%` }} />
              <div className="amount" style={{ left: `${progress}%` }}>Your investment <span>{Helper.CurrencyFormat(getInvestor && getInvestor.totalRaisedAmount)}</span></div>
            </div>
            <Grid.Row>
              {rewardsTiers.map((tier, index) => (
                tier.earlyBirdQuantity <= 0 ?
                  <Grid.Column
                    className={`${((rewardsTiers[index + 1] && rewardsTiers[index].amount <= getInvestor.totalRaisedAmount && rewardsTiers[index + 1].amount >= getInvestor.totalRaisedAmount) || rewardsTiers[index].amount === toInteger(getInvestor.totalRaisedAmount)) ? 'crossed' : ''}`}
                    key={`m_${tier.amount}`}
                  >
                    <Popup
                      trigger={<span>{Helper.CurrencyFormat(tier.amount)}</span>}
                      position="bottom center"
                      className="reward-info"
                      wide
                    >
                      {bonusRewards &&
                        bonusRewards.map(reward => (
                          (intersectionBy([tier], (reward && reward.tiers), (tier.earlyBirdQuantity > 0 ? 'earlyBirdQuantity' : 'amount')).length > 0) &&
                          <Popup.Content>
                            <Header as="h4" className="mb-half">
                              {reward.title}
                              {/* <Header.Subheader>{reward.title}</Header.Subheader> */}
                            </Header>
                            <p className="detail-section" dangerouslySetInnerHTML={{ __html: reward.description }} />
                          </Popup.Content>
                        ))
                      }
                    </Popup>
                  </Grid.Column>
                  :
                  ''
              ))}
            </Grid.Row>
          </Grid>
        </Aux>
        :
        <InlineLoader text="Data not found." />
    );
  }
}

export default InvestmentTimeline;
