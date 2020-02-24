import React from 'react';
import { observer } from 'mobx-react';
import { Form, Button, Grid } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import cipVerificationHOC from '../../containers/cipVerificationHOC';

const isMobile = document.documentElement.clientWidth < 768;
@withRouter
@observer
class CipPhoneVerification extends React.Component {
  constructor(props) {
    super(props);
    this.props.identityStore.resetAddressFields();
    this.props.identityStore.setFieldValue('isAddressFailed', true);
  }

  handleClose = () => {
    this.props.identityStore.setFieldValue('isAddressFailed', false);
    this.props.commonMethods.closeModal();
  }

  render() {
    const { commonMethods, isLoading, NsModal, elements } = this.props;
    const { MaskedInput } = elements;
    const { ID_VERIFICATION_FRM, personalInfoMaskedChange } = this.props.identityStore;
    return (
      <NsModal
        onClose={() => this.handleClose()}
        closeOnEscape={false}
        backUrl="/dashboard/setup/cip"
        {...this.props}
      >
        <Grid centered stackable className={isMobile ? 'full-width' : ''}>
          <Grid.Column width="8" className="pt-0">
            <Form error onSubmit={commonMethods.handleCip}>
              <MaskedInput
                name="phoneNumber"
                type="tel"
                fielddata={ID_VERIFICATION_FRM.fields.phoneNumber}
                format="(###) ###-####"
                changed={personalInfoMaskedChange}
                phoneNumber
              />
              <div className="mt-40 mb-20">
                <Button primary fluid={isMobile} content="Confirm" disabled={!ID_VERIFICATION_FRM.meta.isValid || isLoading} />
              </div>
              <div className={isMobile && 'center-align'}>
                <Link to="/dashboard/setup" onClick={this.handleClose}>I’ll finish this later</Link>
              </div>
            </Form>
          </Grid.Column>
        </Grid>
      </NsModal>
    );
  }
}
export default cipVerificationHOC(CipPhoneVerification);
