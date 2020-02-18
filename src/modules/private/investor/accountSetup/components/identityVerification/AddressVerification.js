import React from 'react';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import { Modal, Header, Button, Form, Dimmer, Loader } from 'semantic-ui-react';
import { FormInput, AutoComplete, MaskedInput, FormDropDown } from '../../../../../../theme/form';
import { ProgressModalHeader } from '../../../../../../theme/shared';
import { US_STATES } from '../../../../../../constants/account';

const isMobile = document.documentElement.clientWidth < 768;
@inject('identityStore')
@withRouter
@observer
export default class AddressVerification extends React.Component {
  constructor(props) {
    super(props);
    this.props.identityStore.resetAddressFields();
    this.props.identityStore.setFieldValue('isAddressFailed', true);
  }

  render() {
    const { close, onSubmit, form, autoComplete, change, maskChange, inProgress } = this.props;
    return (
      <Modal
        open
        closeIcon={!isMobile}
        onClose={close}
        closeOnDimmerClick={false}
        dimmer="inverted"
        centered={false}
        className="multistep-modal"
        basic
        size="large"
      >
        {<ProgressModalHeader Modal={Modal} handleClose={close} closeCta />}
        <Modal.Content className="signup-content">
          <Header as="h4">verify Residential Address</Header>
          <p> Unfortunately, we were unable to verify your address. Please review and update address here.</p>
          <Dimmer className="fullscreen" active={inProgress}>
            <Loader active={inProgress}>
              Please wait...
            <br />
              <br />
              We are verifying your identity.
            <br />
              This can take up to a minute.
          </Loader>
          </Dimmer>
          <Form error onSubmit={onSubmit}>
            <AutoComplete
              name="street"
              fielddata={form.fields.street}
              onplaceselected={autoComplete}
              changed={change}
              placeHolder="Street Address, City, State, Zip"
              showerror
            />
            <FormInput
              key="city"
              type="text"
              name="city"
              fielddata={form.fields.city}
              changed={change}
              showerror
            />
            <FormDropDown
              name="state"
              fielddata={form.fields.state}
              options={US_STATES}
              search
              selection
              placeholder="Select"
              // onChange={(e, res) => userEleChange(e, res, 'dropdown')}
              onChange={change}
            />
            <MaskedInput
              key="zipCode"
              name="zipCode"
              fielddata={form.fields.zipCode}
              changed={maskChange}
              zipCode
            />
            <Button primary size="large" className="very relaxed" content="Confirm" disabled={!form.meta.isValid || inProgress} />
            <Modal.Actions className="signup-actions">
              <p><Link to="/dashboard/setup" onClick={close}>I’ll finish this later</Link></p>
            </Modal.Actions>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
