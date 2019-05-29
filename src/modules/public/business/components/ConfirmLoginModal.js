import React from 'react';
import { Modal, Header } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

@inject('uiStore')
@withRouter
@observer
export default class ConfirmLoginModal extends React.Component {
    handleCloseModal = () => {
      this.props.history.push(this.props.refLink);
    }
    render() {
      return (
        <Modal size="small" open closeIcon onClose={this.handleCloseModal}>
          <Modal.Content className="relaxed center-align">
            <Header as="h4">Investor accounts may not be used to apply for business funding. In order to apply to raise capital, log out of your investor account and submit your application with a different email address.</Header>
          </Modal.Content>
        </Modal>
      );
    }
}

