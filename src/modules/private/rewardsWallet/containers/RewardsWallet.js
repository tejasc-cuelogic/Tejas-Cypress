import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Checkbox } from 'semantic-ui-react';
import PrivateLayout from '../../../../containers/common/PrivateHOC';
import RewardList from '../components/RewardList';

@inject('rewardStore')
@observer
export default class RewardsWallet extends Component {
  componentWillMount() {
    this.props.rewardStore.initRequest();
  }
  render() {
    const { rewards, loading, error } = this.props.rewardStore;
    return (
      <PrivateLayout {...this.props}>
        <Checkbox className="pull-right" label="Show active rewards only" />
        {loading ? 'loading..' : <RewardList match={this.props.match} rewards={rewards} error={error} />}
      </PrivateLayout>
    );
  }
}
