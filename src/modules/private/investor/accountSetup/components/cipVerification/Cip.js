import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Button, Divider, Form, Message } from 'semantic-ui-react';
import { USER_TITLE } from '../../../../../../services/constants/user';
import { CipErrors, ListErrors } from '../../../../../../theme/shared';
import { FormSelect, AutoComplete } from '../../../../../../theme/form';
import cipVerificationHOC from '../../containers/cipVerificationHOC';

const headerSiblingsContent = (
  <>
    <p>Let’s create your NextSeed investment account.</p>
    <Divider section />
    <p>
      Federal regulations require us to verify your legal identity.
      We use state-of-the-art security measures to protect your information.
    </p>
  </>
);

const loaderMsg = (
  <>
    Please wait...
      <br />
    <br />
    We are verifying your identity.
      <br />
    This can take up to a minute.
    </>
);
@withRouter
@observer
class Cip extends React.Component {
  handleEncryptedSsn = (fielddata) => {
    if (fielddata.value && fielddata.value.includes('X')) {
      return { ...fielddata, value: '' };
    }
    return fielddata;
  }

  render() {
    const { commonMethods, NsModal, isLoading, elements } = this.props;
    const { MaskedInput, FormInput } = elements;
    const { ID_VERIFICATION_FRM, personalInfoChange, signUpLoading, personalInfoMaskedChange, setAddressFieldsForUserVerification } = this.props.identityStore;
    const { givenName } = this.props.userStore.currentUser;
    const { errors } = this.props.uiStore;

    return (
      <NsModal
        onClose={() => commonMethods.closeModal()}
        closeOnEscape={false}
        header={`Welcome ${givenName}`}
        headerSiblings={headerSiblingsContent}
        loaderMsg={loaderMsg}
        isLoading={isLoading}
        actions={<p><Link to="/dashboard/setup" onClick={commonMethods.closeModal}>I’ll finish this later</Link></p>}
      >
        <Form error onSubmit={commonMethods.handleCip}>
            <Form.Group widths="equal">
              <FormSelect
                containerwidth={8}
                name="salutation"
                placeholder="Select"
                fielddata={ID_VERIFICATION_FRM.fields.salutation}
                options={USER_TITLE}
                changed={personalInfoChange}
              />
              {['firstLegalName', 'lastLegalName'].map(field => (
                <FormInput
                  key={field}
                  type="text"
                  name={field}
                  fielddata={ID_VERIFICATION_FRM.fields[field]}
                  changed={personalInfoChange}
                />
              ))}
            </Form.Group>
            <AutoComplete
              name="street"
              fielddata={ID_VERIFICATION_FRM.fields.street}
              onplaceselected={setAddressFieldsForUserVerification}
              changed={personalInfoChange}
              placeHolder="Street Address, City, State, Zip"
            />
            <FormInput
              key="streetTwo"
              type="text"
              name="streetTwo"
              fielddata={ID_VERIFICATION_FRM.fields.streetTwo}
              changed={personalInfoChange}
            />
            <Form.Group widths={2}>
              {commonMethods.addressTemplate()}
              <MaskedInput
                name="phoneNumber"
                type="tel"
                fielddata={ID_VERIFICATION_FRM.fields.phoneNumber}
                format="(###) ###-####"
                changed={personalInfoMaskedChange}
                phoneNumber
              />
              <MaskedInput
                name="dateOfBirth"
                fielddata={ID_VERIFICATION_FRM.fields.dateOfBirth}
                type="tel"
                format="##/##/####"
                changed={personalInfoMaskedChange}
                dateOfBirth
              />
              <MaskedInput
                name="ssn"
                fielddata={this.handleEncryptedSsn(ID_VERIFICATION_FRM.fields.ssn)}
                ssn
                changed={personalInfoMaskedChange}
              />
            </Form.Group>
            <p className="note center-align">
              By selecting <b>Verify my identity</b>, you agree NextSeed may deliver verification
              codes to you using the phone number you have provided. Codes may be sent using text
              messages, an autodialer, or artificial or prerecorded voice messages to such phone
              number. Your mobile carrier’s messaging and data fees may apply.
          </p>
            {errors
              && (
                <Message error className="mt-30">
                  <ListErrors errors={errors.message ? [errors.message] : [errors]} />
                </Message>
              )
            }
            {ID_VERIFICATION_FRM.response.qualifiers
              && (
                <Message error className="mt-30">
                  <CipErrors errorsList={ID_VERIFICATION_FRM.response.qualifiers} />
                </Message>
              )
            }
            <div className="center-align mt-30">
              <Button primary size="large" className="very relaxed" content="Verify my identity" disabled={!ID_VERIFICATION_FRM.meta.isValid || signUpLoading} />
            </div>
          </Form>
      </NsModal>
    );
  }
}
export default cipVerificationHOC(Cip);
