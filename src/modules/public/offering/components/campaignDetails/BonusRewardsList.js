import React from 'react';
import { List } from 'semantic-ui-react';
import Parser from 'html-react-parser';

const BonusRewardsList = ({ bonusRewards, tier, earlyBird }) => (
  <List as="ul" className="rewards">
    {bonusRewards &&
      bonusRewards.map(reward => (
        (reward.tiers.includes(tier) || (earlyBird && reward.earlyBirdQuantity > 0)) &&
        <List.Item as="li">
          <List.Header>{reward.title}</List.Header>
          <List.Description>
            <p className="detail-section">
              {Parser(reward.description || '')}
            </p>
          </List.Description>
        </List.Item>
      ))}
  </List>
);

export default BonusRewardsList;