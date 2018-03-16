import React from 'react';
import { Divider, Form, Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import DatePicker from 'react-datepicker';
// import moment from 'moment';

import { US_STATES, LEGAL_FORM_TYPES } from '../../../../constants/business';
import validationActions from '../../../../actions/validation';

@inject('businessStore')
@observer
export default class IssuerInformation extends React.Component {
  getOtherDescriptionClass = () => this.issuerInformation.legalStatusForm.value !== 'Other'

  issuerInformation = this.props.businessStore.issuerInformation;

  handleChange = (e, { name, value }) => {
    validationActions.validateIssuerInfoField(name, value);
  }

  /* eslint-disable no-underscore-dangle */
  handleDateChange = (date) => {
    validationActions.validateIssuerInfoField('dateIncorporation', date);
  }

  handleSelectChange = (e, { dataidentifier, name, value }) => {
    this.props.businessStore.setCountry(dataidentifier, name, value);
  }

  render() {
    const { issuerInformation } = this.props.businessStore;
    return (
      <div>
        <Divider section />
        <Header as="h1">Issuer Information</Header>
        <Form.Input
          placeholder="Name of Issuer"
          label="Name of Issuer"
          name="nameOfIssuer"
          value={issuerInformation.nameOfIssuer.value}
          error={!!issuerInformation.nameOfIssuer.error}
          onChange={this.handleChange}
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
            width={8}
          />
          <DatePicker
            disabledDays={{ after: new Date() }}
            placeholderText="Date of Incorporation/Organization"
            dateFormat="MM-DD-YYYY"
            selected={issuerInformation.dateIncorporation.value}
            onChange={this.handleDateChange}
          />
        </Form.Group>
        <h4>Physical Address of issuer</h4>
        <Form.Group>
          <Form.Input
            placeholder="Address Line 1"
            label="Address Line 1"
            name="street1"
            value={issuerInformation.street1.value}
            onChange={this.handleChange}
            error={!!issuerInformation.street1.error}
            width={8}
          />
          <Form.Input
            placeholder="Address Line 2"
            label="Address Line 2"
            name="street2"
            value={issuerInformation.street2.value}
            onChange={this.handleChange}
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
            width={8}
          />
          <Form.Input
            placeholder="Website of Issuer"
            label="Website of Issuer"
            name="issuerWebsite"
            value={issuerInformation.issuerWebsite.value}
            error={!!issuerInformation.issuerWebsite.error}
            onChange={this.handleChange}
            width={8}
          />
        </Form.Group>
        <h4>Intermediary through which the Offering will be Conducted</h4>
        <Form.Group>
          <Form.Input
            placeholder="CIK Number of Intermediary"
            label="CIK"
            name="commissionCik"
            value={issuerInformation.commissionCik.value}
            error={!!issuerInformation.commissionCik.error}
            onChange={this.handleChange}
            width={8}
          />
          <Form.Input
            placeholder="Company Name"
            label="Company Name"
            name="companyName"
            value={issuerInformation.companyName.value}
            error={!!issuerInformation.companyName.error}
            onChange={this.handleChange}
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
            width={8}
          />
          <Form.Input
            placeholder="CRD Number"
            label="CRD Number"
            name="crdNumber"
            value={issuerInformation.crdNumber.value}
            error={!!issuerInformation.crdNumber.error}
            onChange={this.handleChange}
            width={8}
          />
        </Form.Group>
      </div>
    );
  }
}
