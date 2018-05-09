import React from 'react';
import { Form, Button, Input } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import moment from 'moment';
import DatePicker from 'react-datepicker';

const PersonalSignature = observer(props => (
  <div>
    <div>
      {props.signaturePersons.map(personData => (
        <div key={personData.id}>
          <Form.Group widths="3">
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
                onChange={props.handleChange}
              >
                <Button icon={{ className: 'ns-close' }} color="red" dataid={personData.id} onClick={props.handleDeleteClick} />
                <input />
              </Input>
            </div>
            <Form.Input
              dataid={personData.id}
              label={personData.personTitle.label}
              placeholder={personData.personTitle.label}
              name={personData.personTitle.key}
              value={personData.personTitle.value}
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
              />
            </div>
          </Form.Group>
        </div>
      ))}
    </div>
  </div>
));

export default PersonalSignature;
