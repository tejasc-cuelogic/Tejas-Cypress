/* eslint-disable react/no-unescaped-entities */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import { Modal, Header, Button } from 'semantic-ui-react';

@inject('authStore', 'uiStore', 'userDetailsStore')
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
        <Modal.Content className="center-align neutral-text">
          <Header as="h3" className="mt-80">Welcome!</Header>
          <p className="mt-80">
            Hi {`${get(userDetails, 'info.firstName') || ''}`},<br />
            We're excited to show you what's new on NextSeed!
          </p>
          <p className="mt-20">
            First, we're upgrading security, and we've
            added <b>Multi-Factor Authentication (MFA)</b> to protect your account.
          </p>
          <p className="mt-20">
            <b>In the next couple of steps, we'll ask you to
            verify your email address and phone number.
            </b>&nbsp;
            This will be used to confirm your identity when
            any future changes are being requested in your account.
          </p>
          <Button className="mt-80 mb-80 relaxed very" primary as={Link} to="/auth/confirm-email">Continue</Button>
        </Modal.Content>
      </Modal>
    );
  }
}
