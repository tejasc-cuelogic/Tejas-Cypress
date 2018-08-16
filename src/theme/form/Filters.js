/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import Aux from 'react-aux';
import { toJS } from 'mobx';
import { Grid, Input, Dropdown, Form, Label, Icon, List, Button } from 'semantic-ui-react';
import moment from 'moment';
import camelCase from 'lodash/camelCase';
import startCase from 'lodash/startCase';
import DatePicker from './src/FormDatePicker';

export const DropdownFilter = props => (
  <Form.Field className="dropdown-field">
    <label>{props.name}</label>
    <Dropdown
      name={props.keyName || camelCase(props.name)}
      onChange={props.change}
      className={props.className}
      value={toJS(props.value) || ((props.isMultiple) ? [] : '')}
      placeholder="Select Filter"
      fluid
      multiple={props.isMultiple}
      selection
      options={props.options}
    />
    <div className="dropdown-effect">{props.name}</div>
  </Form.Field>
);

export const ByKeyword = ({
  w, executeSearch, placeholder, fLabel, requestState, toggleSearch,
}) => (
  <Aux>
    <Grid.Column widescreen={w[0]} largeScreen={w[0]} computer={w[1]} tablet={w[1]} mobile={w[1]}>
      <Form>
        <Form.Field inverted>
          {fLabel && <label className="invisible">{placeholder}</label>}
          <Input fluid onKeyPress={executeSearch} inverted icon={{ className: 'ns-search' }} iconPosition="left" placeholder={placeholder} />
        </Form.Field>
      </Form>
    </Grid.Column>
    <Grid.Column width={3} textAlign="center">
      <span className="filter-count">{requestState && requestState.search ? Object.keys(requestState.search).length : 0}</span>
      <Button icon color="green" onClick={toggleSearch} className="link-button">
        Filters <Icon className="ns-caret-down" />
      </Button>
    </Grid.Column>
  </Aux>
);

export const DateRangeFilter = props => (
  <Form.Field>
    <label>{props.label}</label>
    <Form.Group widths="equal">
      <DatePicker
        selected={props.filters.startDate}
        placeholder="MM/DD/YYYY"
        maxdate={moment()}
        onchange={props.changeStart}
      />
      <DatePicker
        selected={props.filters.endDate}
        placeholder="MM/DD/YYYY"
        maxdate={moment()}
        onchange={props.changeEnd}
      />
    </Form.Group>
  </Form.Field>
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
