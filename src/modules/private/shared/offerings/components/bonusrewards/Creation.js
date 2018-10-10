import React, { Component } from 'react';
import { Button, Header, Icon, Confirm } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { Route, Link } from 'react-router-dom';
import AddNewTier from './AddNewTier';
import AddNewBonusReward from './addNewBonusRewards';
import BonusRewardsList from './BonusRewardsList';
import { InlineLoader } from '../../../../../../theme/shared';
import Helper from '../../../../../../helper/utility';

@inject('offeringCreationStore', 'uiStore', 'userStore')
@observer
export default class Creation extends Component {
  componentWillMount() {
    const { getBonusRewardsTiers, getBonusRewards } = this.props.offeringCreationStore;
    getBonusRewardsTiers();
    getBonusRewards();
  }
  confirmRemoveTier = (e, name, tier) => {
    e.preventDefault();
    this.props.uiStore.setConfirmBox(name, tier.amount, tier.earlyBirdQuantity);
  }
  handleDelCancel = () => {
    this.props.uiStore.setConfirmBox('');
  }
  deleteTier = () => {
    const { setConfirmBox, confirmBox } = this.props.uiStore;
    this.props.offeringCreationStore.deleteBonusRewardTier(confirmBox.refId, confirmBox.subRefId);
    setConfirmBox('');
  }
  render() {
    const {
      bonusRewards,
      bonusRewardsTiers,
    } = this.props.offeringCreationStore;
    const { confirmBox } = this.props.uiStore;
    const { match } = this.props;
    const { isIssuer } = this.props.userStore;
    if (bonusRewardsTiers.loading || bonusRewards.loading) {
      return <InlineLoader />;
    }
    return (
      <div className={!isIssuer || (isIssuer && match.url.includes('offering-creation')) ? 'inner-content-spacer' : 'ui card fluid form-card'}>
        <Route path={`${match.url}/add-new-tier`} render={props => <AddNewTier refLink={match.url} {...props} />} />
        <Route path={`${match.url}/add-new-bonus-reward`} render={props => <AddNewBonusReward refLink={match.url} {...props} />} />
        <Route path={`${match.url}/edit-new-bonus-reward`} render={props => <AddNewBonusReward refLink={match.url} {...props} />} />
        <div className="clearfix">
          <Button as={Link} to={`${match.url}/add-new-tier`} floated="right" primary content="Add new rewards tier" />
        </div>
        {
          bonusRewardsTiers.data.getBonusRewardTiers &&
          bonusRewardsTiers.data.getBonusRewardTiers.map(tier => (
            <div className="reward-tier">
              <Header as="h4">
                {tier.earlyBirdQuantity === 0 ? `Invest ${Helper.CurrencyFormat(tier.amount)} or more` : `Early Birds investing ${Helper.CurrencyFormat(tier.amount)} Or more... (#${tier.earlyBirdQuantity})`}
                <Button color="red" size="small" floated="right" className="link-button" onClick={e => this.confirmRemoveTier(e, 'tier', tier)}>
                  <Icon className="ns-trash" />
                </Button>
              </Header>
              <BonusRewardsList refLink={match.url} tier={tier} />
              <Button
                size="small"
                color="blue"
                as={Link}
                to={`${match.url}/add-new-bonus-reward`}
                className="link-button"
              >+ Add next bonus reward
              </Button>
            </div>
          ))
        }
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this tier?"
          open={confirmBox.entity === 'tier'}
          onCancel={this.handleDelCancel}
          onConfirm={this.deleteTier}
          size="mini"
          className="deletion"
        />
      </div>
    );
  }
}
