import React from 'react';
import _ from 'lodash';

import { Divider, Grid, Header, Form } from 'semantic-ui-react';

const Signature = props => (
  <Grid
    textAlign="left"
    verticalAlign="middle"
  >
    <Grid.Column>
      <Header as="h1" textAlign="left">Signature</Header>
      <Divider section />
      {_.map(props.signature, field => (
        <Form.Input
          label={field.label}
          name={field.key}
          defaultValue={field.value}
          onChange={props.handleInputChange}
        />
      ))}
    </Grid.Column>
  </Grid>
);

export default Signature;
