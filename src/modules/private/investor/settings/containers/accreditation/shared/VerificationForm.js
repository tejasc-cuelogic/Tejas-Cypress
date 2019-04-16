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
  render() {
    const { VERIFICATION_REQUEST_FORM, verificationFormChange } = this.props.accreditationStore;
    return (
      <div>
        <Header as="h3" textAlign="center">Send verification request</Header>
        <p className="center-align">We will send a request to your lawyer, CPA, investment advisor or investment broker asking them to confirm in writing that they have seen evidence of your status as an accredited investor.</p>
        <p className="center-align">By submitting the below information, you are giving us permission to contact the listed verifier to verify your status, and you are giving the listed verifier permission to advise us of your status.</p>
        <Form error>
          <div className="field-wrap">
            <FormInput
              name="name"
              fielddata={VERIFICATION_REQUEST_FORM.fields.name}
              changed={verificationFormChange}
            />
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
            <Button onClick={() => this.props.clicked('VERIFICATION_REQUEST_FORM')} primary size="large" disabled={!VERIFICATION_REQUEST_FORM.meta.isValid}>Send verification request</Button>
          </div>
        </Form>
      </div>
    );
  }
}
