import React, { Component } from 'react';
import { Modal, Dimmer, Loader } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { includes } from 'lodash';
import { Plaid } from '../../../shared/bankAccount';

// const isMobile = document.documentElement.clientWidth < 768;
@inject('uiStore')
@observer
export default class LinkBankAccount extends Component {
  state = { action: 'change' };

  handleCloseModal = (e) => {
    e.stopPropagation();
    const accountType = includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity';
    const redirectUrl = `/app/account-details/${accountType}/bank-accounts`;
    this.props.history.push(redirectUrl);
  }

  render() {
    const { inProgress } = this.props.uiStore;
    return (
      <Modal open closeIcon onClose={this.handleCloseModal} size="small" closeOnDimmerClick={false} className="link-bank-modal">
        {(this.state.action === 'change' && inProgress)
          && (
            <Dimmer className="fullscreen" active={inProgress}>
              <Loader active={inProgress}>
                Please wait...
              </Loader>
            </Dimmer>
          )
        }
        <Modal.Content className="relaxed">
          <Plaid action={this.state.action} refLink={this.props.match.url} />
        </Modal.Content>
      </Modal>
    );
  }
}
