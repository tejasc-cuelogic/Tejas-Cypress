/* eslint-disable */
import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import { Route } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { get, includes } from 'lodash';
import InvestmentTimeline from './Rewards/InvestmentTimeline';
import RewardList from './Rewards/RewardList';
import Redeem from '../../../rewardsWallet/components/Redeem';
import { InlineLoader } from '../../../../../../theme/shared';

@inject('campaignStore', 'portfolioStore', 'investmentStore', 'uiStore', 'userDetailsStore')
@observer
class BonusRewards extends Component {
  componentWillMount(){
    const { isAdmin } = this.props;
    const accountDetails = this.props.userDetailsStore.currentActiveAccountDetailsOfSelectedUsers;
    const accountType = isAdmin && get(accountDetails, 'name') ? get(accountDetails, 'name') : includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity';
    this.props.campaignStore.isEarlyBirdExist(accountType, isAdmin);
  }
  render() {
    const { props } = this;
    const { getEarlyBirdCheck, earlyBirdRewards, earlyBirdLoading } = props.campaignStore;
    // const { inProgress } = this.props.uiStore;
    const { getInvestor } = props.portfolioStore;
    const { investmentBonusRewards } = props.investmentStore
    const investedAmount = get(getInvestor, 'myInvestment') ? get(getInvestor, 'myInvestment') : 0;
    const rewardList = investmentBonusRewards(investedAmount ? parseFloat(investedAmount.replace(/,/g, '')) : 0);
    const metaTitle = 'Check the Updates tab for the latest information on when rewards will be delivered.  Unless otherwise indicated, rewards will be available after the business is open.';
    return (
      <div className="inner-content-spacer">
        <InvestmentTimeline title="Your investment" {...props} />
        {rewardList.length > 0 &&
        <>
        <Header as="h4">Your rewards</Header>
        <p className="neutral-text mb-30">{metaTitle}</p>
          {getEarlyBirdCheck ?
            <RewardList earlyBird title="Your investment" match={props.match} list={earlyBirdRewards} />
            : earlyBirdLoading ? <InlineLoader /> : ''
          }
        <RewardList title="Your investment" match={props.match} list={rewardList} />
        </>
        }
        <Route exact path={`${props.match.url}/redeem/:id`} component={Redeem} />
      </div>
    );
  }
}

export default BonusRewards;
