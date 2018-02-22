import React from 'react';
import _ from 'lodash';

import { Divider, Grid, Header, Form } from 'semantic-ui-react';

const AnnualReportDisclosureRequirements = props => (
  <Grid
    textAlign="left"
    verticalAlign="middle"
  >
    <Grid.Column>
      <Header as="h1" textAlign="left">Annual Report Disclosure Requirements</Header>
      <Divider section />
      <Form size="large">
        {_.map(props.annualReportDisclosureRequirements, field => (
          <Form.Input
            label={field.label}
            name={field.key}
            defaultValue={field.value}
            onChange={props.handleInputChange}
          />
        ))}
      </Form>
    </Grid.Column>
  </Grid>
);

export default AnnualReportDisclosureRequirements;
