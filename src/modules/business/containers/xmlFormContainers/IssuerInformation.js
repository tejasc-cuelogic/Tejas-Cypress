import React from 'react';
import { Divider, Form, Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

@inject('businessStore')
@observer
export default class IssuerInformation extends React.Component {
  handleChange = (e, { name, value }) => {
    this.props.businessStore.setIssuerInfo(name, value);
  }

  handleSelectChange = (e, { value }) => {
    this.props.businessStore.setCountry(value);
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
          defaultValue={issuerInformation.nameOfIssuer.value}
          onChange={this.handleChange}
        />
        <h4>Legal Status of Issuer</h4>
        <Form.Group widths="equal">
          <Form.Input
            placeholder="Form"
            label="Form"
            name="legalStatusForm"
            defaultValue={issuerInformation.legalStatusForm.value}
            onChange={this.handleChange}
          />
          <Form.Input
            placeholder="Jurisdiction of Incorporation/Organization"
            label="Jurisdiction of Incorporation/Organization"
            name="jurisdictionOrganization"
            defaultValue={issuerInformation.jurisdictionOrganization.value}
            onChange={this.handleChange}
          />
          <Form.Input
            placeholder="Date of Incorporation/Organization"
            label="Date of Incorporation/Organization"
            name="dateIncorporation"
            defaultValue={issuerInformation.dateIncorporation.value}
            onChange={this.handleChange}
          />
        </Form.Group>
        <h4>Physical Address of issuer</h4>
        <Form.Group>
          <Form.Input
            placeholder="Address Line 1"
            label="Address Line 1"
            name="street1"
            defaultValue={issuerInformation.street1.value}
            onChange={this.handleChange}
            width={8}
          />
          <Form.Input
            placeholder="Address Line 2"
            label="Address Line 2"
            name="street2"
            defaultValue={issuerInformation.street1.value}
            onChange={this.handleChange}
            width={8}
          />
        </Form.Group>
        <Form.Group>
          <Form.Input
            placeholder="City"
            label="City"
            name="city"
            defaultValue={issuerInformation.city.value}
            onChange={this.handleChange}
            width={8}
          />
          <Form.Input
            placeholder="State/Country"
            label="State/Country"
            name="stateOrCountry"
            defaultValue={issuerInformation.stateOrCountry.value}
            onChange={this.handleChange}
            width={8}
          />
        </Form.Group>
        <Form.Group>
          <Form.Input
            placeholder="Zip"
            label="Mailing Zip/ Zip Code"
            name="zipCode"
            defaultValue={issuerInformation.zipCode.value}
            onChange={this.handleChange}
            width={8}
          />
          <Form.Input
            placeholder="Website of Issuer"
            label="Website of Issuer"
            name="issuerWebsite"
            defaultValue={issuerInformation.issuerWebsite.value}
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
            defaultValue={issuerInformation.commissionCik.value}
            onChange={this.handleChange}
            width={8}
          />
          <Form.Input
            placeholder="Company Name"
            label="Company Name"
            name="companyName"
            defaultValue={issuerInformation.companyName.value}
            onChange={this.handleChange}
            width={8}
          />
        </Form.Group>
        <Form.Group>
          <Form.Input
            placeholder="Commission File Numbe"
            label="Commission File Numbe"
            name="commissionFileNumber"
            defaultValue={issuerInformation.commissionFileNumber.value}
            onChange={this.handleChange}
            width={8}
          />
          <Form.Input
            placeholder="CRD Number"
            label="CRD Number"
            name="cardNumber"
            defaultValue={issuerInformation.cardNumber.value}
            onChange={this.handleChange}
            width={8}
          />
        </Form.Group>
      </div>
    );
  }
}
