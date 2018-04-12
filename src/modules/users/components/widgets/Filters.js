import React from 'react';
import { Grid, Dropdown, Form, Input } from 'semantic-ui-react';
import camelCase from 'lodash/camelCase';

export const DropdownFilter = props => (
  <Grid.Column width={3}>
    <h5>{props.name}</h5>
    <Dropdown
      name={props.keyName || camelCase(props.name)}
      onChange={props.change}
      className="inverted"
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
