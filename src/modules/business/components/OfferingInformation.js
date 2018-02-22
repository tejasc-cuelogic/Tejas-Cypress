import React from 'react';
import { Divider, Form, Grid, Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

const LABEL = 'Amount of compensation to be paid to the intermediary,' +
          'whether as a dollar amount or a percentage of the offering amount, ' +
          'or a good faith estimate if the exact amount is not available at the' +
          'time of the filing, for conducting the offering, including the amount' +
          'of referral and any other fees associated with the offering';

const LABEL1 = 'Any other financial interest in the issuer held by the intermediary, ' +
'or any arrangement for the intermediary to acquire such an interest';

@inject('businessStore')
@observer
export default class OfferingInformation extends React.Component {
  render() {
    const { offeringInformation } = this.props.businessStore;
    return (
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
            defaultValue={offeringInformation.compensationAmount.value}
            onChange={this.props.handleInputChange}
          />
          <Form.TextArea
            label={LABEL1}
            name="financialInterest"
            defaultValue={offeringInformation.financialInterest.value}
            onChange={this.props.handleInputChange}
          />
          <Form.Input
            label="Type of Security Offered"
            name="securityOfferedType"
            defaultValue={offeringInformation.securityOfferedType.value}
            onChange={this.props.handleInputChange}
          />
          <Form.Input
            label="Price (or Method for Determining Price)"
            name="priceDeterminationMethod"
            defaultValue={offeringInformation.priceDeterminationMethod.value}
            onChange={this.props.handleInputChange}
          />
          <Form.Input
            label="Target Offering Amount"
            name="offeringAmount"
            defaultValue={offeringInformation.offeringAmount.value}
            onChange={this.props.handleInputChange}
          />
          <Form.Input
            label="Maximum Offering Amount (if different from Target Offering Amount)"
            name="priceDeterminationMethod"
            defaultValue={offeringInformation.priceDeterminationMethod.value}
            onChange={this.props.handleInputChange}
          />
          <Form.Input
            label="Oversubscriptions Accepted"
            name="overSubscriptionAccepted"
            defaultValue={offeringInformation.overSubscriptionAccepted.value}
            onChange={this.props.handleInputChange}
          />

          <Form.Input
            label="If yes, disclose how oversubscriptions will be allocated"
            name="overSubscriptionAllocationType"
            defaultValue={offeringInformation.overSubscriptionAllocationType.value}
            onChange={this.props.handleInputChange}
          />
          <Form.Input
            label="Deadline to reach the Target Offering Amount"
            name="maximumOfferingAmount"
            defaultValue={offeringInformation.maximumOfferingAmount.value}
            onChange={this.props.handleInputChange}
          />
          <Form.Input
            label="Deadline Date"
            name="deadlineDate"
            defaultValue={offeringInformation.deadlineDate.value}
            onChange={this.props.handleInputChange}
          />
        </Grid.Column>
      </Grid>
    );
  }
}
