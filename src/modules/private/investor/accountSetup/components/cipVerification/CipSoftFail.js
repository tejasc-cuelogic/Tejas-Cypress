import React from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Button, Form, Divider, Grid, Message } from 'semantic-ui-react';
import { ListErrors } from '../../../../../../theme/shared';
import cipVerificationHOC from '../../containers/cipVerificationHOC';
import { INVESTOR_URLS } from '../../../../../../services/constants/url';
import formHOC from '../../../../../../theme/form/formHOC';
import { FormSelect } from '../../../../../../theme/form';

const metaInfo = {
  store: 'identityStore',
  form: 'ID_VERIFICATION_QUESTIONS',
};

const headerSiblings = (
  <>
    <Divider />
    <p>
      We were unable to match your information with the
      address you provided. (
      <i>Note: This may happen if you recently relocated or you entered your address incorrectly
      </i>)
    </p>
  </>
);

@inject('identityStore')
@observer
class CipSoftFail extends React.Component {
  handleSubmitIdentityQuestions = async (e) => {
    e.preventDefault();
    const { handleCipExpiration, redirectTo } = this.props.commonMethods;
    this.props.identityStore.setFieldValue('signUpLoading', true);
    let { url } = await this.props.identityStore.verifyCipSoftFail();
    const { accountForWhichCipExpired, userDetails } = this.props.userDetailsStore;
    if ((userDetails.legalDetails.status === 'OFFLINE' || accountForWhichCipExpired)
      && this.props.identityStore.cipStepUrlMapping.ciphardFail.url !== url) {
      url = await handleCipExpiration();
    }
    if (INVESTOR_URLS.cipHardFail === url) {
      this.props.identityStore.setFieldValue('cipBackUrl', INVESTOR_URLS.cipSoftFail);
    }
    redirectTo(url);
  }

  render() {
    const { NsModal, commonMethods, isLoading, errors } = this.props;
    const { ID_VERIFICATION_QUESTIONS, identityQuestionAnswerChange } = this.props.identityStore;
    const { fields } = ID_VERIFICATION_QUESTIONS;
    return (
      <NsModal
        onClose={() => commonMethods.closeModal()}
        header="We need to confirm your identity"
        headerSiblings={headerSiblings}
        isLoading={isLoading}
        backUrl="/dashboard/setup/cip"
        actions={(
          <p>
            <Link to="/dashboard/setup" onClick={() => commonMethods.closeModal()}>I’ll finish this later</Link>
          </p>
        )}
      >
        <Form error onSubmit={this.handleSubmitIdentityQuestions}>
          <Grid>
            {Object.keys(fields).map((field) => {
              const fieldData = fields[field];
              return (
                <FormSelect
                  fluid
                  fielddata={fieldData}
                  name={fieldData.key}
                  value={fieldData.value}
                  options={fieldData.options}
                  changed={identityQuestionAnswerChange}
                  containerwidth={16}
                />
              );
            })}
          </Grid>
          {errors && errors.message
            && (
              <Message error className="mt-30">
                <ListErrors errors={[errors.message]} />
              </Message>
            )
          }
          {errors && !errors.message
            && (
              <Message error className="mt-30">
                <ListErrors errors={[errors]} />
              </Message>
            )
          }
          <div className="center-align mt-30">
            <Button loading={isLoading} color="green" size="large" className="relaxed" disabled={!ID_VERIFICATION_QUESTIONS.meta.isValid || isLoading}>Verify my identity</Button>
          </div>
        </Form>
      </NsModal>
    );
  }
}

export default cipVerificationHOC(formHOC(CipSoftFail, metaInfo), metaInfo);
