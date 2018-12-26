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
        <Modal.Header className="signup-header">
          <Header textAlign="center" as="h3">Mark as {actionValue === 'APPROVED' ? 'approved' : 'declined'}</Header>
        </Modal.Header>
        <Modal.Content>
          <Form>
            <FormTextarea
              containerclassname="secondary"
              name="justifyDescription"
              fielddata={CONFIRM_ACCREDITATION_FRM.fields.justifyDescription}
              changed={(e, result) => formChange(e, result, 'CONFIRM_ACCREDITATION_FRM')}
            />
            <div className="center-align mt-30">
              <Button className={actionValue === 'APPROVED' ? 'primary relaxed' : 'red relaxed'} content={actionValue === 'APPROVED' ? 'Approve request' : 'Decline request'} loading={inProgress} disabled={!CONFIRM_ACCREDITATION_FRM.meta.isValid} onClick={this.handleConfirm} />
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
