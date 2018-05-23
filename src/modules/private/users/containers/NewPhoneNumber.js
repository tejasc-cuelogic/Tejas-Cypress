import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import { Route, Link, withRouter } from 'react-router-dom';
import { Header, Modal, Form, Button } from 'semantic-ui-react';
import { MaskedInput } from '../../../../theme/form/FormElements';
import ConfirmPhoneNumber from '../../../summary/containers/ConfirmPhoneNumber';

@inject('profileStore', 'uiStore')
@withRouter
@observer
export default class NewPhoneNumber extends Component {
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.push('/app/profile-settings/profile-data');
  }
  render() {
    const {
      verifyIdentity01,
      verifyIdentityEleChange,
    } = this.props.profileStore;
    const { match } = this.props;
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
          <Form error>
            <MaskedInput
              name="phoneNumber"
              fielddata={verifyIdentity01.fields.phoneNumber}
              mask="999-999-9999"
              changed={verifyIdentityEleChange}
            />
            <div className="center-align">
              <Button disabled={!!verifyIdentity01.fields.phoneNumber.error || _.isEmpty(verifyIdentity01.fields.phoneNumber.value)} as={Link} to={`${match.url}/confirm`} loading={this.props.uiStore.inProgress} primary size="large" className="very relaxed" onClick={() => this.props.profileStore.startPhoneVerification()}>Change Phone Number</Button>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
