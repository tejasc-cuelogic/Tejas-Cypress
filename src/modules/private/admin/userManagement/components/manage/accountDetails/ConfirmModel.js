import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Button, Form } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { FormTextarea } from '../../../../../../../theme/form';

@inject('userDetailsStore', 'uiStore')
@withRouter
@observer
export default class ConfirmModel extends Component {
  componentWillMount() {
    this.props.userDetailsStore.resetModalForm();
  }
  handleBack = () => {
    this.props.history.push(`${this.props.refLink}`);
  }
  freezeAccountToggle = (userId, accountId, freeze) => {
    const { FRM_FREEZE } = this.props.userDetailsStore;
    this.props.userDetailsStore.freezeAccountToggle(
      userId,
      accountId,
      freeze !== 'unfreeze',
      FRM_FREEZE.fields.reason.value,
    );
    this.handleBack();
  }
  render() {
    const { formChange, FRM_FREEZE } = this.props.userDetailsStore;
    const actionValue = this.props.match.params.action;
    const { inProgress } = this.props.uiStore;
    const { userId, accountId } = this.props;
    return (
      <Modal open closeOnDimmerClick={false} closeIcon onClose={this.handleBack} size="mini">
        <Modal.Header className="signup-header">
          <Header textAlign="center" as="h3">Mark as {actionValue === 'unfreeze' ? 'Unfreeze' : 'Freeze'}</Header>
        </Modal.Header>
        <Modal.Content>
          <Form>
            <FormTextarea
              containerclassname="secondary"
              name="reason"
              fielddata={FRM_FREEZE.fields.reason}
              changed={(e, result) => formChange(e, result, 'FRM_FREEZE')}
            />
            <div className="center-align mt-30">
              <Button className="primary relaxed" content={actionValue === 'unfreeze' ? 'Unfreeze Account' : 'Freeze Account'} loading={inProgress} onClick={() => this.freezeAccountToggle(userId, accountId, actionValue)} />
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
