import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Button, Form } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { FormTextarea } from '../../../../../theme/form';

@inject('accreditationStore', 'uiStore')
@withRouter
@observer
export default class ConfirmModel extends Component {
  componentWillMount() {
    this.props.accreditationStore.resetModalForm();
  }
  handleBack = () => {
    this.props.history.push(`${this.props.refLink}`);
  }
  handleConfirm = () => {
    const {
      action, accountId, userId, accountType,
    } = this.props.match.params;
    this.props.accreditationStore
      .updateAccreditationAction(action, accountId, userId, accountType).then(() => {
        this.props.uiStore.setProgress(false);
        this.props.history.push(`${this.props.refLink}`);
      });
  }
  render() {
    const { formChange, CONFIRM_ACCREDITATION_FRM } = this.props.accreditationStore;
    const actionValue = this.props.match.params.action;
    const { inProgress } = this.props.uiStore;
    return (
      <Modal open closeOnDimmerClick={false} closeIcon onClose={this.handleBack} size="mini">
        <Modal.Content>
          <Header textAlign="center" as="h3">Mark as {actionValue === 'APPROVED' ? 'approved' : 'declined'}</Header>
          <Form>
            <FormTextarea
              containerclassname="secondary"
              name="justifyDescription"
              fielddata={CONFIRM_ACCREDITATION_FRM.fields.justifyDescription}
              changed={(e, result) => formChange(e, result, 'CONFIRM_ACCREDITATION_FRM')}
            />
            <div className="center-align mt-30">
              <Button.Group>
                <Button loading={inProgress} disabled={!CONFIRM_ACCREDITATION_FRM.meta.isValid} className={actionValue === 'APPROVED' ? 'primary' : 'red'} content={actionValue === 'APPROVED' ? 'Approve request' : 'Decline request'} onClick={this.handleConfirm} />
              </Button.Group>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
