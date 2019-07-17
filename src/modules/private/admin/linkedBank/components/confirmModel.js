import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Button, Form } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { FormTextarea } from '../../../../../theme/form';
@inject('bankAccountStore', 'uiStore', 'accountStore')
@withRouter
@observer
export default class ConfirmModel extends Component {
  componentWillMount() {
    this.props.bankAccountStore.resetFormData('formBankRequestVerifyDeny');
  }

  handleBack = () => {
    this.props.history.push(`${this.props.refLink}`);
  }

  confirmForm = () => ({
    approve: { headerTitle: 'Aproved',
      btntext: 'Approve',
      form: this.props.bankAccountStore.formBankRequestVerifyDeny,
      formKey: 'formBankRequestVerifyDeny',
      formChange: this.props.bankAccountStore.formChange },
    deny: { headerTitle: 'Denied',
      btntext: 'Deny',
      form: this.props.bankAccountStore.formBankRequestVerifyDeny,
      formKey: 'formBankRequestVerifyDeny',
      formChange: this.props.bankAccountStore.formChange },
  })

  handleConfirm = (form, action) => {
    const { accountId, userId } = this.props;
    const { value } = form.fields.reason;
    this.props.bankAccountStore.updateAccountChangeAction(accountId, userId, value, action === 'deny').then(() => {
      this.handleBack();
    });
  }

  render() {
    const actionValue = this.props.match.params.action;
    const { inProgress } = this.props.uiStore;
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
              <Button className="primary relaxed" content={`${confirmForm[actionValue].btntext} Link Bank Request`} loading={inProgress} disabled={!confirmForm[actionValue].form.meta.isValid || inProgress} onClick={() => this.handleConfirm(confirmForm[actionValue].form, actionValue)} />
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
