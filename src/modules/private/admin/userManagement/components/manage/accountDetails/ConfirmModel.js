import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Button, Form } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { FormTextarea } from '../../../../../../../theme/form';
@inject('userDetailsStore', 'uiStore', 'accountStore')
@withRouter
@observer
export default class ConfirmModel extends Component {
  componentWillMount() {
    this.props.userDetailsStore.resetModalForm();
  }

  handleBack = () => {
    this.props.history.push(`${this.props.refLink}`);
  }

  confirmForm = () => ({
    freeze: { headerTitle: 'Freeze',
      form: this.props.userDetailsStore.FRM_FREEZE,
      formKey: 'FRM_FREEZE',
      formChange: this.props.userDetailsStore.formChange },
    'close-account': { headerTitle: 'Closed',
      form: this.props.accountStore.CLOSE_ACCOUNT_FRM,
      formKey: 'CLOSE_ACCOUNT_FRM',
      formChange: this.props.userDetailsStore.formChange },
    unfreeze: { headerTitle: 'Unfreeze',
      form: this.props.userDetailsStore.FRM_FREEZE,
      formKey: 'FRM_FREEZE',
      formChange: this.props.userDetailsStore.formChange },
  })

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
    const actionValue = this.props.match.params.action;
    const { inProgress } = this.props.uiStore;
    const { userId, accountId } = this.props;
    const confirmForm = this.confirmForm();
    const { formChange } = confirmForm[actionValue];
    return (
      <Modal open closeOnDimmerClick={false} closeIcon onClose={this.handleBack} size="mini">
        <Modal.Header className="signup-header">
          <Header textAlign="center" as="h3">Mark as {confirmForm[actionValue].headerTitle}</Header>
        </Modal.Header>
        <Modal.Content>
          <Form>
            <FormTextarea
              containerclassname="secondary"
              name="reason"
              fielddata={confirmForm[actionValue].form.fields.reason}
              changed={(e, result) => formChange(e, result, confirmForm[actionValue].formKey)}
            />
            <div className="center-align mt-30">
              <Button className="primary relaxed" content={`${confirmForm[actionValue].headerTitle} Account`} loading={inProgress} onClick={() => this.freezeAccountToggle(userId, accountId, actionValue)} />
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
