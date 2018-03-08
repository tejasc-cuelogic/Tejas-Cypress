import React from 'react';
import { Divider, Form, Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import DatePicker from 'react-datepicker';

import {
  OFFERED_SECURITIES,
  OVER_SUBSCRIPTION_ALLOCATION_TYPES,
} from '../../../../constants/business';
import validationActions from '../../../../actions/validation';

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
  getSubscriptionDescClass = () => (
    this.offeringInformation.overSubscriptionAllocationType.value === 'Other' &&
      this.offeringInformation.overSubscriptionAccepted.value === 'Y'
  )

  getSubscriptionTypeClass = () => this.offeringInformation.overSubscriptionAccepted.value === 'N'

  getOtherSecurityClass = () => this.offeringInformation.securityOfferedType.value !== 'Other'

  getSecurityOfferedClass = () => this.offeringInformation.securityOfferedType.value === 'Debt'

  offeringInformation = this.props.businessStore.offeringInformation;

  handleChange = (e, { name, value }) => {
    validationActions.validateOfferingInfoField(name, value);
  }

  handleDateChange = (date) => {
    validationActions.validateOfferingInfoField('deadlineDate', date);
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
          error={!!this.offeringInformation.compensationAmount.error}
          onChange={this.handleChange}
        />
        <Form.TextArea
          label={LABEL1}
          name="financialInterest"
          defaultValue={this.offeringInformation.financialInterest.value}
          error={!!this.offeringInformation.financialInterest.error}
          onChange={this.handleChange}
        />
        <Form.Group widths="equal">
          <Form.Select
            fluid
            search
            placeholder="Security Type"
            label="Type of Security Offered"
            name="securityOfferedType"
            defaultValue={this.offeringInformation.securityOfferedType.value}
            options={OFFERED_SECURITIES}
            onChange={this.handleChange}
          />
          <Form.Input
            placeholder="Other Description"
            label="Other Description"
            name="securityOfferedOtherDesc"
            defaultValue={this.offeringInformation.securityOfferedOtherDesc.value}
            error={!!this.offeringInformation.securityOfferedOtherDesc.error}
            onChange={this.handleChange}
            disabled={this.getOtherSecurityClass()}
          />
          <Form.Input
            placeholder="No. of securities offered"
            label="No. of securities offered"
            name="noOfSecurityOffered"
            defaultValue={this.offeringInformation.noOfSecurityOffered.value}
            error={this.offeringInformation.noOfSecurityOffered.error}
            onChange={this.handleChange}
            disabled={this.getSecurityOfferedClass()}
          />
          <Form.Input
            placeholder="Price"
            label="Price"
            name="price"
            defaultValue={this.offeringInformation.price.value}
            error={this.offeringInformation.price.error}
            onChange={this.handleChange}
            disabled={this.getSecurityOfferedClass()}
          />
          <Form.Input
            placeholder="Price"
            label="Price (or Method for Determining Price)"
            name="priceDeterminationMethod"
            defaultValue={this.offeringInformation.priceDeterminationMethod.value}
            error={!!this.offeringInformation.priceDeterminationMethod.error}
            onChange={this.handleChange}
            disabled={this.getSecurityOfferedClass()}
          />
        </Form.Group>
        <Form.Input
          label="Target Offering Amount"
          name="offeringAmount"
          defaultValue={this.offeringInformation.offeringAmount.value}
          error={!!this.offeringInformation.offeringAmount.error}
          onChange={this.handleChange}
        />
        <Form.Group>
          <div className="field">
            <h5>Is oversubscription Accepted?</h5>
            <Form.Group inline>
              <Form.Radio
                label="Yes"
                value="Y"
                name="overSubscriptionAccepted"
                checked={this.offeringInformation.overSubscriptionAccepted.value === 'Y'}
                onChange={this.handleChange}
              />
              <Form.Radio
                label="No"
                value="N"
                name="overSubscriptionAccepted"
                checked={this.offeringInformation.overSubscriptionAccepted.value === 'N'}
                onChange={this.handleChange}
              />
            </Form.Group>
          </div>
          <Form.Select
            fluid
            search
            label="If yes, disclose how oversubscriptions will be allocated"
            name="overSubscriptionAllocationType"
            defaultValue={this.offeringInformation.overSubscriptionAllocationType.value}
            options={OVER_SUBSCRIPTION_ALLOCATION_TYPES}
            onChange={this.handleChange}
            disabled={this.getSubscriptionTypeClass()}
          />
          <Form.Input
            label="Other Description"
            placeholder="Other Description"
            name="descOverSubscription"
            defaultValue={this.offeringInformation.descOverSubscription.value}
            error={!!this.offeringInformation.descOverSubscription.error}
            onChange={this.handleChange}
            disabled={!this.getSubscriptionDescClass()}
          />
        </Form.Group>
        <Form.Group>
          <Form.Input
            label="Deadline to reach the Target Offering Amount"
            name="maximumOfferingAmount"
            width="13"
            defaultValue={this.offeringInformation.maximumOfferingAmount.value}
            error={!!this.offeringInformation.maximumOfferingAmount.error}
            onChange={this.handleChange}
          />
          <div className="field three wide">
            { /* eslint-disable jsx-a11y/label-has-for */ }
            <label>Deadline Date</label>
            <DatePicker
              id="deadlinedate"
              placeholderText="Deadline Date"
              dateFormat="MM-DD-YYYY"
              selected={this.offeringInformation.deadlineDate.value}
              onChange={this.handleDateChange}
            />
          </div>
        </Form.Group>
      </div>
    );
  }
}
