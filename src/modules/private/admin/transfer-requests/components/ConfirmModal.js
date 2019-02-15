import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Button, Form } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { FormTextarea } from '../../../../../theme/form';
import { FAILED_STATUS } from '../../../../../services/constants/admin/transactions';
@inject('transactionsStore', 'uiStore')
@withRouter
@observer
export default class ConfirmModal extends Component {
  componentWillMount() {
    this.props.transactionsStore.resetModalForm();
  }
  handleBack = () => {
    const {
      statusType,
    } = this.props.match.params;
    this.props.history.push(`${this.props.refLink}/${statusType}`);
  }
  handleConfirm = () => {
    const {
      requestId, statusType,
    } = this.props.match.params;

    this.props.transactionsStore
      .failTransaction(parseInt(requestId, 10), statusType).then(() => {
        this.props.uiStore.setProgress(false);
        this.props.history.push(`${this.props.refLink}/${statusType}`);
      });
  }
  render() {
    const { formChange, TRANSACTION_FAILURE } = this.props.transactionsStore;
    const { inProgress } = this.props.uiStore;
    const {
      statusType,
    } = this.props.match.params;
    return (
      <Modal open closeOnDimmerClick={false} closeIcon onClose={this.handleBack} size="mini">
        <Modal.Header className="signup-header">
          <Header textAlign="center" as="h3">Mark as { FAILED_STATUS[statusType]}</Header>
        </Modal.Header>
        <Modal.Content>
          <Form>
            <FormTextarea
              containerclassname="secondary"
              name="justifyDescription"
              fielddata={TRANSACTION_FAILURE.fields.justifyDescription}
              changed={(e, result) => formChange(e, result, 'TRANSACTION_FAILURE')}
            />
            <div className="center-align mt-30">
              <Button className="red relaxed" content={`Confirm ${statusType === 'status-1' ? 'Decline' : 'Failure'}`} loading={inProgress} disabled={!TRANSACTION_FAILURE.meta.isValid} onClick={this.handleConfirm} />
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
