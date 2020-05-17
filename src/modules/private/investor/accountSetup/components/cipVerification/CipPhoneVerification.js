import React from 'react';
import { observer } from 'mobx-react';
import { Form, Button, Grid, Message, Header } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import { ListErrors } from '../../../../../../theme/shared';
import cipVerificationHOC from '../../containers/cipVerificationHOC';

const isMobile = document.documentElement.clientWidth < 768;
@withRouter
@observer
class CipPhoneVerification extends React.Component {
  constructor(props) {
    super(props);
    this.props.identityStore.setFieldValue('isPhoneFailed', true);
  }

  handleClose = () => {
    this.props.identityStore.setFieldValue('isPhoneFailed', false);
    this.props.cipUtility.closeModal();
  }

  handleBack = () => {
    this.props.cipUtility.handleBack('isPhoneFailed');
  }

  render() {
    const { cipUtility, isLoading, NsModal, elements, errors } = this.props;
    const { MaskedInput } = elements;
    const { ID_VERIFICATION_FRM, personalInfoMaskedChange } = this.props.identityStore;
    return (
      <NsModal
        onClose={this.handleClose}
        closeOnEscape={false}
        back={window.sessionStorage.getItem('AccountCipExp') === null && this.handleBack}
        {...this.props}
      >
        <Grid centered stackable className={isMobile ? 'full-width' : ''}>
          <Grid.Column width="8" className="pt-0">
            <Header as="h4">Confirm your phone number</Header>
            <p>
              The phone number you shared appears to be registered to a VoIP phone service. Please enter an alternative phone number.
            </p>
            <Form error onSubmit={() => cipUtility.handleCip('phoneFail')}>
              <MaskedInput
                name="phoneNumber"
                type="tel"
                fielddata={ID_VERIFICATION_FRM.fields.phoneNumber}
                format="(###) ###-####"
                changed={(values, name) => personalInfoMaskedChange(values, name, 'ID_VERIFICATION_FRM')}
                phoneNumber
                hidelabel
                containerclassname="secondary mb-40 mt-30"
              />
              <p>
                If you have any questions or if you believe this to be an error, email us at <a href="mailto:support@nextseed.com">support@nextseed.com</a>.
              </p>
              <p className="note">
                By selecting <b>Confirm</b>, you agree NextSeed may deliver verification codes to you using the phone number you have provided. Codes may be sent using text messages, an autodialer, or artificial or prerecorded voice messages to such phone number. Your mobile carrier’s messaging and data fees may apply.
              </p>
              <div className="mt-30 mb-20">
                <Button primary fluid={isMobile} content="Confirm" disabled={!ID_VERIFICATION_FRM.meta.isValid || isLoading} />
              </div>
              <div className={isMobile && 'center-align'}>
                <Link to="/dashboard/setup/establish-profile/confirm" onClick={this.handleClose}>I’ll finish this later</Link>
              </div>
              {errors
                && (
                  <Message error className="mt-30">
                    <ListErrors errors={errors.message ? [errors.message] : [errors]} />
                  </Message>
                )
              }
            </Form>
          </Grid.Column>
        </Grid>
      </NsModal>
    );
  }
}
export default cipVerificationHOC(CipPhoneVerification);
