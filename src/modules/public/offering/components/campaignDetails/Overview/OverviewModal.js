import React, { Component } from 'react';
// import { inject, observer } from 'mobx-react';
// import Aux from 'react-aux';
import { Modal } from 'semantic-ui-react';
// import defaultLeaderProfile from '../../../../../../assets/images/leader-placeholder.jpg';

// @inject('campaignStore')
// @observer
class OverviewModal extends Component {
  handleClose = () => this.props.history.goBack();

  render() {
    // const { campaign } = this.props.campaignStore;
    const emptyStatement = 'Detail not found';
    return (
      <Modal
        open
        onClose={this.handleClose}
        size="large"
        closeIcon
      >
        <Modal.Header>Top Things to Know</Modal.Header>
        <Modal.Content scrolling>
          {emptyStatement}
        </Modal.Content>
      </Modal>
    );
  }
}

export default OverviewModal;
