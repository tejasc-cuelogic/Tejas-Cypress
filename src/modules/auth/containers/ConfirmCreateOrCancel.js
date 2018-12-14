/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Button } from 'semantic-ui-react';

@inject('userDetailsStore')
@withRouter
@observer
export default class ConfirmCreateOrCancel extends Component {
  handleCreateAccount = () => {
    this.props.history.push(this.props.refLink);
  }
  handleCancelAccount = () => {
    if (this.props.userDetailsStore.signupStatus.isMigratedFullAccount) {
      this.props.history.push('/app/summary');
    } else {
      this.props.history.push('/');
    }
  }
  render() {
    return (
      <Modal closeOnDimmerClick={false} size="mini" open closeOnRootNodeClick={false} >
        <Modal.Content className="signup-content center-align">
          <div>
            In order to create an account, You need to verify your email address.
            <Button primary className="relaxed" content="Create" onClick={this.handleCreateAccount} />
            <Button type="button" inverted color="red" content="Cancel" onClick={this.handleCancelAccount} />
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}
