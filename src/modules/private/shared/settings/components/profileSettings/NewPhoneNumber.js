import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import { Route, withRouter } from 'react-router-dom';
import { Header, Modal, Form, Button, Message } from 'semantic-ui-react';
import { MaskedInput } from '../../../../../../theme/form';
import ConfirmPhoneNumber from './ConfirmPhoneNumber';
import { ListErrors } from '../../../../../../theme/shared';

@inject('profileStore', 'uiStore')
@withRouter
@observer
export default class NewPhoneNumber extends Component {
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.push('/app/profile-settings/profile-data');
    this.props.uiStore.clearErrors();
    this.props.profileStore.resetFormData('verifyIdentity01');
  }
  handleChangePhoneNumber = () => {
    this.props.profileStore.resetFormData('verifyIdentity04');
    this.props.profileStore.startPhoneVerification().then(() => {
      this.props.history.push(`${this.props.match.url}/confirm`);
    })
      .catch(() => {});
  }
  render() {
    const {
      verifyIdentity01,
      verifyIdentityEleChange,
    } = this.props.profileStore;
    const { match } = this.props;
    const { errors } = this.props.uiStore;
    return (
      <Modal size="mini" open closeIcon onClose={this.handleCloseModal}>
        <Route
          path={`${match.url}/confirm`}
          render={props => <ConfirmPhoneNumber newPhoneNumber refLink={match.url} {...props} />}
        />
        <Modal.Header className="center-align signup-header">
          <Header as="h2">Enter new phone number</Header>
          <p>We will send you a verification code to the phone number you provide.</p>
        </Modal.Header>
        <Modal.Content>
          {errors &&
            <Message error >
              <ListErrors errors={[errors]} />
            </Message>
          }
          <Form error onSubmit={this.handleChangePhoneNumber}>
            <MaskedInput
              name="phoneNumber"
              fielddata={verifyIdentity01.fields.phoneNumber}
              mask="999-999-9999"
              changed={verifyIdentityEleChange}
            />
            <div className="center-align">
              <Button loading={this.props.uiStore.inProgress} disabled={!!verifyIdentity01.fields.phoneNumber.error || _.isEmpty(verifyIdentity01.fields.phoneNumber.value)} primary size="large" className="very relaxed" >Change Phone Number</Button>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
