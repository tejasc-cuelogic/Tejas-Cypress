/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { toJS } from 'mobx';
import { Grid, Dropdown, Form, Label, Icon, List } from 'semantic-ui-react';
import moment from 'moment';
import FormDatePicker from '../../../../../../theme/form/src/FormDatePicker';
import camelCase from 'lodash/camelCase';
import startCase from 'lodash/startCase';

export const DropdownFilter = props => (
  <Grid.Column width={props.width || 3} className="field">
    <label>{props.name}</label>
    <Dropdown
      name={props.keyName || camelCase(props.name)}
      onChange={props.change}
      className="inverted"
      value={toJS(props.value) || ((props.isMultiple) ? [] : '')}
      placeholder="Select Filter"
      fluid
      multiple={props.isMultiple}
      selection
      options={props.options}
    />
    <div className="dropdown-effect">{props.name}</div>
  </Grid.Column>
);

export const DateRangeFilter = props => (
  <Grid.Column width={props.width || 4} className="field">
    <label>{props.label}</label>
    <Form>
      <Form.Group widths="equal">
        <FormDatePicker
          selected={props.filters.startDate}
          placeholder="MM/DD/YYYY"
          maxdate={moment()}
          onchange={props.changeStart}
        />
        <FormDatePicker
          selected={props.filters.endDate}
          placeholder="MM/DD/YYYY"
          maxdate={moment()}
          onchange={props.changeEnd}
        />
      </Form.Group>
    </Form>
  </Grid.Column>
);

export const AppliedFilters = (props) => {
  const data = { ...props.filters };
  if (data.startDate && data.endDate) {
    const startDate = moment(data.startDate).format('MM-DD-YYYY');
    const endDate = moment(data.startDate).format('MM-DD-YYYY');
    data.creationDate = `${startDate} - ${endDate}`;
  }
  delete data.startDate;
  delete data.endDate;
  const filterKeys = Object.keys(data);
  if (filterKeys.length < 1) {
    return <List.Item as="a" to="">No filters applied.</List.Item>;
  }
  return (
    <span>
      {
        filterKeys.map(f => (
          <Label key={f} as="a">
            {`${startCase(f)}: ${data[f]}`}
            <Icon name="delete" onClick={() => props.click(f)} />
          </Label>
        ))
      }
    </span>
  );
};
