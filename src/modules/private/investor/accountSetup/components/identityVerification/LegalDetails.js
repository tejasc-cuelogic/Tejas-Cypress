import React from 'react';
import { observer } from 'mobx-react';
import { Button, Modal, Divider, Header, Form, Message } from 'semantic-ui-react';
import { USER_TITLE } from '../../../../../../services/constants/user';
import {
  FormInput, FormSelect, FormDatePicker, MaskedInput, AutoComplete, MaskedInput2,
} from '../../../../../../theme/form';
import { CipErrors, ListErrors } from '../../../../../../theme/shared';

const LegalDetails = observer(({
  form, change, dobChange, close, autoComplete, name, inProgress, errors, onSubmit,
}) => (
  <Modal size="mini" open closeIcon onClose={close}>
    <Modal.Header className="center-align signup-header">
      <Header as="h2">Welcome {name}</Header>
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
          <ListErrors errors={[errors]} />
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
        />
        <Form.Group widths="equal">
          {
            ['city', 'state', 'zipCode'].map(field => (
              field !== 'zipCode' ? (
                <FormInput
                  key={field}
                  type="text"
                  name={field}
                  fielddata={form.fields[field]}
                  changed={change}
                />) : (
                  <MaskedInput2
                    key={field}
                    name={field}
                    fielddata={form.fields[field]}
                    changed={change}
                    zipCode
                  />)
            ))
          }
        </Form.Group>
        <Form.Group widths="equal">
          <MaskedInput
            name="phoneNumber"
            fielddata={form.fields.phoneNumber}
            mask="999-999-9999"
            changed={change}
          />
          <FormDatePicker
            name="dateOfBirth"
            fielddata={form.fields.dateOfBirth}
            selected={form.fields.dateOfBirth.value}
            changed={dobChange}
          />
        </Form.Group>
        <MaskedInput
          name="ssn"
          fielddata={form.fields.ssn}
          mask="999-99-9999"
          changed={change}
        />
        <div className="center-align">
          <Button loading={inProgress} size="large" color="green" className="very relaxed" disabled={!form.meta.isValid}>Verify my identity</Button>
        </div>
        <div className="center-align">
          <Button className="cancel-link" onClick={close}>I’ll finish this later</Button>
        </div>
      </Form>
    </Modal.Content>
  </Modal>
));

export default LegalDetails;
