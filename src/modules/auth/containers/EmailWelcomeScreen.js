/* eslint-disable react/no-unescaped-entities */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import { Modal, Header } from 'semantic-ui-react';

@inject('authStore', 'uiStore', 'userDetailStore')
@observer
export default class EmailWelcomeScreen extends Component {
  componentWillMount() {
    this.props.authStore.resetForm('FORGOT_PASS_FRM');
  }
  componentWillUnmount() {
    // Do not reset authStore here; required
    this.props.uiStore.reset();
  }
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.push(this.props.uiStore.authRef || '/');
  };
  render() {
    const { userDetails } = this.props.userDetailsStore;
    return (
      <Modal open closeIcon onClose={this.handleCloseModal} size="mini" closeOnDimmerClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Welcome</Header>
        </Modal.Header>
        <Modal.Content className="mt-40">
          <p>
            Hi {`${get(userDetails, 'info.firstName') || ''} ${get(userDetails, 'info.lastName') || ''} `}
            we're excited to show you what's new on
          </p>
          <p className="mt-10">
            First, we're updgrading security, and we've
            added Multi-Factor Authentication(MFA) to protect your account
          </p>
          <p className="mt-10">
            In the next couple of steps, we'll ask you to
            verify your email address and phone number.
            This will be used to confirm your identity when
            your future changes are being requested in your account.
          </p>
        </Modal.Content>
        <Modal.Actions className="signup-actions">
          <p><b>Back to</b> <Link to="/auth/confirm-email">Continue</Link></p>
        </Modal.Actions>
      </Modal>
    );
  }
}
