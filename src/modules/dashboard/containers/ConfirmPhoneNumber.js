import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Modal, Button, Header, Form, Divider } from 'semantic-ui-react';
import { FormInput, MaskedInput } from '../../../components/form/FormElements';

import validationActions from '../../../actions/validation';

@inject('profileStore', 'uiStore')
@observer
export default class ConfirmPhoneNumber extends Component {
  componentWillMount() {
    this.props.profileStore.startPhoneVerification().then((result) => {
      console.log(result);
    });
  }
  componentWillUnmount() {
    this.props.uiStore.clearErrors();
  }

  handleInputChange = (e, { name, value }) =>
    validationActions.validateProfileDetailsField(name, value);

  handleConfirmPhoneNumber = (e) => {
    e.preventDefault();
    this.props.profileStore.confirmPhoneNumber();
  }

  render() {
    const { verifyIdentity01, verifyIdentity04, verifyPhoneNumberEleChange } =
    this.props.profileStore;
    return (
      <Modal size="mini" open closeIcon onClose={() => this.props.setDashboardWizardStep()}>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">Confirm your phone number</Header>
          <Divider />
          <p>We are about to text a verification code to:</p>
        </Modal.Header>
        <Modal.Content className="signup-content center-align">
          <div className="field">
            <div className="ui huge input">
              <MaskedInput
                value="66123456781"
                type="tel"
                name="phoneNumber"
                fielddata={verifyIdentity01.fields.phoneNumber}
                mask="+9 999-999-9999"
                readOnly
                hidelabel
              />
            </div>
          </div>
          <p><Link to="/app/dashboard" onClick={() => this.props.setDashboardWizardStep('InvestorPersonalDetails')}>Change phone number</Link></p>
          <Form error onSubmit={this.handleConfirmPhoneNumber}>
            <FormInput
              size="huge"
              className="otp-field"
              maxLength={6}
              fielddata={verifyIdentity04.fields.code}
              onChange={verifyPhoneNumberEleChange}
            />
            <div className="center-align">
              <Button color="green" size="large" className="very relaxed">Confirm</Button>
            </div>
            <div className="center-align">
              <Button className="cancel-link" onClick={() => this.props.setDashboardWizardStep()}>Resend the code to my phone</Button>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
