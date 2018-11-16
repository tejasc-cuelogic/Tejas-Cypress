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
    this.props.history.push(`${this.props.refLink}`);
  }
  render() {
    const { formChange, CONFIRM_ACCREDITATION_FRM } = this.props.accreditationStore;
    const actionValue = this.props.match.params.action;
    return (
      <Modal open closeOnDimmerClick={false} closeIcon onClose={this.handleBack} size="mini">
        <Modal.Content>
          <Header textAlign="center" as="h3">Mark as {actionValue === 'approved' ? 'approved' : 'declined'}</Header>
          <Form>
            <FormTextarea
              containerclassname="secondary"
              fielddata={CONFIRM_ACCREDITATION_FRM.fields.justifyDescription}
              changed={(e, result) => formChange(e, result, 'CONFIRM_ACCREDITATION_FRM')}
            />
            <div className="center-align mt-30">
              <Button.Group>
                <Button className={actionValue === 'approved' ? 'primary' : 'red'} content={actionValue === 'approved' ? 'Approve request' : 'Decline request'} onClick={this.handleConfirm} />
              </Button.Group>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
