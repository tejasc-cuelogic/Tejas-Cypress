import React from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Button, Modal, Divider, Header, Form, Message, Dimmer, Loader } from 'semantic-ui-react';
import { USER_TITLE } from '../../../../../../services/constants/user';
import { FormInput, FormSelect, AutoComplete, MaskedInput, FormDropDown } from '../../../../../../theme/form';
import { CipErrors, ListErrors } from '../../../../../../theme/shared';

import { US_STATES_FOR_INVESTOR } from '../../../../../../constants/account';

const LegalDetails = observer(({
  form, change, close, autoComplete, name, inProgress, errors, onSubmit, maskChange,
}) => (
  <Modal size="mini" open closeIcon onClose={close} closeOnEscape={false} closeOnDimmerClick={false}>
    <Modal.Header className="center-align signup-header">
      <Header as="h3" title={name} className="greeting">Welcome {name}</Header>
      <p>Let’s create your NextSeed investment account.</p>
      <Divider section />
      <p>
        Federal regulations require us to verify your legal identity.
        We use state-of-the-art security measures to protect your information.
      </p>
    </Modal.Header>
    <Modal.Content className="signup-content">
      <Dimmer className="fullscreen" active={inProgress}>
        <Loader active={inProgress} >
        Please wait...<br /><br /> We are verifying your identity. This can take up to a minute.
        </Loader>
      </Dimmer>
      <Form error onSubmit={onSubmit}>
        <Form.Group widths="equal">
          <FormSelect
            containerwidth={8}
            name="title"
            placeholder="Select"
            fielddata={form.fields.title}
            options={USER_TITLE}
            changed={change}
          />
          {['firstLegalName', 'lastLegalName'].map(field => (
            <FormInput
              key={field}
              type="text"
              name={field}
              fielddata={form.fields[field]}
              changed={change}
              showerror
            />
          ))}
        </Form.Group>
        <AutoComplete
          name="residentalStreet"
          fielddata={form.fields.residentalStreet}
          onplaceselected={autoComplete}
          changed={change}
          placeHolder="Street Address, City, State, Zip"
          showerror
        />
        <FormInput
          key="streetTwo"
          type="text"
          name="streetTwo"
          fielddata={form.fields.streetTwo}
          changed={change}
          showerror
        />
        <Form.Group widths={2}>
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
            options={US_STATES_FOR_INVESTOR}
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
            showerror
          />
          <MaskedInput
            name="phoneNumber"
            type="tel"
            fielddata={form.fields.phoneNumber}
            format="(###) ###-####"
            changed={maskChange}
            phoneNumber
            showerror
          />
          <MaskedInput
            name="dateOfBirth"
            fielddata={form.fields.dateOfBirth}
            format="##/##/####"
            changed={maskChange}
            dateOfBirth
            showerror
          />
          <MaskedInput
            name="ssn"
            fielddata={form.fields.ssn}
            ssn
            changed={maskChange}
            showerror
          />
        </Form.Group>
        {errors &&
          <Message error className="mt-30">
            <ListErrors errors={errors.message ? [errors.message] : [errors]} />
          </Message>
        }
        {form.response.qualifiers &&
          <Message error className="mt-30">
            <CipErrors errorsList={form.response.qualifiers} />
          </Message>
        }
        <div className="center-align mt-30">
          <Button primary size="large" className="very relaxed" content="Verify my identity" />
        </div>
      </Form>
    </Modal.Content>
    <Modal.Actions className="signup-actions">
      <p><Link to="/app/summary" onClick={close}>I’ll finish this later</Link></p>
    </Modal.Actions>
  </Modal>
));

export default LegalDetails;
