import React, { Component } from 'react';
import { Modal } from 'semantic-ui-react';
import { includes } from 'lodash';
import { Plaid } from '../../../shared/bankAccount';

export default class LinkBankAccount extends Component {
  state = { action: 'change' };
  handleCloseModal = (e) => {
    e.stopPropagation();
    const accountType = includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity';
    const redirectUrl = `/app/account-details/${accountType}/bank-accounts`;
    this.props.history.push(redirectUrl);
  }
  render() {
    return (
      <Modal open closeIcon onClose={this.handleCloseModal} size="small" closeOnDimmerClick={false}>
        <Modal.Content className="relaxed">
          <Plaid action={this.state.action} refLink={this.props.match.url} />
        </Modal.Content>
      </Modal>
    );
  }
}
