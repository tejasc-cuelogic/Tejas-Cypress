import React, { Component } from 'react';
import { Button, Header, Icon, Confirm } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import { Route, Link } from 'react-router-dom';
import AddNewTier from './AddNewTier';
import AddNewBonusReward from './addNewBonusRewards';
import BonusRewardsList from './BonusRewardsList';
import { InlineLoader } from '../../../../../../theme/shared';
import Helper from '../../../../../../helper/utility';
// import UpdateBonusReward from './UpdateBonusReward';

@inject('offeringCreationStore', 'uiStore', 'userStore', 'offeringsStore')
@observer
export default class Creation extends Component {
  componentWillMount() {
    const { getBonusRewards, setTiersForBonusRewardsForm } = this.props.offeringCreationStore;
    setTiersForBonusRewardsForm();
    getBonusRewards();
  }
  confirmRemoveTier = (e, name, amount, earlyBirdQuantity) => {
    e.preventDefault();
    this.props.uiStore.setConfirmBox(name, amount, earlyBirdQuantity);
  }
  handleDelCancel = () => {
    this.props.uiStore.setConfirmBox('');
  }
  deleteTier = () => {
    const { setConfirmBox, confirmBox } = this.props.uiStore;
    this.props.offeringCreationStore
      .updateBonusRewardTier(true, confirmBox.refId, confirmBox.subRefId);
    setConfirmBox('');
  }
  isDeleteTier = (tier, isEarlyBird = false) => {
    const { allBonusRewards } = this.props.offeringCreationStore;
    const rewardsCount = allBonusRewards.filter(b => (isEarlyBird ?
      b.earlyBirdQuantity > 0 : b.tiers.includes(tier)));
    return rewardsCount.length === 0;
  }
  render() {
    const { offer } = this.props.offeringsStore;
    const bonusRewardsTiers = get(offer, 'rewardsTiers') || [];
    const earlyBird = get(offer, 'earlyBird') || null;
    const stage = get(offer, 'stage') || '';
    const { allBonusRewardsLoading } = this.props.offeringCreationStore;
    const { confirmBox } = this.props.uiStore;
    const { match } = this.props;
    const { isIssuer } = this.props.userStore;
    const isReadOnly = isIssuer && stage !== 'CREATION';
    if (allBonusRewardsLoading) {
      return <InlineLoader />;
    }
    return (
      <div className={!isIssuer || (isIssuer && match.url.includes('offering-creation')) ? 'inner-content-spacer' : 'ui card fluid form-card'}>
        <Route path={`${match.url}/add-new-tier`} render={props => <AddNewTier refLink={match.url} {...props} />} />
        <Route path={`${match.url}/add-new-bonus-reward`} render={props => <AddNewBonusReward refLink={match.url} {...props} />} />
        <Route path={`${match.url}/edit-bonus-reward/:rewardId`} render={props => <AddNewBonusReward refLink={match.url} isEditForm {...props} />} />
        {!isReadOnly &&
        <div className="clearfix">
          <Button as={Link} to={`${match.url}/add-new-tier`} floated="right" primary content="Add new rewards tier" />
        </div>
        }
        {earlyBird && get(earlyBird, 'quantity') !== 0 &&
          <div className="reward-tier">
            <Header as="h4">
              {`Early bird - First ${get(earlyBird, 'quantity')} investments of ${Helper.CurrencyFormat(get(earlyBird, 'amount'))} or more`}
              {this.isDeleteTier(get(earlyBird, 'amount'), true) && !isReadOnly &&
              <Button color="red" size="small" floated="right" className="link-button" onClick={e => this.confirmRemoveTier(e, 'tier', get(earlyBird, 'amount'), get(earlyBird, 'quantity'))}>
                <Icon className="ns-trash" />
              </Button>
              }
            </Header>
            <BonusRewardsList isReadOnly={isReadOnly} refLink={match.url} isEarlyBird tier={get(earlyBird, 'amount')} />
            {!isReadOnly &&
            <Button
              size="small"
              color="blue"
              as={Link}
              to={`${match.url}/add-new-bonus-reward`}
              className="link-button"
            >+ Add bonus reward
            </Button>
            }
          </div>
        }
        {
          bonusRewardsTiers.map(tier => (
            <div className="reward-tier">
              <Header as="h4">
                {`Invest ${Helper.CurrencyFormat(tier)} or more`}
                {this.isDeleteTier(tier) && !isReadOnly &&
                <Button color="red" size="small" floated="right" className="link-button" onClick={e => this.confirmRemoveTier(e, 'tier', tier, 0)}>
                  <Icon className="ns-trash" />
                </Button>
                }
              </Header>
              <BonusRewardsList isReadOnly={isReadOnly} refLink={match.url} tier={tier} />
              {!isReadOnly &&
              <Button
                size="small"
                color="blue"
                as={Link}
                to={`${match.url}/add-new-bonus-reward`}
                className="link-button"
              >+ Add bonus reward
              </Button>
              }
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
