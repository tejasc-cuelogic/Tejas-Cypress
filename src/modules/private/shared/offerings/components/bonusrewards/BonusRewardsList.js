import React, { Component } from 'react';
import moment from 'moment';
import { inject, observer } from 'mobx-react';
import { intersectionBy } from 'lodash';
import { Header, Button, Confirm } from 'semantic-ui-react';
import { Link, Route } from 'react-router-dom';
import UpdateBonusReward from './UpdateBonusReward';
import { InlineLoader } from '../../../../../../theme/shared';

@inject('offeringCreationStore', 'uiStore')
@observer
export default class BonusRewardsList extends Component {
  handleDelCancel = () => {
    this.props.uiStore.setConfirmBox('');
  }
  confirmRemoveBonusReward = (e, name, id) => {
    e.preventDefault();
    this.props.uiStore.setConfirmBox(name, id);
  }
  deleteBonusReward = () => {
    const { setConfirmBox, confirmBox } = this.props.uiStore;
    this.props.offeringCreationStore.deleteBonusReward(confirmBox.refId);
    setConfirmBox('');
  }
  render() {
    const { tier, refLink } = this.props;
    const { allBonusRewards } = this.props.offeringCreationStore;
    const { confirmBox } = this.props.uiStore;
    const bonusRewards = allBonusRewards.data.getBonusRewards;
    if (allBonusRewards.loading) {
      return <InlineLoader text="Loading Bonus Rewards List..." />;
    }
    return (
      <div>
        <Route path={`${refLink}/edit-bonus-reward/:rewardId`} render={props => <UpdateBonusReward refLink={refLink} {...props} {...this.props} />} />
        {
          bonusRewards &&
          bonusRewards.map((reward) => {
            if (intersectionBy([tier], (reward && reward.tiers), 'amount').length > 0) {
              return (
                <div className="reward-wrap">
                  <Header as="h5">{reward.title}</Header>
                  <p>{reward.description}</p>
                  <p>Exp Date: {moment(reward.expirationDate).format('MMM D, YYYY')}</p>
                  <Button.Group size="mini" className="compact">
                    <Button inverted color="blue" content="Edit" as={Link} to={`${refLink}/edit-bonus-reward/${reward.id}`} />
                    <Button color="red" content="Delete" onClick={e => this.confirmRemoveBonusReward(e, 'bonusRewards', reward.id)} />
                  </Button.Group>
                </div>
              );
            }
            return null;
          })
        }
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this Bonus Reward?"
          open={confirmBox.entity === 'bonusRewards'}
          onCancel={this.handleDelCancel}
          onConfirm={this.deleteBonusReward}
          size="mini"
          className="deletion"
        />
      </div>
    );
  }
}
