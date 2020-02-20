import React from 'react';
import { observer } from 'mobx-react';
import { Form, Button } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import { AutoComplete } from '../../../../../../theme/form';
import cipVerificationHOC from '../../containers/cipVerificationHOC';

@withRouter
@observer
class CipAddressVerification extends React.Component {
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
    const { commonMethods, isLoading, NsModal } = this.props;
    const { ID_VERIFICATION_FRM, setAddressFieldsForUserVerification, personalInfoChange } = this.props.identityStore;
    return (
      <NsModal
        onClose={() => this.handleClose()}
        closeOnEscape={false}
        isLoading={isLoading}
        backUrl="/dashboard/setup/cip"
        actions={<p><Link to="/dashboard/setup" onClick={this.handleClose}>I’ll finish this later</Link></p>}
      >
        <Form error onSubmit={commonMethods.handleCip}>
          <AutoComplete
            name="street"
            fielddata={ID_VERIFICATION_FRM.fields.street}
            onplaceselected={setAddressFieldsForUserVerification}
            changed={personalInfoChange}
            placeHolder="Street Address, City, State, Zip"
          />
          {commonMethods.addressTemplate()}
          <div className="center-align mt-30">
            <Button primary size="large" className="very relaxed" content="Confirm" disabled={!ID_VERIFICATION_FRM.meta.isValid || isLoading} />
          </div>
        </Form>
      </NsModal>
    );
  }
}
export default cipVerificationHOC(CipAddressVerification);
