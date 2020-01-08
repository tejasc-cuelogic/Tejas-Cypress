import React, { Component } from 'react';
import { Checkbox } from 'semantic-ui-react';
import moment from 'moment';
import RewardList from '../../../../investor/rewardsWallet/components/RewardList';
import { USER_REWARDS_META } from '../../../../../../services/constants/offering';

export default class BonusRewards extends Component {
  constructor(props) {
    super(props);
    this.state = { rewards: USER_REWARDS_META,
      showActive: false };
  }

    activeOnly = () => this.setState({ showActive: !this.state.showActive });

    render() {
      const { showActive, rewards } = this.state;
      const filteredRewards = showActive ? rewards.map((o) => {
        const filtered = JSON.parse(JSON.stringify(o));
        filtered.rewards = o.rewards.filter(r => !r.redeemDate && moment().diff(r.expiry) < 0);
        return filtered;
      }) : this.state.rewards;
      return (
      <>
        <Checkbox
          checked={showActive}
          onClick={this.activeOnly}
          className="pull-right"
          label="Show active rewards only"
        />
         <RewardList match={this.props.match} rewards={filteredRewards} admin />
      </>
      );
    }
}
