import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
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
        <Modal size="mini" open closeIcon onClose={this.handleCloseModal}>
          <Modal.Content>
            <p className="center-align mt-30 mb-30">
              Hello {userDetails && userDetails.info && `${capitalize(userDetails.info.firstName)} ${capitalize(userDetails.info.lastName)}`}, to Invest one need to have a valid Investment account.
            </p>
            <div className="center-align mt-30">
              <Button primary onClick={this.handleLogin} content="Login as a Investor" />
            </div>
          </Modal.Content>
        </Modal>
      );
    }
}

