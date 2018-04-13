import React from 'react';
import { toJS } from 'mobx';
import { Grid, Dropdown, Form, Input, Label, Icon, List } from 'semantic-ui-react';
import camelCase from 'lodash/camelCase';
import startCase from 'lodash/startCase';

export const DropdownFilter = props => (
  <Grid.Column width={3}>
    <h5>{props.name}</h5>
    <Dropdown
      name={props.keyName || camelCase(props.name)}
      onChange={props.change}
      className="inverted"
      value={toJS(props.value) || []}
      placeholder="Select Filter"
      fluid
      multiple
      selection
      options={props.options}
    />
  </Grid.Column>
);

export const DateRangeFilter = props => (
  <Grid.Column width={4}>
    <h5>{props.label}</h5>
    <Form>
      <Form.Group widths="equal">
        <Form.Field>
          <Input onBlur={props.change} name={`${props.name}_gte`} fluid icon="calendar outline" iconPosition="left" placeholder="DD/MM/YYYY" />
        </Form.Field>
        <Form.Field>
          <Input onBlur={props.change} name={`${props.name}_lte`} fluid icon="calendar outline" iconPosition="left" placeholder="DD/MM/YYYY" />
        </Form.Field>
      </Form.Group>
    </Form>
  </Grid.Column>
);

export const AppliedFilters = (props) => {
  const filterKeys = Object.keys(props.filters);
  if (filterKeys.length < 1) {
    return <List.Item as="a" to="">No filters applied.</List.Item>;
  }
  return (
    <span>
      {
        filterKeys.map(f => (
          <Label key={f} as="a">
            {`${startCase(f)}: ${props.filters[f]}`}
            <Icon name="delete" onClick={() => props.click(f)} />
          </Label>
        ))
      }
    </span>
  );
};
