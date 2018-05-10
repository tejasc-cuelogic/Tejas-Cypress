import React from 'react';
import { Header } from 'semantic-ui-react';
import InvestmentTimeline from './Rewards/InvestmentTimeline';
import RewardList from './Rewards/RewardList';

const list = [
  {
    title: '$50 Gift Card', description: 'Lorem ipsum dolor. Etiam ullamcorper.', action: 'redeem',
  },
  {
    title: 'Invitation to the Launch Party', description: 'Lorem ipsum dolor sit amet enim.',
  },
  {
    title: 'Cooking Classes', description: 'Etiam ullamcorper.', action: 'voucher', expiry: '02-12-2019',
  },
];

const BonusRewards = () => (
  <div className="inner-content-spacer">
    <InvestmentTimeline title="Your investment" />
    <Header as="h3">Your rewards</Header>
    <RewardList title="Your investment" list={list} />
  </div>
);

export default BonusRewards;
