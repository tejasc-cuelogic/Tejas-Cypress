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
    if (!this.props.identityStore.isPhoneFailed) {
      this.props.identityStore.resetFormData('ID_PHONE_FAIL_FRM');
    }
    this.props.identityStore.setFieldValue('isPhoneFailed', true);
  }

  handleClose = () => {
    this.props.identityStore.setFieldValue('isPhoneFailed', false);
    this.props.commonMethods.closeModal();
  }

  handleBack = () => {
    this.props.identityStore.setFieldValue('isPhoneFailed', false);
    this.props.history.push('/dashboard/setup/cip');
  }

  render() {
    const { commonMethods, isLoading, NsModal, elements } = this.props;
    const { MaskedInput } = elements;
    const { errors } = this.props.uiStore;
    const { ID_PHONE_FAIL_FRM, personalInfoMaskedChange } = this.props.identityStore;
    return (
      <NsModal
        onClose={() => commonMethods.closeModal()}
        closeOnEscape={false}
        back={this.handleBack}
        {...this.props}
      >
        <Grid centered stackable className={isMobile ? 'full-width' : ''}>
          <Grid.Column width="8" className="pt-0">
            <Header as="h4">Confirm your phone number</Header>
            <p>
              The phone number you shared appears to be registered to a VoIP phone service. Please enter an alternative phone number.
            </p>
            <Form error onSubmit={commonMethods.handleCip}>
              <MaskedInput
                name="phoneNumber"
                type="tel"
                fielddata={ID_PHONE_FAIL_FRM.fields.phoneNumber}
                format="(###) ###-####"
                changed={(values, name) => personalInfoMaskedChange(values, name, 'ID_PHONE_FAIL_FRM')}
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
                <Button primary fluid={isMobile} content="Confirm" disabled={!ID_PHONE_FAIL_FRM.meta.isValid || isLoading} />
              </div>
              <div className={isMobile && 'center-align'}>
                <Link to="/dashboard/setup" onClick={this.handleClose}>I’ll finish this later</Link>
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
