import React from 'react';
import { Form, Card, Divider, Button, Icon } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { withRouter } from 'react-router-dom'; // Redirect

import { US_STATES, LEGAL_FORM_TYPES } from '../../../../constants/business';
import validationActions from '../../../../actions/validation';
import busiessActions from '../../../../actions/business';

@inject('businessStore')
@withRouter
@observer
export default class IssuerInformation extends React.Component {
  componentWillUnmount() {
    this.props.businessStore.setXmlError();
  }
  getOtherDescriptionClass = () => this.issuerInformation.legalStatusForm.value !== 'Other'

  issuerInformation = this.props.businessStore.issuerInformation;

  handleChange = (e, { name, value }) => this.props.businessStore.setIssuerInfo(name, value)

  handleOnBlur = e => validationActions.validateIssuerInfoField(e.target.name)

  /* eslint-disable no-underscore-dangle */
  handleDateChange = (date) => {
    validationActions.validateIssuerInfoField('dateIncorporation', date);
  }

  handleSelectChange = (e, { dataidentifier, name, value }) => {
    this.props.businessStore.setCountry(dataidentifier, name, value);
  }

  handleBusinessCancel = () => {
    this.props.history.push(`/app/business/${this.props.match.params.businessId}`);
  }

  handleIssuerInformationSubmit = (e) => {
    e.preventDefault();
    const { issuerInformation } = this.props.businessStore;
    busiessActions.validateIssuerInfo(issuerInformation);
  }

  render() {
    const { issuerInformation } = this.props.businessStore;
    return (
      <div>
        <Card fluid className="form-card">
          <Form.Input
            placeholder="Name of Issuer"
            label="Name of Issuer"
            name="nameOfIssuer"
            value={issuerInformation.nameOfIssuer.value}
            error={!!issuerInformation.nameOfIssuer.error}
            onChange={this.handleChange}
            onBlur={this.handleOnBlur}
          />
          <h4>Legal Status of Issuer</h4>
          <Form.Group widths="equal">
            <Form.Select
              fluid
              search
              placeholder="Form"
              label="Form"
              name="legalStatusForm"
              value={issuerInformation.legalStatusForm.value}
              error={!!issuerInformation.legalStatusForm.error}
              onChange={this.handleChange}
              options={LEGAL_FORM_TYPES}
            />
            <Form.Input
              placeholder="Other Description"
              label="Other Description"
              name="legalStatusOtherDesc"
              disabled={this.getOtherDescriptionClass()}
              value={issuerInformation.legalStatusOtherDesc.value}
              error={!!issuerInformation.legalStatusOtherDesc.error}
              onChange={this.handleChange}
              onBlur={this.handleOnBlur}
            />
            <Form.Select
              fluid
              search
              placeholder="Jurisdiction of Incorporation/Organization"
              label="Jurisdiction of Incorporation/Organization"
              name="jurisdictionOrganization"
              dataidentifier="issuerInformation"
              options={US_STATES}
              value={issuerInformation.jurisdictionOrganization.value}
              onChange={this.handleSelectChange}
            />
            <div className="nine wide field">
              { /* eslint-disable jsx-a11y/label-has-for */ }
              <label>Date Incorporation</label>
              <DatePicker
                showMonthDropdown
                showYearDropdown
                placeholderText="Date of Incorporation/Organization"
                dateFormat="MM-DD-YYYY"
                maxDate={moment()}
                selected={issuerInformation.dateIncorporation.value}
                onChange={this.handleDateChange}
              />
            </div>
          </Form.Group>
        </Card>
        <Card fluid className="form-card">
          <h4>Physical Address of issuer</h4>
          <Form.Group>
            <Form.Input
              placeholder="Address Line 1"
              label="Address Line 1"
              name="street1"
              value={issuerInformation.street1.value}
              onChange={this.handleChange}
              onBlur={this.handleOnBlur}
              error={!!issuerInformation.street1.error}
              width={8}
            />
            <Form.Input
              placeholder="Address Line 2"
              label="Address Line 2"
              name="street2"
              value={issuerInformation.street2.value}
              onChange={this.handleChange}
              onBlur={this.handleOnBlur}
              error={!!issuerInformation.street2.error}
              width={8}
            />
          </Form.Group>
          <Form.Group>
            <Form.Input
              placeholder="City"
              label="City"
              name="city"
              value={issuerInformation.city.value}
              onChange={this.handleChange}
              onBlur={this.handleOnBlur}
              error={!!issuerInformation.city.error}
              width={8}
            />
            <Form.Select
              fluid
              search
              placeholder="State/Country"
              label="State/Country"
              name="stateOrCountry"
              dataidentifier="issuerInformation"
              options={US_STATES}
              value={issuerInformation.stateOrCountry.value}
              onChange={this.handleSelectChange}
              width={8}
            />
          </Form.Group>
          <Form.Group>
            <Form.Input
              placeholder="Zip"
              label="Mailing Zip/ Zip Code"
              name="zipCode"
              value={issuerInformation.zipCode.value}
              error={!!issuerInformation.zipCode.error}
              onChange={this.handleChange}
              onBlur={this.handleOnBlur}
              width={8}
            />
            <Form.Input
              placeholder="Website of Issuer"
              label="Website of Issuer"
              name="issuerWebsite"
              value={issuerInformation.issuerWebsite.value}
              error={!!issuerInformation.issuerWebsite.error}
              onChange={this.handleChange}
              onBlur={this.handleOnBlur}
              width={8}
            />
          </Form.Group>
        </Card>
        <Card fluid className="form-card">
          <h4>Intermediary through which the Offering will be Conducted</h4>
          <Form.Group>
            <Form.Input
              placeholder="CIK Number of Intermediary"
              label="CIK"
              name="commissionCik"
              value={issuerInformation.commissionCik.value}
              error={!!issuerInformation.commissionCik.error}
              onChange={this.handleChange}
              onBlur={this.handleOnBlur}
              width={8}
            />
            <Form.Input
              placeholder="Company Name"
              label="Company Name"
              name="companyName"
              value={issuerInformation.companyName.value}
              error={!!issuerInformation.companyName.error}
              onChange={this.handleChange}
              onBlur={this.handleOnBlur}
              width={8}
            />
          </Form.Group>
          <Form.Group>
            <Form.Input
              placeholder="Commission File Numbe"
              label="Commission File Numbe"
              name="commissionFileNumber"
              value={issuerInformation.commissionFileNumber.value}
              error={!!issuerInformation.companyName.error}
              onChange={this.handleChange}
              onBlur={this.handleOnBlur}
              width={8}
            />
            <Form.Input
              placeholder="CRD Number"
              label="CRD Number"
              name="crdNumber"
              value={issuerInformation.crdNumber.value}
              error={!!issuerInformation.crdNumber.error}
              onChange={this.handleChange}
              onBlur={this.handleOnBlur}
              width={8}
            />
          </Form.Group>
        </Card>
        <Divider hidden />
        <div className="right-align">
          <Button color="green" size="large" className="pull-left" onClick={() => this.props.businessStore.setXmlActiveTabId(0)}>
            <Icon name="chevron left" />
            Back
          </Button>
          <Button size="large" onClick={this.handleBusinessCancel}>Cancel</Button>
          <Button color="green" size="large" onClick={this.handleIssuerInformationSubmit}>
            Save & Next <Icon name="chevron right" />
          </Button>
        </div>
      </div>
    );
  }
}
