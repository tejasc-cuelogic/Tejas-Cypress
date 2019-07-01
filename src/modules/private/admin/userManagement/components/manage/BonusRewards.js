import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Checkbox } from 'semantic-ui-react';
import RewardList from '../../../../investor/rewardsWallet/components/RewardList';
import { InlineLoader } from '../../../../../../theme/shared';

@inject('rewardStore')
@observer
export default class BonusRewards extends Component {
  componentWillMount() {
    this.props.rewardStore.initRequest();
  }

  activeOnly = () => this.props.rewardStore.activeOnly();

  render() {
    const {
      rewards, loading, error, option,
    } = this.props.rewardStore;
    return (
      <>
        <Checkbox
          defaultChecked={option}
          onClick={this.activeOnly}
          className="pull-right"
          label="Show active rewards only"
        />
        {loading ? <InlineLoader />
          : <RewardList match={this.props.match} rewards={rewards} error={error} admin />
        }
      </>
    );
  }
}
