import React from 'react';
import { Form, Button, Input } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import moment from 'moment';
import FieldError from './../../../theme/common/FieldError';

import { FormInput, FormDatePicker } from './../../../theme/form/FormElements';

const PersonalSignature = observer(props => (
  <div>
    {props.signaturePersons.map(personData => (
      <Form.Group widths="3" key={personData.id}>
        <Form.Field error={!!personData.personSignature.error}>
          { /* eslint-disable jsx-a11y/label-has-for */ }
          <label>{personData.personSignature.label}</label>
          <Input
            type="text"
            action
            actionPosition="left"
            dataid={personData.id}
            placeholder={personData.personSignature.label}
            name={personData.personSignature.key}
            value={personData.personSignature.value}
            onChange={props.handleChange}
          >
            {
              props.xmlSubmissionStatus === 'DRAFT' &&
              <Button icon="ns-close" color="red" dataid={personData.id} onClick={props.handleDeleteClick} />
            }
            <input />
          </Input>
          {personData.personSignature.error &&
            <FieldError error={personData.personSignature.error} />
          }
        </Form.Field>
        <FormInput
          dataid={personData.id}
          type="text"
          fielddata={personData.personTitle}
          name="personTitle"
          changed={props.handleChange}
        />
        <div className="field">
          <FormDatePicker
            name="signatureDate"
            id="signatureDate"
            maxDate={moment()}
            fielddata={personData.signatureDate}
            selected={personData.signatureDate.value}
          />
        </div>
      </Form.Group>
    ))}
  </div>
));

export default PersonalSignature;
