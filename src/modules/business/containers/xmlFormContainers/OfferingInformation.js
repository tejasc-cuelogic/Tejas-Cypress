import React from 'react';
import { Form, Card, Divider, Button, Icon } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { withRouter } from 'react-router-dom'; // Redirect

import {
  OFFERED_SECURITIES,
  OVER_SUBSCRIPTION_ALLOCATION_TYPES,
  XML_STATUSES,
} from '../../../../constants/business';
import validationActions from '../../../../actions/validation';
import busiessActions from '../../../../actions/business';
import Helper from '../../../../helper/utility';

const LABEL = 'Amount of compensation to be paid to the intermediary,' +
  'whether as a dollar amount or a percentage of the offering amount, ' +
  'or a good faith estimate if the exact amount is not available at the' +
  'time of the filing, for conducting the offering, including the amount' +
  'of referral and any other fees associated with the offering';

const LABEL1 = 'Any other financial interest in the issuer held by the intermediary, ' +
  'or any arrangement for the intermediary to acquire such an interest';

@inject('businessStore')
@withRouter
@observer
export default class OfferingInformation extends React.Component {
  componentWillUnmount() {
    this.props.businessStore.setXmlError();
  }
  getSubscriptionDescClass = () => (
    this.offeringInformation.overSubscriptionAllocationType.value === 'Other' &&
    this.offeringInformation.overSubscriptionAccepted.value === 'Y'
  )

  getSubscriptionTypeClass = () => this.offeringInformation.overSubscriptionAccepted.value === 'N'

  getOtherSecurityClass = () => this.offeringInformation.securityOfferedType.value !== 'Other'

  getSecurityOfferedClass = () => this.offeringInformation.securityOfferedType.value === 'Debt'

  offeringInformation = this.props.businessStore.offeringInformation;

  handleChange = (e, { name, value }) => this.props.businessStore.setOfferingInfo(name, value)

  handleOnBlur = e => validationActions.validateOfferingInfoField(e.target.name)

  handleDateChange = (date) => {
    validationActions.validateOfferingInfoField('deadlineDate', date);
  }

  handleBusinessCancel = () => {
    this.props.history.push(`/app/business/${this.props.match.params.businessId}`);
  }

  handleOfferingInformationSubmit = (e) => {
    e.preventDefault();
    const { offeringInformation } = this.props.businessStore;
    busiessActions.validateOfferingInfo(offeringInformation);

    if (this.props.businessStore.canSubmitOfferingInfoXmlForm) {
      busiessActions.submitXMLInformation('offeringInformation')
        .then((data) => {
          this.props.businessStore.setXmlError();
          this.props.businessStore.setXmlActiveTabId(3);
          if (this.props.businessStore.xmlSubmissionId === undefined) {
            const { xmlSubmissionId } = data.upsertXmlInformation;
            this.props.businessStore.setXmlSubmissionId(xmlSubmissionId);
          }
          Helper.toast('Offering information submitted successfully', 'success');
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  render() {
    const { offeringInformation, xmlSubmissionStatus } = this.props.businessStore;
    return (
      <div>
        <Card fluid className="form-card">
          <Form.TextArea
            label={LABEL}
            name="compensationAmount"
            value={offeringInformation.compensationAmount.value}
            error={!!offeringInformation.compensationAmount.error}
            onChange={this.handleChange}
            onBlur={this.handleOnBlur}
          />
          <Form.TextArea
            label={LABEL1}
            name="financialInterest"
            value={offeringInformation.financialInterest.value}
            error={!!offeringInformation.financialInterest.error}
            onChange={this.handleChange}
            onBlur={this.handleOnBlur}
          />
          <Form.Group>
            <Form.Select
              fluid
              search
              placeholder="Security Type"
              label="Type of Security Offered"
              name="securityOfferedType"
              value={offeringInformation.securityOfferedType.value}
              error={!!offeringInformation.securityOfferedType.error}
              options={OFFERED_SECURITIES}
              onChange={this.handleChange}
              width={3}
            />
            <Form.Input
              placeholder="Other Description"
              label="Other Description"
              name="securityOfferedOtherDesc"
              value={offeringInformation.securityOfferedOtherDesc.value}
              error={!!offeringInformation.securityOfferedOtherDesc.error}
              onChange={this.handleChange}
              onBlur={this.handleOnBlur}
              disabled={this.getOtherSecurityClass()}
              width={3}
            />
            <Form.Input
              placeholder="0.00"
              label="No. of securities offered"
              name="noOfSecurityOffered"
              value={offeringInformation.noOfSecurityOffered.value}
              error={!!offeringInformation.noOfSecurityOffered.error}
              onChange={this.handleChange}
              onBlur={this.handleOnBlur}
              disabled={this.getSecurityOfferedClass()}
              width={3}
            />
            <Form.Input
              placeholder="0.00000"
              label="Price"
              name="price"
              value={offeringInformation.price.value}
              error={!!offeringInformation.price.error}
              onChange={this.handleChange}
              onBlur={this.handleOnBlur}
              disabled={this.getSecurityOfferedClass()}
              width={3}
            />
            <Form.Input
              placeholder="0.00"
              label="Price (or Method for Determining Price)"
              name="priceDeterminationMethod"
              value={offeringInformation.priceDeterminationMethod.value}
              error={!!offeringInformation.priceDeterminationMethod.error}
              onChange={this.handleChange}
              onBlur={this.handleOnBlur}
              width={4}
            />
          </Form.Group>
          <Form.Group>
            <div className="three wide field">
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
              placeholder="Select options"
              label="If yes, disclose how oversubscriptions will be allocated"
              name="overSubscriptionAllocationType"
              value={offeringInformation.overSubscriptionAllocationType.value}
              options={OVER_SUBSCRIPTION_ALLOCATION_TYPES}
              onChange={this.handleChange}
              disabled={this.getSubscriptionTypeClass()}
              error={!!offeringInformation.overSubscriptionAllocationType.error}
              width={5}
            />
            <Form.Input
              label="Other Description"
              placeholder="Other Description"
              name="descOverSubscription"
              value={offeringInformation.descOverSubscription.value}
              error={!!offeringInformation.descOverSubscription.error}
              onChange={this.handleChange}
              onBlur={this.handleOnBlur}
              disabled={!this.getSubscriptionDescClass()}
              width={3}
            />
            <Form.Input
              placeholder="0.00"
              label="Deadline to reach the Target Offering Amount"
              name="maximumOfferingAmount"
              value={offeringInformation.maximumOfferingAmount.value}
              error={!!offeringInformation.maximumOfferingAmount.error}
              onChange={this.handleChange}
              onBlur={this.handleOnBlur}
              disabled={this.getSubscriptionTypeClass()}
              width={5}
            />
          </Form.Group>
          <Form.Group>
            <Form.Input
              placeholder="0.00"
              label="Target Offering Amount"
              name="offeringAmount"
              value={offeringInformation.offeringAmount.value}
              error={!!offeringInformation.offeringAmount.error}
              onChange={this.handleChange}
              onBlur={this.handleOnBlur}
              width={3}
            />
            <div className="three wide field">
              { /* eslint-disable jsx-a11y/label-has-for */}
              <label>Deadline Date</label>
              <DatePicker
                showMonthDropdown
                showYearDropdown
                id="deadlinedate"
                placeholderText="Deadline Date"
                dateFormat="MM-DD-YYYY"
                minDate={moment()}
                selected={this.offeringInformation.deadlineDate.value}
                onChange={this.handleDateChange}
              />
            </div>
          </Form.Group>
        </Card>
        <Divider hidden />
        <div className="right-align">
          <Button color="green" size="large" className="pull-left" onClick={() => this.props.businessStore.setXmlActiveTabId(1)}>
            <Icon name="chevron left" />
            Back
          </Button>
          <Button size="large" onClick={this.handleBusinessCancel}>Cancel</Button>
          {
            xmlSubmissionStatus !== XML_STATUSES.completed &&
            <Button color="green" size="large" onClick={this.handleOfferingInformationSubmit}>
              Save & Next <Icon name="chevron right" />
            </Button>
          }
        </div>
      </div>
    );
  }
}
