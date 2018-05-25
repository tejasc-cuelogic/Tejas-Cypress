import React, { Component } from 'react';
import Loadable from 'react-loadable';
import { Modal } from 'semantic-ui-react';

export default class LinkBankAccount extends Component {
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.goBack();
  }
  render() {
    const LoadableLinkBank = Loadable({
      loader: () => import('../../../summary/containers/individual/LinkBankPlaid'),
      loading() {
        return <div>Loading...</div>;
      },
    });
    return (
      <Modal open closeIcon onClose={this.handleCloseModal} size="small" closeOnDimmerClick={false}>
        <Modal.Content className="relaxed">
          <LoadableLinkBank />
        </Modal.Content>
      </Modal>
    );
  }
}
