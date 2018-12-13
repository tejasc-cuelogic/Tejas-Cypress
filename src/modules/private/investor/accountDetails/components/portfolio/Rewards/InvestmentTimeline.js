import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import Parser from 'html-react-parser';
import { intersectionBy, orderBy, findLastIndex, filter, toInteger, sortedIndexBy } from 'lodash';
import { Grid, Popup, Header } from 'semantic-ui-react';
import Helper from '../../../../../../../helper/utility';
import { InlineLoader } from '../../../../../../../theme/shared';

const calcSmartProgress = (milestones, amount) => {
  const pIndex = findLastIndex(milestones, m => toInteger(m.amount) < toInteger(amount)) > 0 ?
    findLastIndex(milestones, m => toInteger(m.amount) < toInteger(amount)) : 0;
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
    const totalRaisedAmount =
      getInvestor && getInvestor.totalRaisedAmount ? getInvestor.totalRaisedAmount : 0;
    if (totalRaisedAmount < rewardsTiers[0].amount) {
      rewardsTiers.splice(sortedIndexBy(
        rewardsTiers,
        { amount: totalRaisedAmount },
      ), 0, { amount: totalRaisedAmount, earlyBirdQuantity: 0 });
    }
    const bonusRewards = campaign && campaign.bonusRewards &&
      campaign.bonusRewards.length && campaign.bonusRewards;
    const investBoanusReward = filter(rewardsTiers, tier => tier.earlyBirdQuantity <= 0);
    // const investBoanusRewardLastIndex = findLastIndex(investBoanusReward);
    // const earlyBirdtBoanusAmount = filter(rewardsTiers, tier => tier.earlyBirdQuantity > 0);
    const progress =
      investBoanusReward.length ? calcSmartProgress(investBoanusReward, totalRaisedAmount) : 0;
    const calculatedMargin = calMargin(investBoanusReward);
    return (
      rewardsTiers && rewardsTiers.length ?
        <Aux>
          <Header as="h4">{this.props.title}</Header>
          <Grid columns="equal" textAlign="center" className="investment-scale">
            <div className="invested" style={{ margin: `0 ${calculatedMargin}%` }}>
              <span className="investment-progress" style={{ width: `${progress}%` }} />
              <div className="amount" style={{ left: `${progress}%` }}>Your investment <span>{Helper.CurrencyFormat(totalRaisedAmount)}</span></div>
            </div>
            <Grid.Row>
              {rewardsTiers.map((tier, index) => (
                tier.earlyBirdQuantity <= 0 ?
                  <Grid.Column
                    className={`${((rewardsTiers[index + 1] && rewardsTiers[index].amount <= totalRaisedAmount && rewardsTiers[index + 1].amount >= totalRaisedAmount) || rewardsTiers[index].amount === toInteger(totalRaisedAmount)) ? 'crossed' : ''}`}
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
                            <p className="detail-section">
                              {Parser(reward.description)}
                            </p>
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
