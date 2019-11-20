import React, { Component } from 'react';
import { Checkbox } from 'semantic-ui-react';
import moment from 'moment';
import PrivateLayout from '../../../shared/PrivateLayout';
import RewardList from '../components/RewardList';

export default class RewardsWallet extends Component {
  constructor(props) {
    super(props);
    this.state = { rewards: [
      {
        id: 'cjicstk6f0gaf0136nxmoo85k',
        name: 'MuHu Hot Pot',
        rewards: [
          {
            id: 'cjict4vih0jhr0126yirl8eo3',
            name: '$50 Gift Card',
            description: '$50 Gift Card description',
            expiry: '2018-05-26T00:00:00.000Z',
            status: 'Available',
            redeemDate: null,
          },
          {
            id: 'cjictb8wv0lip0136nmtetgu2',
            name: 'VIP Access Card',
            description: 'VIP Access Card description',
            expiry: '2020-05-26T00:00:00.000Z',
            status: 'Available',
            redeemDate: null,
          },
        ],
      },
      {
        id: 'cjicsu0ps0f8b0100ra7pyg0x',
        name: 'The Brewers Table',
        rewards: [],
      },
    ],
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
      <PrivateLayout {...this.props}>
        <Checkbox checked={showActive} onClick={this.activeOnly} className="pull-right" label="Show active rewards only" />
        <RewardList match={this.props.match} rewards={filteredRewards} />
      </PrivateLayout>
    );
  }
}
