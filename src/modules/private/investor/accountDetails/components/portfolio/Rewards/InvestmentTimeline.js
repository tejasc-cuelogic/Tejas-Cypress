import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { findLastIndex, toInteger, get, uniqWith, isEqual } from 'lodash';
import { Grid, Popup, Header } from 'semantic-ui-react';
import Helper from '../../../../../../../helper/utility';
import { InlineLoader } from '../../../../../../../theme/shared';
import HtmlEditor from '../../../../../../shared/HtmlEditor';

const calcSmartProgress = (milestones, amount) => {
  const pIndex = findLastIndex(milestones, m => toInteger(m) < toInteger(amount)) > 0 ?
    findLastIndex(milestones, m => toInteger(m) < toInteger(amount)) : 0;
  return ((pIndex / (milestones.length - 1)) * 100) +
    (((toInteger(amount) - milestones[pIndex]) /
      (milestones[pIndex + 1] - milestones[pIndex])) *
      (100 / (milestones.length - 1)));
};

const calMargin = milestones => 50 / milestones.length;

@inject('portfolioStore', 'campaignStore')
@observer
class InvestmentTimeline extends Component {
  render() {
    const { campaign } = this.props.campaignStore;
    const { getInvestor } = this.props.portfolioStore;
    const minInvestAmt = get(campaign, 'keyTerms.minInvestAmt') || null;
    let rewardsTiers = get(campaign, 'rewardsTiers') || [];
    const myInvestment = get(getInvestor, 'myInvestment') ? parseFloat(get(getInvestor, 'myInvestment').replace(/,/, '')) : 0;
    const bonusRewards = get(campaign, 'bonusRewards') || [];
    const investBonusReward = rewardsTiers.filter(r =>
      bonusRewards.filter(b => b.tiers.includes(r)).length);
    if (parseFloat(myInvestment) < (investBonusReward.length && parseFloat(investBonusReward[0]))) {
      investBonusReward.splice(0, 0, minInvestAmt);
    }
    rewardsTiers = uniqWith(investBonusReward, isEqual).sort((a, b) => a - b);
    const progress =
      investBonusReward.length ? calcSmartProgress(rewardsTiers, myInvestment) : 0;
    const calculatedMargin = calMargin(rewardsTiers);
    return (
      rewardsTiers && rewardsTiers.length ?
        <Aux>
          <Header as="h4">{this.props.title}</Header>
          <Grid columns="equal" textAlign="center" className="investment-scale">
            <div className="invested" style={{ margin: `0 ${calculatedMargin}%` }}>
              <span className="investment-progress" style={{ width: `${progress}%` }} />
              <div className="amount" style={{ left: `${progress}%` }}>Your investment <span>{Helper.MoneyMathDisplayCurrency(myInvestment)}</span></div>
            </div>
            <Grid.Row>
              {rewardsTiers.map((tier, index) => (
                <Grid.Column
                  className={`${((rewardsTiers[index + 1] && toInteger(tier) <= toInteger(myInvestment) && rewardsTiers[index + 1] >= toInteger(myInvestment)) || toInteger(tier) === toInteger(myInvestment)) ? 'crossed' : ''}`}
                  key={`m_${tier}`}
                >
                  <Popup
                    trigger={<span>{Helper.CurrencyFormat(tier)}</span>}
                    position="bottom center"
                    className="reward-info"
                    wide
                  >
                    {bonusRewards &&
                      bonusRewards.map(reward => (
                        reward.tiers.includes(tier) &&
                        <Popup.Content>
                          <Header as="h4" className="mb-half">
                            {reward.title}
                          </Header>
                          <p className="detail-section">
                            <HtmlEditor
                              readOnly
                              content={(reward.description || '')}
                            />
                          </p>
                        </Popup.Content>
                      ))
                    }
                  </Popup>
                </Grid.Column>
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
