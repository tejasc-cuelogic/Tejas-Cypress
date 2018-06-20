import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Checkbox } from 'semantic-ui-react';
import PrivateLayout from '../../../../containers/common/PrivateHOC';
import RewardList from '../components/RewardList';

@inject('rewardStore', 'userDetailsStore')
@observer
export default class RewardsWallet extends Component {
  componentWillMount() {
    this.props.rewardStore.initRequest();
  }
  activeOnly = () => this.props.rewardStore.activeOnly();
  render() {
    const {
      rewards, loading, error, option,
    } = this.props.rewardStore;
    return (
      <PrivateLayout {...this.props}>
        <Checkbox defaultChecked={option} onClick={this.activeOnly} className="pull-right" label="Show active rewards only" />
        {loading ? 'loading..' : <RewardList match={this.props.match} rewards={rewards} error={error} />}
      </PrivateLayout>
    );
  }
}
