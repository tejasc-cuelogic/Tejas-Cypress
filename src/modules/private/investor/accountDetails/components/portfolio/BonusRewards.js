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
import SecondaryMenu from '../../../../../../theme/layout/SecondaryMenu';


@inject('campaignStore', 'portfolioStore', 'investmentStore', 'uiStore', 'userDetailsStore')
@observer
class BonusRewards extends Component {
  constructor(props) {
    super(props);
    const { isAdmin } = this.props;
    const accountDetails = this.props.userDetailsStore.currentActiveAccountDetailsOfSelectedUsers;
    const accountType = isAdmin && get(accountDetails, 'name') ? get(accountDetails, 'name') : includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity';
    this.props.campaignStore.isEarlyBirdExist(accountType, isAdmin);
  }
  render() {
    const { props } = this;
    const { getEarlyBirdCheck, earlyBirdRewards, earlyBirdLoading } = props.campaignStore;
    const { responsiveVars } = this.props.uiStore;
    const { getInvestor } = props.portfolioStore;
    const { investmentBonusRewards } = props.investmentStore
    const investedAmount = get(getInvestor, 'myInvestment') ? get(getInvestor, 'myInvestment') : 0;
    const rewardList = investmentBonusRewards(investedAmount ? parseFloat(investedAmount.replace(/,/g, '')) : 0);
    const metaTitle = 'Check the Updates tab for the latest information on when rewards will be delivered.  Unless otherwise indicated, rewards will be available after the business is open.';
    return (
      <>
      {responsiveVars.isMobile
      && <SecondaryMenu classname="no-shadow" isPortfolio isBonusReward bonusRewards refMatch={this.props.refMatch} navItems={this.props.MobileNavItems} />
      }
      <div className={`${responsiveVars.isMobile ? 'mob-reward-list' : ''} inner-content-spacer`}>
        {!responsiveVars.isMobile &&
        <InvestmentTimeline title="Your investment" {...props} />}
        {rewardList && rewardList.length > 0 &&
        <>
        <Header as={responsiveVars.isMobile ? 'h5' : 'h4'} className={responsiveVars.isMobile ? 'mb-half' : ''}>Your rewards</Header>
        <p className={`${responsiveVars.isMobile ? 'mb-20' : 'mb-30'} neutral-text`}>{metaTitle}</p>
          {getEarlyBirdCheck ?
            <RewardList cardClass={responsiveVars.isMobile && 'mob-reward-list'} classname={responsiveVars.isMobile && 'mt-0'} earlyBird title="Your investment" match={props.match} list={earlyBirdRewards} />
            : earlyBirdLoading ? <InlineLoader /> : ''
          }
        <RewardList cardClass={responsiveVars.isMobile && 'mob-reward-list'} title="Your investment" match={props.match} list={rewardList} />
        </>
        }
        <Route exact path={`${props.match.url}/redeem/:id`} component={Redeem} />
      </div>
      </>
    );
  }
}

export default BonusRewards;
