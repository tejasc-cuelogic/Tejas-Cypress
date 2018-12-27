import React from 'react';
import { Modal, Header, Button } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { capitalize } from 'lodash';
import { inject, observer } from 'mobx-react';
import { authActions } from '../../../../../services/actions';

@inject('uiStore', 'userDetailsStore')
@withRouter
@observer
export default class ConfirmLoginModal extends React.Component {
    handleCloseModal = () => {
      this.props.history.push(this.props.refLink);
    }
    handleLogin = () => {
      this.props.uiStore.setRedirectURL({ pathname: `${this.props.refLink}/invest-now` });
      this.props.uiStore.setAuthRef(`${this.props.refLink}/invest-now`);
      authActions.logout().then(() => {
        this.props.history.push('/auth/login');
      });
    }
    render() {
      const { userDetails } = this.props.userDetailsStore;
      return (
        <Modal size="small" open closeIcon onClose={this.handleCloseModal}>
          <Modal.Content className="relaxed center-align">
            <Header as="h3">Hello {userDetails && userDetails.info && `${capitalize(userDetails.info.firstName)} ${capitalize(userDetails.info.lastName)}`},</Header>
            <Header as="h4">to Invest one need to have a valid Investment account.</Header>
            <Button primary className="mt-40" content="Login as a Investor" onClick={this.handleLogin} />
          </Modal.Content>
        </Modal>
      );
    }
}

