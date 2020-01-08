import React, { Component } from 'react';
import { map } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Form, Button } from 'semantic-ui-react';
import { FormInput, FormCheckbox, MaskedInput } from '../../../../../../theme/form';

@inject('offeringCreationStore')
@observer
export default class UpdateBonusReward extends Component {
  constructor(props) {
    super(props);
    const { rewardId } = this.props.match.params;
    const { bonusRewards } = this.props;
    const { setUpdateBonusRewardsData, setCurrentRewardId } = this.props.offeringCreationStore;
    if (bonusRewards) {
      setUpdateBonusRewardsData(bonusRewards.data.getBonusRewards, rewardId);
    }
    setCurrentRewardId(rewardId);
  }

  handleUpdateBonusReward = () => {
    const { rewardId } = this.props.match.params;
    this.props.offeringCreationStore.updateBonusReward(rewardId);
    this.props.history.push(this.props.refLink);
  }

  handleCloseModal = () => {
    this.props.offeringCreationStore.resetRewardId();
    this.props.history.push(this.props.refLink);
  }

  render() {
    const {
      ADD_NEW_BONUS_REWARD_FRM,
      formChange,
      maskChange,
      bonusRewardTierChange,
    } = this.props.offeringCreationStore;
    const formName = 'ADD_NEW_BONUS_REWARD_FRM';
    return (
      <Modal open closeIcon onClose={this.handleCloseModal} size="mini" closeOnDimmerClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Edit bonus reward</Header>
        </Modal.Header>
        {
          <Modal.Content className="signup-content">
            <Form onSubmit={this.handleUpdateBonusReward}>
              <div className="featured-section">
                <FormCheckbox
                  fielddata={ADD_NEW_BONUS_REWARD_FRM.fields.isEarlyBirds}
                  name="isEarlyBirds"
                  changed={(e, result) => formChange(e, result, formName)}
                  defaults
                  containerclassname="ui relaxed list"
                />
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
                {
                  ['name', 'description'].map(field => (
                    <FormInput
                      key={field}
                      name={field}
                      fielddata={ADD_NEW_BONUS_REWARD_FRM.fields[field]}
                      changed={(e, result) => formChange(e, result, formName)}
                    />
                  ))
                }
                <MaskedInput
                  name="expirationDate"
                  fielddata={ADD_NEW_BONUS_REWARD_FRM.fields.expirationDate}
                  format="##/##/####"
                  changed={(values, field) => maskChange(values, 'ADD_NEW_BONUS_REWARD_FRM', field)}
                  dateOfBirth
                />
              </div>
              <div className="center-align">
                <Button primary content="Update bonus reward" />
              </div>
            </Form>
          </Modal.Content>
        }
      </Modal>
    );
  }
}
