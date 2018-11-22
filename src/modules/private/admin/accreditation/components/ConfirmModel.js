import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Button, Form } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { FormTextarea } from '../../../../../theme/form';

@inject('accreditationStore')
@withRouter
@observer
export default class ConfirmModel extends Component {
  handleBack = () => {
    this.props.history.push(`${this.props.refLink}`);
  }
  handleConfirm = () => {
    const {
      action, accountId, userId, accountType,
    } = this.props.match.params;
    this.props.accreditationStore
      .accreditationAction(action, accountId, userId, accountType).then(() => {
        this.props.history.push(`${this.props.refLink}`);
      });
  }
  render() {
    const { formChange, CONFIRM_ACCREDITATION_FRM } = this.props.accreditationStore;
    const actionValue = this.props.match.params.action;
    return (
      <Modal open closeOnDimmerClick={false} closeIcon onClose={this.handleBack} size="mini">
        <Modal.Content>
          <Header textAlign="center" as="h3">Mark as {actionValue === 'APPROVE' ? 'approved' : 'declined'}</Header>
          <Form>
            <FormTextarea
              containerclassname="secondary"
              name="justifyDescription"
              fielddata={CONFIRM_ACCREDITATION_FRM.fields.justifyDescription}
              changed={(e, result) => formChange(e, result, 'CONFIRM_ACCREDITATION_FRM')}
            />
            <div className="center-align mt-30">
              <Button.Group>
                <Button disabled={!CONFIRM_ACCREDITATION_FRM.meta.isValid} className={actionValue === 'APPROVE' ? 'primary' : 'red'} content={actionValue === 'APPROVE' ? 'Approve request' : 'Decline request'} onClick={this.handleConfirm} />
              </Button.Group>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
