/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Modal, Header, Button } from 'semantic-ui-react';

@inject('bankAccountStore', 'uiStore')
@withRouter
@observer
export default class CancelChangeLinkBankRequest extends Component {
  constructor(props) {
    super(props);
    this.props.bankAccountStore.hasPendingTransfersWithPendingBankChange();
  }

  handleCloseModal = (e) => {
    e.stopPropagation();
    const { refLink } = this.props;
    this.props.history.push(refLink);
  }

  submit = (e) => {
    const { declineBankChangeRequest } = this.props.bankAccountStore;
    declineBankChangeRequest().then(() => {
      this.handleCloseModal(e);
    });
  }

  render() {
    const { hasPendingRequest } = this.props.bankAccountStore;
    return (
    <Modal closeOnEscape={false} closeOnDimmerClick={false} size="mini" open closeIcon onClose={this.handleCloseModal} closeOnRootNodeClick={false}>
      <Modal.Header className="center-align signup-header">
        <Header as="h3">Cancel Change Request?</Header>
        <p>{hasPendingRequest && <span>You have pending transfer requests with this linked bank change. Cancelling the request will void those transactions.<br /></span>}Are you sure you want to proceed?</p>
      </Modal.Header>
      <Modal.Content>
        <div className="center-align">
          <Button className="very relaxed red" content="No" onClick={this.handleCloseModal} />
          <Button primary className="very relaxed" content="Yes" onClick={e => this.submit(e)} />
        </div>
      </Modal.Content>
    </Modal>
    );
  }
}
