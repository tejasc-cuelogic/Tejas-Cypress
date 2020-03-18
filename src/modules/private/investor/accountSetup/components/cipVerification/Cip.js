import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Button, Divider, Form, Message, Grid, Header, Responsive } from 'semantic-ui-react';
import { USER_TITLE } from '../../../../../../services/constants/user';
import { CipErrors, ListErrors } from '../../../../../../theme/shared';
import { FormSelect, AutoComplete } from '../../../../../../theme/form';
import cipVerificationHOC from '../../containers/cipVerificationHOC';

const isMobile = document.documentElement.clientWidth < 768;
const headerSiblingsContent = (
  <>
    <Header as="h3">Let’s create your NextSeed investment account.</Header>
    {!isMobile && <Divider hidden />}
    <p className="mt-20">
      Federal regulations require us to verify your legal <Responsive minWidth={992} as="br" />identity.
      We use state-of-the-art security measures<Responsive minWidth={992} as="br" /> to protect your information.
    </p>
  </>
);

const loaderMsg = (
  <>
    Please wait...
      <br />
      <br />
    This can take up to a minute.
    </>
);
@withRouter
@observer
class Cip extends React.Component {
  constructor(props) {
    super(props);
    this.props.identityStore.resetCipData();
  }

  handleEncryptedSsn = (fielddata) => {
    if (fielddata.value && fielddata.value.includes('X')) {
      return { ...fielddata, value: '' };
    }
    return fielddata;
  }

  render() {
    const { cipUtility, NsModal, elements, errors } = this.props;
    const { MaskedInput, FormInput } = elements;
    const { ID_VERIFICATION_FRM, personalInfoChange, signUpLoading, personalInfoMaskedChange, setAddressFieldsForUserVerification } = this.props.identityStore;
    const { givenName } = this.props.userStore.currentUser;

    return (
      <NsModal
        onClose={() => cipUtility.closeModal()}
        closeOnEscape={false}
        loaderMsg={loaderMsg}
        {...this.props}
      >
        <Grid stackable className={isMobile ? 'full-width' : ''}>
          <Grid.Column mobile={16} tablet={16} computer={7}>
            <Header as="h3" className="highlight-text">Hello {givenName}!</Header>
            {headerSiblingsContent}
          </Grid.Column>
          <Grid.Column mobile={16} tablet={16} computer={9}>
            <Form error onSubmit={() => cipUtility.handleCip(false)}>
              <Form.Group widths="equal">
                <FormSelect
                  name="salutation"
                  placeholder="Select"
                  fielddata={ID_VERIFICATION_FRM.fields.salutation}
                  options={USER_TITLE}
                  changed={(e, result) => personalInfoChange(e, result, 'ID_VERIFICATION_FRM')}
                />
                {['firstLegalName', 'lastLegalName'].map(field => (
                  <FormInput
                    key={field}
                    type="text"
                    name={field}
                    fielddata={ID_VERIFICATION_FRM.fields[field]}
                    changed={(e, result) => personalInfoChange(e, result, 'ID_VERIFICATION_FRM')}
                  />
                ))}
              </Form.Group>
              <AutoComplete
                name="street"
                fielddata={ID_VERIFICATION_FRM.fields.street}
                onplaceselected={place => setAddressFieldsForUserVerification(place, 'ID_VERIFICATION_FRM')}
                changed={(e, result) => personalInfoChange(e, result, 'ID_VERIFICATION_FRM')}
                placeHolder="Street Address, City, State, Zip"
              />
              <FormInput
                key="streetTwo"
                type="text"
                name="streetTwo"
                fielddata={ID_VERIFICATION_FRM.fields.streetTwo}
                changed={(e, result) => personalInfoChange(e, result, 'ID_VERIFICATION_FRM')}
              />
              <Form.Group widths={3}>
                {cipUtility.addressTemplate('ID_VERIFICATION_FRM')}
                <MaskedInput
                  name="phoneNumber"
                  type="tel"
                  fielddata={ID_VERIFICATION_FRM.fields.phoneNumber}
                  format="(###) ###-####"
                  changed={(values, name) => personalInfoMaskedChange(values, name, 'ID_VERIFICATION_FRM')}
                  phoneNumber
                />
                <MaskedInput
                  name="dateOfBirth"
                  fielddata={ID_VERIFICATION_FRM.fields.dateOfBirth}
                  type="tel"
                  format="##/##/####"
                  changed={(values, name) => personalInfoMaskedChange(values, name, 'ID_VERIFICATION_FRM')}
                  dateOfBirth
                />
                <MaskedInput
                  name="ssn"
                  fielddata={this.handleEncryptedSsn(ID_VERIFICATION_FRM.fields.ssn)}
                  ssn
                  changed={(values, name) => personalInfoMaskedChange(values, name, 'ID_VERIFICATION_FRM')}
                />
              </Form.Group>
              <p className="note">
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
              <div className="mt-30 mb-20">
                <Button fluid={isMobile} primary content="Verify my identity" disabled={!ID_VERIFICATION_FRM.meta.isValid || signUpLoading} />
              </div>
              <div className={isMobile && 'center-align'}>
                <Link to="/dashboard/setup" onClick={cipUtility.closeModal}>I’ll finish this later</Link>
              </div>
            </Form>
          </Grid.Column>
        </Grid>
      </NsModal>
    );
  }
}
export default cipVerificationHOC(Cip);
