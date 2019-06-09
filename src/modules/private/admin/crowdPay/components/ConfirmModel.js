import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Button, Form } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { FormTextarea } from '../../../../../theme/form';

@inject('crowdpayStore', 'uiStore')
@withRouter
@observer
export default class ConfirmModel extends Component {
  componentWillMount() {
    this.props.crowdpayStore.resetModalForm();
  }

  handleBack = () => {
    this.props.history.push(`${this.props.refLink}`);
  }

  handleConfirm = () => {
    const { userId, accountId, action } = this.props.match.params;
    const availableActions = ['APPROVE', 'DECLINE'];
    if (availableActions.includes(action)) {
      const msg = `Crowdpay account is ${action === 'APPROVE' ? 'approved' : 'declined'} successfully.`;
      this.props.crowdpayStore.crowdPayCtaHandler(userId, accountId, action, msg).then(() => {
        this.props.history.push(`${this.props.refLink}`);
      }).catch();
    } else {
      this.props.history.push(`${this.props.refLink}`);
    }
  }

  render() {
    const { formChange, CONFIRM_CROWDPAY_FRM, loadingCrowdPayIds } = this.props.crowdpayStore;
    const actionValue = this.props.match.params.action;
    const { accountId } = this.props.match.params;
    return (
      <Modal open closeOnDimmerClick={false} closeIcon onClose={this.handleBack} size="mini">
        <Modal.Header className="signup-header">
          <Header textAlign="center" as="h3">
Mark as
            {actionValue === 'APPROVE' ? 'approved' : 'declined'}
          </Header>
        </Modal.Header>
        <Modal.Content>
          <Form>
            <FormTextarea
              containerclassname="secondary"
              name="justifyDescription"
              fielddata={CONFIRM_CROWDPAY_FRM.fields.justifyDescription}
              changed={(e, result) => formChange(e, result, 'CONFIRM_CROWDPAY_FRM')}
            />
            <div className="center-align mt-30">
              <Button className={actionValue === 'APPROVE' ? 'primary relaxed' : 'red relaxed'} content={actionValue === 'APPROVE' ? 'Approve request' : 'Decline request'} loading={loadingCrowdPayIds.includes(accountId)} disabled={!CONFIRM_CROWDPAY_FRM.meta.isValid} onClick={this.handleConfirm} />
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
