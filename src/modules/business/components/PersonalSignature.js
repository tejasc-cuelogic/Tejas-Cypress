import React from 'react';
import { Form, Button, Input } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import moment from 'moment';
import DatePicker from 'react-datepicker';

const PersonalSignature = observer(props => (
  <div>
    {props.signaturePersons.map(personData => (
      <Form.Group widths="3" key={personData.id}>
        <div className="field">
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
            error={!!personData.personSignature.error}
            onChange={props.handleChange}
          >
            <Button icon="ns-close" color="red" dataid={personData.id} onClick={props.handleDeleteClick} />
            <input />
          </Input>
        </div>
        <Form.Input
          dataid={personData.id}
          label={personData.personTitle.label}
          placeholder={personData.personTitle.label}
          name={personData.personTitle.key}
          value={personData.personTitle.value}
          error={!!personData.personTitle.error}
          onChange={props.handleChange}
        />
        <div className="field">
          { /* eslint-disable jsx-a11y/label-has-for */ }
          <label>Signature Date</label>
          <DatePicker
            showMonthDropdown
            showYearDropdown
            dataid={personData.id}
            placeholderText="Signature Date"
            name={personData.signatureDate.key}
            maxDate={moment()}
            dateFormat="MM-DD-YYYY"
            selected={personData.signatureDate.value}
            onChange={props.handleDateChange}
            error={!!personData.signatureDate.error}
          />
        </div>
      </Form.Group>
    ))}
  </div>
));

export default PersonalSignature;
