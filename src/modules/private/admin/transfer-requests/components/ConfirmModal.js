import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Button, Form } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { FormTextarea } from '../../../../../theme/form';
import { STATUS_MAPPING } from '../../../../../services/constants/admin/transactions';
@inject('transactionsStore')
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
      .failTransaction(
        parseInt(requestId, 10),
        STATUS_MAPPING[statusType].failedCta.action,
      ).then(() => {
        this.props.history.push(`${this.props.refLink}/${statusType}`);
      });
  }
  render() {
    const { formChange, TRANSACTION_FAILURE, btnLoader } = this.props.transactionsStore;
    const { statusType, requestId } = this.props.match.params;
    return (
      <Modal open closeOnDimmerClick={false} closeIcon onClose={this.handleBack} size="mini">
        <Modal.Header className="signup-header">
          <Header textAlign="center" as="h3">Mark as { STATUS_MAPPING[statusType].failedCta.title }</Header>
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
              <Button className="red relaxed" content={`Confirm ${statusType === 'pending' ? 'Decline' : 'Failure'}`} loading={btnLoader.includes(parseInt(requestId, 10))} disabled={!TRANSACTION_FAILURE.meta.isValid} onClick={this.handleConfirm} />
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
