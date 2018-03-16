import React from 'react';
import { Form, Button, Icon } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import DatePicker from 'react-datepicker';

const PersonalSignature = observer(props => (
  <div>
    <div>
      {props.signaturePersons.map(personData => (
        <div key={personData.id}>
          <Button icon dataid={personData.id} onClick={props.handleDeleteClick}>
            <Icon name="remove" size="mini" />
          </Button>
          <Form.Group widths="3">
            <Form.Input
              dataid={personData.id}
              label={personData.personSignature.label}
              placeholder={personData.personSignature.label}
              name={personData.personSignature.key}
              value={personData.personSignature.value}
              onChange={props.handleChange}
            />
            <Form.Input
              dataid={personData.id}
              label={personData.personTitle.label}
              placeholder={personData.personTitle.label}
              name={personData.personTitle.key}
              value={personData.personTitle.value}
              onChange={props.handleChange}
            />
            <div className="field three wide">
              { /* eslint-disable jsx-a11y/label-has-for */ }
              <label>Signature Date</label>
              <DatePicker
                dataid={personData.id}
                placeholderText="Signature Date"
                name={personData.signatureDate.key}
                dateFormat="MM-DD-YYYY"
                selected={personData.signatureDate.value}
                onChange={props.handleDateChange}
              />
            </div>
          </Form.Group>
        </div>
      ))}
    </div>
  </div>
));

export default PersonalSignature;
