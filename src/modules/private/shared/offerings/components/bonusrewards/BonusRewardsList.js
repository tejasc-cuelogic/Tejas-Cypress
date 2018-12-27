import React, { Component } from 'react';
import Aux from 'react-aux';
import moment from 'moment';
import { get } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Header, Button, Confirm } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { InlineLoader } from '../../../../../../theme/shared';

@inject('offeringCreationStore', 'uiStore', 'offeringsStore')
@observer
export default class BonusRewardsList extends Component {
  handleDelCancel = () => {
    this.props.uiStore.setConfirmBox('');
  }
  confirmRemoveBonusReward = (e, name, id, tier) => {
    e.preventDefault();
    this.props.uiStore.setConfirmBox(name, id);
    this.props.offeringCreationStore.setTierToBeUnlinked(tier);
  }
  deleteBonusReward = () => {
    const { setConfirmBox, confirmBox } = this.props.uiStore;
    this.props.offeringCreationStore.deleteBonusReward(confirmBox.refId);
    setConfirmBox('');
  }
  render() {
    const { tier, refLink, isReadOnly } = this.props;
    const { confirmBox } = this.props.uiStore;
    const { offer, offerLoading } = this.props.offeringsStore;
    const bonusRewards = get(offer, 'bonusRewards') || [];
    if (offerLoading) {
      return <InlineLoader text="Loading Bonus Rewards List..." />;
    }
    return (
      <Aux>
        {
          bonusRewards &&
          bonusRewards.map((reward) => {
            if (reward.tiers.includes(tier) ||
            (this.props.isEarlyBird && reward.earlyBirdQuantity > 0)) {
              return (
                <div className="reward-wrap">
                  <Header as="h5">{reward.title}</Header>
                  <p>{reward.description}</p>
                  <p>Exp Date: {moment(reward.expirationDate).format('MMM D, YYYY')}</p>
                  {!isReadOnly &&
                  <Button.Group size="mini" className="compact">
                    <Button inverted color="blue" content="Edit" as={Link} to={`${refLink}/edit-bonus-reward/${reward.id}`} />
                    <Button color="red" content="Delete" onClick={e => this.confirmRemoveBonusReward(e, 'bonusRewards', reward.id, tier)} />
                  </Button.Group>
                  }
                </div>
              );
            }
            return null;
          })
        }
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this Bonus Reward, this will remove from all tiers?"
          open={confirmBox.entity === 'bonusRewards'}
          onCancel={this.handleDelCancel}
          onConfirm={this.deleteBonusReward}
          size="mini"
          className="deletion"
        />
      </Aux>
    );
  }
}
