import React from 'react';
import { Divider, Form, Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import {
  OFFERED_SECURITY,
  OVER_SUBSCRIPTION_ALLOCATION_TYPE,
} from '../../../../constants/business';

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
  getSubscriptionType = () => {
    if (this.offeringInformation.overSubscriptionAccepted.value === 'Yes') {
      return (
        <Form.Select
          fluid
          search
          label="If yes, disclose how oversubscriptions will be allocated"
          name="overSubscriptionAllocationType"
          defaultValue={this.offeringInformation.overSubscriptionAllocationType.value}
          options={OVER_SUBSCRIPTION_ALLOCATION_TYPE}
          onChange={this.handleChange}
        />
      );
    }
    return null;
  }

  offeringInformation = this.props.businessStore.offeringInformation;

  handleChange = (e, { name, value }) => {
    this.props.businessStore.setOfferingInfo(name, value);
  }

  render() {
    return (
      <div>
        <Divider section />
        <Header as="h1">Offering Information</Header>
        <Form.TextArea
          label={LABEL}
          name="compensationAmount"
          defaultValue={this.offeringInformation.compensationAmount.value}
          onChange={this.handleChange}
        />
        <Form.TextArea
          label={LABEL1}
          name="financialInterest"
          defaultValue={this.offeringInformation.financialInterest.value}
          onChange={this.handleChange}
        />
        <Form.Group widths="equal">
          <Form.Select
            fluid
            search
            placeholder="Type of Security Offered"
            label="Type of Security Offered"
            name="securityOfferedType"
            defaultValue={this.offeringInformation.securityOfferedType.value}
            options={OFFERED_SECURITY}
            onChange={this.handleChange}
          />
          <Form.Input
            label="Price (or Method for Determining Price)"
            name="priceDeterminationMethod"
            defaultValue={this.offeringInformation.priceDeterminationMethod.value}
            onChange={this.handleChange}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Input
            label="Target Offering Amount"
            name="offeringAmount"
            defaultValue={this.offeringInformation.offeringAmount.value}
            onChange={this.handleChange}
          />
          <Form.Input
            label="Oversubscriptions Accepted"
            name="overSubscriptionAccepted"
            defaultValue={this.offeringInformation.overSubscriptionAccepted.value}
            onChange={this.handleChange}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Group inline>
            <Form.Radio
              label="Yes"
              value="Yes"
              name="overSubscriptionAccepted"
              checked={this.offeringInformation.overSubscriptionAccepted.value === 'Yes'}
              onChange={this.handleChange}
            />
            <Form.Radio
              label="No"
              value="No"
              name="overSubscriptionAccepted"
              checked={this.offeringInformation.overSubscriptionAccepted.value === 'No'}
              onChange={this.handleChange}
            />
          </Form.Group>
          {this.getSubscriptionType()}
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Input
            label="Deadline to reach the Target Offering Amount"
            name="maximumOfferingAmount"
            defaultValue={this.offeringInformation.maximumOfferingAmount.value}
            onChange={this.handleChange}
          />
          <Form.Input
            label="Deadline Date"
            name="deadlineDate"
            defaultValue={this.offeringInformation.deadlineDate.value}
            onChange={this.handleChange}
          />
        </Form.Group>
      </div>
    );
  }
}
