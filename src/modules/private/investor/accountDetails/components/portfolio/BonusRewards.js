/* eslint-disable */
import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import { Route } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { get } from 'lodash';
import InvestmentTimeline from './Rewards/InvestmentTimeline';
import RewardList from './Rewards/RewardList';
import Redeem from '../../../rewardsWallet/components/Redeem';

@inject('campaignStore', 'portfolioStore', 'investmentStore')
@observer
class BonusRewards extends Component {
  componentWillMount(){
    this.props.campaignStore.isEarlyBirdExist();
  }
  render() {
    const { props } = this;
    const { earlyBirdCheck, earlyBirdRewards } = props.campaignStore;
    const { getInvestor } = props.portfolioStore;
    const { investmentBonusRewards } = props.investmentStore
    const investedAmount = get(getInvestor, 'myInvestment') ? get(getInvestor, 'myInvestment') : 0;
    const rewardList = investmentBonusRewards(investedAmount ? parseFloat(investedAmount.replace(/,/, '')) : 0);
    const metaTitle = 'Check the Updates tab for the latest information on when rewards will be delivered.  Unless otherwise indicated, rewards will be available after the business is open.';
    return (
      <div className="inner-content-spacer">
        <InvestmentTimeline title="Your investment" {...props} />
        {rewardList.length > 0 &&
        <Aux>
        <Header as="h4">Your rewards</Header>
        <p className="neutral-text mb-30">{metaTitle}</p>
          {earlyBirdCheck && earlyBirdCheck.checkEarlyBirdByInvestorAccountAndOfferingId ?
            <RewardList earlyBird title="Your investment" match={props.match} list={earlyBirdRewards} />
            : ''
          }
        <RewardList title="Your investment" match={props.match} list={rewardList} />
        </Aux>
        }
        <Route exact path={`${props.match.url}/redeem/:id`} component={Redeem} />
      </div>
    );
  }
}

export default BonusRewards;
