import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import { Modal, Header, Button, Form } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { FormTextarea } from '../../../../../../../theme/form';
@inject('userDetailsStore', 'uiStore', 'accountStore')
@withRouter
@observer
export default class ConfirmModel extends Component {
  constructor(props) {
    super(props);
    this.props.userDetailsStore.resetModalForm();
    this.props.accountStore.closeAccountForm();
  }

  handleBack = () => {
    this.props.history.push(`${this.props.refLink}`);
  }

  confirmForm = () => ({
    HARD_FREEZE: {
      headerTitle: 'Hard Freeze',
      btntext: 'Hard Freeze',
      form: this.props.userDetailsStore.FRM_FREEZE,
      formKey: 'FRM_FREEZE',
      formChange: this.props.userDetailsStore.formChange,
    },
    'close-account': {
      headerTitle: 'Closed',
      btntext: 'Close',
      form: this.props.accountStore.CLOSE_ACCOUNT_FRM,
      formKey: 'CLOSE_ACCOUNT_FRM',
      formChange: this.props.accountStore.formChange,
    },
    UNFREEZE: {
      headerTitle: 'Unfreeze',
      btntext: 'Unfreeze',
      form: this.props.userDetailsStore.FRM_FREEZE,
      formKey: 'FRM_FREEZE',
      formChange: this.props.userDetailsStore.formChange,
    },
    SOFT_FREEZE: {
      headerTitle: 'Soft Freeze',
      btntext: 'Soft Freeze',
      form: this.props.userDetailsStore.FRM_FREEZE,
      formKey: 'FRM_FREEZE',
      formChange: this.props.userDetailsStore.formChange,
    },
  })

  handleConfirm = (userId, accountId, actionValue) => {
    if (['SOFT_FREEZE', 'HARD_FREEZE', 'UNFREEZE'].includes(actionValue)) {
      const { FRM_FREEZE } = this.props.userDetailsStore;
      this.props.userDetailsStore.freezeAccountToggle(
        userId,
        accountId,
        actionValue,
        FRM_FREEZE.fields.reason.value,
      );
      this.handleBack();
    } else {
      const { CLOSE_ACCOUNT_FRM } = this.props.accountStore;
      const account = this.props.userDetailsStore.currentActiveAccountDetailsOfSelectedUsers;
      this.props.accountStore.adminCloseInvestorAccount(
        userId,
        accountId,
        get(account, 'name') ? get(account, 'name').toUpperCase() : '',
        CLOSE_ACCOUNT_FRM.fields.reason.value,
      ).then((res) => {
        if (!get(res, 'data.adminCloseInvestorAccount.errorMessage')) {
          this.props.userDetailsStore.getUserProfileDetails(userId);
          this.props.history.push(`/dashboard/users/${userId}/profile-data/basic`);
        } else {
          this.handleBack();
        }
      });
    }
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
              <Button className="primary relaxed" content={`${confirmForm[actionValue].btntext} Account`} loading={inProgress} disabled={!confirmForm[actionValue].form.meta.isValid || inProgress} onClick={() => this.handleConfirm(userId, accountId, actionValue)} />
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
