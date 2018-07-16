import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import isEmpty from 'lodash/isEmpty';
import { Route, withRouter } from 'react-router-dom';
import { Header, Modal, Form, Button, Message } from 'semantic-ui-react';
import { MaskedInput } from '../../../../../../theme/form';
import ConfirmPhoneNumber from './ConfirmPhoneNumber';
import { ListErrors } from '../../../../../../theme/shared';

@inject('uiStore', 'identityStore')
@withRouter
@observer
export default class NewPhoneNumber extends Component {
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.push('/app/profile-settings/profile-data');
    this.props.uiStore.clearErrors();
    this.props.identityStore.resetFormData('ID_VERIFICATION_FRM');
  }
  handleChangePhoneNumber = () => {
    this.props.identityStore.resetFormData('ID_PHONE_VERIFICATION');
    this.props.identityStore.startPhoneVerification().then(() => {
      this.props.history.push(`${this.props.match.url}/confirm`);
    })
      .catch(() => {});
  }
  render() {
    const {
      ID_VERIFICATION_FRM,
      personalInfoChange,
    } = this.props.identityStore;
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
              fielddata={ID_VERIFICATION_FRM.fields.phoneNumber}
              mask="999-999-9999"
              changed={personalInfoChange}
            />
            <div className="center-align">
              <Button loading={this.props.uiStore.inProgress} disabled={!!ID_VERIFICATION_FRM.fields.phoneNumber.error || isEmpty(ID_VERIFICATION_FRM.fields.phoneNumber.value)} primary size="large" className="very relaxed" >Change Phone Number</Button>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
