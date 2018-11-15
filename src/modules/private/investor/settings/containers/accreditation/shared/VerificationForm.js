import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Header, Form, Button } from 'semantic-ui-react';
import { FormInput, FormDropDown } from '../../../../../../../theme/form';
import { VARIFY_ROLES } from '../../../../../../../constants/account';

@inject('accreditationStore')
@withRouter
@observer
export default class VerificationForm extends Component {
  showThanksNote = () => {
    this.props.history.push(`${this.props.refLink}/success`);
  }

  render() {
    const { VERIFICATION_REQUEST_FORM, verificationFormChange } = this.props.accreditationStore;
    return (
      <div>
        <Header as="h3" textAlign="center">Send verification request</Header>
        <p className="center-align">Your lawyer, CPA, investment advisor or investment broker can verify that they have seen evidence of your accredited status.No documentation is required</p>
        <Form error>
          <div className="field-wrap">
            <FormDropDown
              fielddata={VERIFICATION_REQUEST_FORM.fields.role}
              selection
              containerclassname="dropdown-field"
              name="role"
              options={VARIFY_ROLES}
              placeholder="Choose verifier role"
              onChange={(e, result) => verificationFormChange(e, result)}
            />
            <FormInput
              name="email"
              fielddata={VERIFICATION_REQUEST_FORM.fields.email}
              changed={verificationFormChange}
            />
          </div>
          <div className="center-align">
            <Button onClick={this.showThanksNote} primary size="large" disabled={!VERIFICATION_REQUEST_FORM.meta.isValid}>Confirm</Button>
          </div>
        </Form>
      </div>
    );
  }
}
