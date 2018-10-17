import React from 'react';
import { observer } from 'mobx-react';
import { Button, Modal, Divider, Header, Form, Message } from 'semantic-ui-react';
import { USER_TITLE } from '../../../../../../services/constants/user';
import { FormInput, FormSelect, AutoComplete, MaskedInput, FormDropDown } from '../../../../../../theme/form';
import { CipErrors, ListErrors } from '../../../../../../theme/shared';

import { US_STATES } from '../../../../../../constants/account';

const LegalDetails = observer(({
  form, change, close, autoComplete, name, inProgress, errors, onSubmit, maskChange,
}) => (
  <Modal size="mini" open closeIcon onClose={close}>
    <Modal.Header className="center-align signup-header">
      <Header as="h3">Welcome {name}</Header>
      <p>Let’s get you set up with a NextSeed investment <br /> account.</p>
      <Divider />
      <p>
          Federal regulations require us to verify your legal<br />
          identity. We use state-of-the-art security measures<br /> to protect your information.
      </p>
    </Modal.Header>
    <Modal.Content className="signup-content">
      {errors &&
      <Message error textAlign="left">
        <ListErrors errors={errors.message ? [errors.message] : [errors]} />
      </Message>
        }
      {form.response.qualifiers &&
      <Message error>
        <CipErrors errorsList={form.response.qualifiers} />
      </Message>
        }
      <Form onSubmit={onSubmit}>
        <Form.Group widths="equal">
          <FormSelect
            containerwidth={8}
            name="title"
            fielddata={form.fields.title}
            options={USER_TITLE}
            changed={change}
          />
          {
              ['firstLegalName', 'lastLegalName'].map(field => (
                <FormInput
                  key={field}
                  type="text"
                  name={field}
                  fielddata={form.fields[field]}
                  changed={change}
                />
              ))
            }
        </Form.Group>
        <AutoComplete
          name="residentalStreet"
          fielddata={form.fields.residentalStreet}
          onplaceselected={autoComplete}
          changed={change}
          placeHolder="Street Address, City, State, Zip"
        />
        <Form.Group widths="equal">
          <FormInput
            key="city"
            type="text"
            name="city"
            fielddata={form.fields.city}
            changed={change}
          />
          {/* <FormSelect
            key="state"
            name="state"
            fielddata={form.fields.state}
            options={US_STATES}
            changed={change}
          /> */}
          <FormDropDown
            name="state"
            fielddata={form.fields.state}
            options={US_STATES}
            search
            selection
            compact
            placeholder="NY"
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
        </Form.Group>
        <Form.Group widths="equal">
          <MaskedInput
            name="phoneNumber"
            type="tel"
            fielddata={form.fields.phoneNumber}
            format="###-###-####"
            changed={maskChange}
            phoneNumber
          />
          <MaskedInput
            name="dateOfBirth"
            fielddata={form.fields.dateOfBirth}
            format="##/##/####"
            changed={maskChange}
            dateOfBirth
          />
        </Form.Group>
        <MaskedInput
          name="ssn"
          fielddata={form.fields.ssn}
          ssn
          changed={maskChange}
        />
        <div className="center-align">
          <Button.Group vertical>
            <Button loading={inProgress} size="large" color="green" className="relaxed" >Verify my identity</Button>
            <Button type="button" className="link-button cancel-link" onClick={close}>I’ll finish this later</Button>
          </Button.Group>
        </div>
      </Form>
    </Modal.Content>
  </Modal>
));

export default LegalDetails;
