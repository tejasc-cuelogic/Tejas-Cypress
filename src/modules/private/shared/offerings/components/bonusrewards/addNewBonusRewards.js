import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { map, get } from 'lodash';
import { Modal, Header, Form, Button, Confirm } from 'semantic-ui-react';
import { FormInput, FormCheckbox, MaskedInput } from '../../../../../../theme/form';

@inject('offeringCreationStore', 'offeringsStore', 'uiStore')
@observer
export default class AddNewBonusReward extends Component {
  componentWillMount() {
    const { isEditForm } = this.props;
    const { setUpdateBonusRewardsData, resetBonusRewardForm } = this.props.offeringCreationStore;
    if (isEditForm) {
      const { rewardId } = this.props.match.params;
      setUpdateBonusRewardsData(rewardId);
    } else {
      resetBonusRewardForm();
    }
  }
  handleCloseModal = () => {
    this.props.history.push(this.props.refLink);
  }
  handleDelCancel = () => {
    this.props.uiStore.setConfirmBox('');
  }
  confirmRemoveBonusReward = (e, name, id, tier) => {
    e.preventDefault();
    if (id && tier) {
      this.props.uiStore.setConfirmBox(name, id);
      this.props.offeringCreationStore.setTierToBeUnlinked(tier);
    }
  }
  deleteBonusReward = () => {
    const { setConfirmBox, confirmBox } = this.props.uiStore;
    this.props.offeringCreationStore.deleteBonusReward(confirmBox.refId).then(() => {
      this.props.history.push(this.props.refLink);
    });
    setConfirmBox('');
  }
  handleBonusReward = (earlyBirdQty, isEdit = false) => {
    if (!isEdit) {
      const { createUpdateBonusReward } = this.props.offeringCreationStore;
      createUpdateBonusReward(earlyBirdQty);
    } else {
      const { rewardId } = this.props.match.params;
      this.props.offeringCreationStore.createUpdateBonusReward(earlyBirdQty, rewardId);
    }
    this.props.history.push(this.props.refLink);
  }
  render() {
    const { isEditForm, isReadOnly, match } = this.props;
    const { rewardId, tier } = match.params;
    const { confirmBox } = this.props.uiStore;
    const {
      ADD_NEW_BONUS_REWARD_FRM,
      formChange,
      maskChange,
      bonusRewardTierChange,
      isCheckedAtLeastOneTiers,
    } = this.props.offeringCreationStore;
    const formName = 'ADD_NEW_BONUS_REWARD_FRM';
    const { offer } = this.props.offeringsStore;
    const earlyBird = get(offer, 'earlyBird') || null;
    return (
      <Modal open closeIcon size="small" onClose={this.handleCloseModal} closeOnDimmerClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">{isEditForm ? 'Edit bonus reward' : 'Add new bonus reward'}</Header>
        </Modal.Header>
        {
          <Modal.Content className="signup-content">
            <Form onSubmit={() => this.handleBonusReward(get(earlyBird, 'quantity'), isEditForm)}>
              {earlyBird &&
              <FormCheckbox
                fielddata={ADD_NEW_BONUS_REWARD_FRM.fields.isEarlyBirds}
                name="isEarlyBirds"
                changed={(e, result) => formChange(e, result, formName)}
                defaults
                containerclassname="ui relaxed list"
              />
              }
              {map(ADD_NEW_BONUS_REWARD_FRM.fields, ((field) => {
                if (!field.key) {
                  return null;
                }
                return (
                  <FormCheckbox
                    fielddata={field}
                    name={field.key}
                    changed={(e, result) => bonusRewardTierChange(e, field.seqNum, result)}
                    defaults
                    containerclassname="ui list rewards-tier"
                  />
                );
              }))}
              <div className="featured-section">
                {
                  ['name', 'description'].map(field => (
                    <FormInput
                      key={field}
                      name={field}
                      fielddata={ADD_NEW_BONUS_REWARD_FRM.fields[field]}
                      changed={(e, result) => formChange(e, result, formName)}
                    />))
                }
                <MaskedInput
                  name="expirationDate"
                  placeholder="3/4/2018"
                  fielddata={ADD_NEW_BONUS_REWARD_FRM.fields.expirationDate}
                  format="##/##/####"
                  changed={(values, field) => maskChange(values, 'ADD_NEW_BONUS_REWARD_FRM', field)}
                  dateOfBirth
                />
              </div>
              <div className="center-align">
                {!isReadOnly && isEditForm &&
                <Button color="red" content="Delete" onClick={e => this.confirmRemoveBonusReward(e, 'bonusRewards', rewardId, tier)} />
                }
                <Button primary content={isEditForm ? 'Update bonus reward' : 'Add new bonus reward'} disabled={!(ADD_NEW_BONUS_REWARD_FRM.meta.isValid && isCheckedAtLeastOneTiers)} />
              </div>
            </Form>
          </Modal.Content>
        }
        <Confirm
          header="Confirm"
          content="This bonus reward will be deleted from all tiers. Are you sure you want to delete it?"
          open={confirmBox.entity === 'bonusRewards'}
          onCancel={this.handleDelCancel}
          onConfirm={this.deleteBonusReward}
          size="mini"
          className="deletion"
        />
      </Modal>
    );
  }
}
