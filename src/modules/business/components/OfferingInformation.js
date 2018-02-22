import React from 'react';
import { Divider, Form, Grid, Header } from 'semantic-ui-react';

const LABEL = 'Amount of compensation to be paid to the intermediary,' +
          'whether as a dollar amount or a percentage of the offering amount, ' +
          'or a good faith estimate if the exact amount is not available at the' +
          'time of the filing, for conducting the offering, including the amount' +
          'of referral and any other fees associated with the offering';

const LABEL1 = 'Any other financial interest in the issuer held by the intermediary, ' +
'or any arrangement for the intermediary to acquire such an interest';

const OfferingInformation = props => (
  <Grid
    textAlign="left"
    verticalAlign="middle"
  >
    <Grid.Column>
      <Header as="h1" textAlign="left">Offering Information</Header>
      <Divider section />
      <Form.TextArea
        label={LABEL}
        name="compensationAmount"
        defaultValue={props.compensationAmount}
        onChange={props.handleInputChange}
      />
      <Form.TextArea
        label={LABEL1}
        name="financialInterest"
        defaultValue={props.financialInterest}
        onChange={props.handleInputChange}
      />
      <Form.Input
        label="Type of Security Offered"
        name="securityOfferedType"
        defaultValue={props.securityOfferedType}
        onChange={props.handleInputChange}
      />
      <Form.Input
        label="Price (or Method for Determining Price)"
        name="priceDeterminationMethod"
        defaultValue={props.priceDeterminationMethod}
        onChange={props.handleInputChange}
      />
      <Form.Input
        label="Target Offering Amount"
        name="offeringAmount"
        defaultValue={props.offeringAmount}
        onChange={props.handleInputChange}
      />
      <Form.Input
        label="Maximum Offering Amount (if different from Target Offering Amount)"
        name="priceDeterminationMethod"
        defaultValue={props.priceDeterminationMethod}
        onChange={props.handleInputChange}
      />
      <Form.Input
        label="Oversubscriptions Accepted"
        name="overSubscriptionAccepted"
        defaultValue={props.overSubscriptionAccepted}
        onChange={props.handleInputChange}
      />

      <Form.Input
        label="If yes, disclose how oversubscriptions will be allocated"
        name="overSubscriptionAllocationType"
        defaultValue={props.overSubscriptionAllocationType}
        onChange={props.handleInputChange}
      />
      <Form.Input
        label="Deadline to reach the Target Offering Amount"
        name="maximumOfferingAmount"
        defaultValue={props.maximumOfferingAmount}
        onChange={props.handleInputChange}
      />
      <Form.Input
        label="Deadline Date"
        name="deadlineDate"
        defaultValue={props.deadlineDate}
        onChange={props.handleInputChange}
      />
    </Grid.Column>
  </Grid>
);

export default OfferingInformation;
