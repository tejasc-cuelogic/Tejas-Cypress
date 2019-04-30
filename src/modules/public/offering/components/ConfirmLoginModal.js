import React from 'react';
import { Modal, Header, Button } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { authActions } from '../../../../services/actions';

@inject('uiStore')
@withRouter
@observer
export default class ConfirmLoginModal extends React.Component {
    handleCloseModal = () => {
      this.props.history.push(this.props.refLink);
    }
    handleLogin = () => {
      const isInvestNow = this.props.history.location.pathname.includes('invest');
      this.props.uiStore.setRedirectURL({ pathname: `${this.props.refLink}/${isInvestNow ? 'invest-now' : ''}` });
      this.props.uiStore.setAuthRef(`${this.props.refLink}/${isInvestNow ? 'invest-now' : ''}`);
      authActions.logout('user').then(() => {
        this.props.history.push('/auth/login');
      });
    }
    render() {
      const isInvestNow = this.props.history.location.pathname.includes('invest');
      return (
        <Modal size="small" open closeIcon onClose={this.handleCloseModal}>
          <Modal.Content className="relaxed center-align">
            <Header as="h3">Sorry!</Header>
            <Header as="h4">{`You must be logged in as an Investor in order to ${isInvestNow ? 'Invest' : 'Post a comment'}`}</Header>
            <Button primary className="mt-40" content="Login as an Investor" onClick={this.handleLogin} />
          </Modal.Content>
        </Modal>
      );
    }
}

