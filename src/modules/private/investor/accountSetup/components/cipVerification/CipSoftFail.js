import React from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Button, Form, Divider, Grid, Header } from 'semantic-ui-react';
import cipVerificationHOC from '../../containers/cipVerificationHOC';
import { FormSelect } from '../../../../../../theme/form';

const isMobile = document.documentElement.clientWidth < 768;
const headerSiblings = (
  <>
    <p>
    We were unable to verify your identity with the information provided. Please answer the following questions to confirm your identity.
    </p>
    <Divider hidden />
  </>
);

@inject('identityStore')
@observer
class CipSoftFail extends React.Component {
  handleSubmitIdentityQuestions = async (e) => {
    e.preventDefault();
    const { cipBackUrl, setFieldValue } = this.props.identityStore;
    const { handleCipExpiration, redirectTo } = this.props.cipUtility;
    this.props.identityStore.setFieldValue('signUpLoading', true);
    let { url } = await this.props.identityStore.verifyCipSoftFail();
    const { accountForWhichCipExpired, userDetails } = this.props.userDetailsStore;
    if ((userDetails.legalDetails.status === 'OFFLINE' || accountForWhichCipExpired)
      && this.props.identityStore.cipStepUrlMapping.ciphardFail.url !== url) {
      url = await handleCipExpiration();
    }
    const { cipHardFail } = this.props.investorUrls;

    if (cipHardFail === url) {
      setFieldValue('cipBackUrl', [...cipBackUrl, ...[this.props.investorUrls.cipSoftFail]]);
    }
    redirectTo(url);
  }

  render() {
    const { NsModal, cipUtility, isLoading } = this.props;
    const { ID_VERIFICATION_QUESTIONS, identityQuestionAnswerChange } = this.props.identityStore;
    const { fields } = ID_VERIFICATION_QUESTIONS;
    return (
      <NsModal
        onClose={() => cipUtility.closeModal()}
        back={window.sessionStorage.getItem('AccountCipExp') === null && '/dashboard/setup/cip'}
        {...this.props}
      >
        <Grid centered stackable className={isMobile ? 'full-width' : ''}>
          <Grid.Column width="8" className="pt-0">
            <Header as="h4">We need to confirm your identity</Header>
            {headerSiblings}
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
              <div className="mt-40 mb-20">
                <Button loading={isLoading} color="green" fluid={isMobile} disabled={!ID_VERIFICATION_QUESTIONS.meta.isValid || isLoading}>Verify my identity</Button>
              </div>
              <div className={isMobile && 'center-align'}>
                <Link to="/dashboard/setup" onClick={() => cipUtility.closeModal()}>I’ll finish this later</Link>
              </div>
            </Form>
          </Grid.Column>
        </Grid>
      </NsModal>
    );
  }
}

export default cipVerificationHOC(CipSoftFail);
