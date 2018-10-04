import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { intersectionBy } from 'lodash';
import { Header, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

@inject('offeringCreationStore')
@observer
export default class BonusRewardsList extends Component {
  render() {
    const { tier, bonusRewards, refLink } = this.props;
    return (
      <div>
        {
        bonusRewards.data.getBonusRewards.map((reward) => {
          if (intersectionBy([tier], (reward && reward.tiers), 'amount').length > 0) {
            return (
              <div className="reward-wrap">
                <Header as="h5">{reward.title}</Header>
                <p>{reward.description}</p>
                <p>Exp Date: {reward.expDate}</p>
                <Button.Group size="mini" className="compact">
                  <Button inverted color="blue" content="Edit" as={Link} to={`${refLink}/edit-new-bonus-reward`} />
                  <Button color="red" content="Delete" />
                </Button.Group>
              </div>
            );
          }
          return null;
        })
      }
      </div>
    );
  }
}
