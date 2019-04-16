import React, { Component } from 'react';
import Aux from 'react-aux';
import moment from 'moment';
import { inject, observer } from 'mobx-react';
import { Header, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { InlineLoader } from '../../../../../../theme/shared';

@inject('offeringCreationStore')
@observer
export default class BonusRewardsList extends Component {
  render() {
    const { tier, refLink, isReadOnly } = this.props;
    const { allBonusRewards, allBonusRewardsLoading } = this.props.offeringCreationStore;
    const bonusRewards = allBonusRewards || [];
    if (allBonusRewardsLoading) {
      return <InlineLoader text="Loading Bonus Rewards List..." />;
    }
    return (
      <Aux>
        {
          bonusRewards &&
          bonusRewards.map((reward) => {
            if ((!this.props.isEarlyBird && reward.tiers.includes(tier)) ||
            (this.props.isEarlyBird && reward.earlyBirdQuantity > 0)) {
              return (
                <div className="reward-wrap">
                  {!isReadOnly &&
                    <Button size="mini" floated="right" inverted color="blue" content="Edit" as={Link} to={`${refLink}/edit-bonus-reward/${reward.id}/${tier}`} />
                  }
                  <Header as="h5">
                    {reward.title}
                    {reward.expirationDate && <small className="note">  - Exp Date: {moment(reward.expirationDate).format('MMM D, YYYY')}</small>}
                  </Header>
                  {reward.description && <p>{reward.description}</p>}
                </div>
              );
            }
            return null;
          })
        }
      </Aux>
    );
  }
}
