import React from 'react';
import { observer } from 'mobx-react';
import { Form, Button, Grid, Header, Divider } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import { AutoComplete } from '../../../../../../theme/form';
import cipVerificationHOC from '../../containers/cipVerificationHOC';

const isMobile = document.documentElement.clientWidth < 768;
@withRouter
@observer
class CipAddressVerification extends React.Component {
  constructor(props) {
    super(props);
    this.props.identityStore.setFieldValue('isAddressFailed', true);
  }

  handleClose = () => {
    this.props.identityStore.setFieldValue('isAddressFailed', false);
    this.props.cipUtility.closeModal();
  }

  handleBack = () => {
    this.props.cipUtility.handleBack('isAddressFailed');
  }

  render() {
    const { cipUtility, isLoading, NsModal } = this.props;
    const { ID_VERIFICATION_FRM, setAddressFieldsForUserVerification, personalInfoChange } = this.props.identityStore;
    return (
      <NsModal
        onClose={this.handleClose}
        closeOnEscape={false}
        back={this.handleBack}
        {...this.props}
      >
        <Grid centered stackable className={isMobile ? 'full-width' : ''}>
          <Grid.Column width="8" className="pt-0">
            <Header as="h4">Verify Residential Address</Header>
            <p>Unfortunately, we were unable to verify your address. Please review and update your address here.</p>
            <Divider hidden />
            <Form error onSubmit={() => cipUtility.handleCip('addressFail')}>
              <AutoComplete
                name="street"
                fielddata={ID_VERIFICATION_FRM.fields.street}
                onplaceselected={place => setAddressFieldsForUserVerification(place, 'ID_VERIFICATION_FRM')}
                changed={(e, result) => personalInfoChange(e, result, 'ID_VERIFICATION_FRM')}
                placeHolder="Address"
              />
              <Form.Group widths={3}>
                {cipUtility.addressTemplate('ID_VERIFICATION_FRM')}
              </Form.Group>
              <p className="note">
                <b>Note:</b> This sometimes occurs if you recently moved or if the address was zoned differently (e.g. as a commercial location) in the past. If this address is correct, please proceed by selecting the {'"'}Confirm{'"'} button.
              </p>
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
export default cipVerificationHOC(CipAddressVerification);
