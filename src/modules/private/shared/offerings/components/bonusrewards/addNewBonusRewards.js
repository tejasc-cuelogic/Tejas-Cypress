import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Form, Button } from 'semantic-ui-react';
import moment from 'moment';
import { FormInput, FormCheckbox, FormDatePicker } from '../../../../../../theme/form';

@inject('offeringCreationStore')
@observer
export default class AddNewBonusReward extends Component {
  handleCloseModal = () => {
    this.props.history.push(this.props.refLink);
  }
  render() {
    const {
      ADD_NEW_BONUS_REWARD_FRM,
      formChange,
      verifyExpDate,
    } = this.props.offeringCreationStore;
    const formName = 'ADD_NEW_BONUS_REWARD_FRM';
    return (
      <Modal open closeIcon onClose={this.handleCloseModal} size="mini" closeOnDimmerClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Add new bonus reward</Header>
        </Modal.Header>
        {
          <Modal.Content className="signup-content">
            <Form>
              <div className="featured-section">
                <FormCheckbox
                  fielddata={ADD_NEW_BONUS_REWARD_FRM.fields.isEarlyBirds}
                  name="isEarlyBirds"
                  changed={(e, result) => formChange(e, result, formName)}
                  defaults
                  containerclassname="ui relaxed list"
                />
                {
                  ['name', 'description'].map(field => (
                    <FormInput
                      key={field}
                      name={field}
                      fielddata={ADD_NEW_BONUS_REWARD_FRM.fields[field]}
                      changed={(e, result) => formChange(e, result, formName)}
                    />))
                }
                <FormDatePicker
                  type="text"
                  name="Expiration Date"
                  placeholder="3/4/2018"
                  maxDate={moment()}
                  fielddata={ADD_NEW_BONUS_REWARD_FRM.fields.expirationDate}
                  selected={ADD_NEW_BONUS_REWARD_FRM.fields.expirationDate.value}
                  changed={verifyExpDate}
                />
              </div>
            </Form>
            <Button primary content="Add new bonus reward" />
          </Modal.Content>
        }
      </Modal>
    );
  }
}
