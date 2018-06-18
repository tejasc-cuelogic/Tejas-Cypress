import React from 'react';
import { Header } from 'semantic-ui-react';
import { Route } from 'react-router-dom';
import InvestmentTimeline from './Rewards/InvestmentTimeline';
import RewardList from './Rewards/RewardList';
import Redeem from '../../../rewardsWallet/components/Redeem';

const list = [
  {
    id: 1, title: '$50 Gift Card', description: 'Lorem ipsum dolor. Etiam ullamcorper.', action: 'redeem',
  },
  {
    id: 2, title: 'Invitation to the Launch Party', description: 'Lorem ipsum dolor sit amet enim.', action: 'redeem',
  },
  {
    id: 3, title: 'Cooking Classes', description: 'Etiam ullamcorper.', action: 'voucher', expiry: '02-12-2019',
  },
];

const BonusRewards = ({ match }) => (
  <div className="inner-content-spacer">
    <InvestmentTimeline title="Your investment" />
    <Header as="h3">Your rewards</Header>
    <RewardList title="Your investment" match={match} list={list} />
    <Route exact path={`${match.url}/redeem/:id`} component={Redeem} />
  </div>
);

export default BonusRewards;
