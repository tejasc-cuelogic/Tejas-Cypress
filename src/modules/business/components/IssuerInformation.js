import React from 'react';
import { Divider, Form, Grid, Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

@inject('businessStore')
@observer
export default class IssuerInformation extends React.Component {
  render() {
    const { issuerInformation } = this.props.businessStore;
    return (
      <Grid
        textAlign="left"
        verticalAlign="middle"
      >
        <Grid.Column>
          <Header as="h1" textAlign="left">Issuer Information</Header>
          <Divider section />
          <Form.Input
            placeholder="Name of Issuer"
            label="Name of Issuer"
            name="nameOfIssuer"
            defaultValue={issuerInformation.nameOfIssuer.value}
            onChange={this.props.handleInputChange}
            width={8}
          />
          <p>Legal Status of Issuer</p>
          <Form.Input
            placeholder="Form"
            label="Form"
            name="legalStatusForm"
            defaultValue={issuerInformation.legalStatusForm.value}
            onChange={this.props.handleInputChange}
            width={8}
          />
          <Form.Input
            placeholder="Jurisdiction of Incorporation/Organization"
            label="Jurisdiction of Incorporation/Organization"
            name="jurisdictionOrganization"
            defaultValue={issuerInformation.jurisdictionOrganization.value}
            onChange={this.props.handleInputChange}
            width={8}
          />
          <Form.Input
            placeholder="Date of Incorporation/Organization"
            label="Date of Incorporation/Organization"
            name="dateIncorporation"
            defaultValue={issuerInformation.dateIncorporation.value}
            onChange={this.props.handleInputChange}
            width={8}
          />
          <p>Physical Address of issuer</p>
          <Form.Input
            placeholder="Address 1"
            label="Address Line 1"
            name="street1"
            defaultValue={issuerInformation.street1.value}
            onChange={this.props.handleInputChange}
            width={8}
          />
          <Form.Input
            placeholder="City"
            label="City"
            name="city"
            defaultValue={issuerInformation.city.value}
            onChange={this.props.handleInputChange}
            width={8}
          />
          <Form.Input
            placeholder="State/Country"
            label="State/Country"
            name="stateOrCountry"
            defaultValue={issuerInformation.stateOrCountry.value}
            onChange={this.props.handleInputChange}
            width={8}
          />
          <Form.Input
            placeholder="Zip"
            label="Mailing Zip/ Zip Code"
            name="zipCode"
            defaultValue={issuerInformation.zipCode.value}
            onChange={this.props.handleInputChange}
            width={8}
          />
          <Form.Input
            placeholder="Website of Issuer"
            label="Website of Issuer"
            name="issuerWebsite"
            defaultValue={issuerInformation.issuerWebsite.value}
            onChange={this.props.handleInputChange}
            width={8}
          />
          <p>Intermediary through which the Offering will be Conducted</p>
          <Form.Input
            placeholder="CIK Number of Intermediary"
            label="CIK"
            name="commissionCik"
            defaultValue={issuerInformation.commissionCik.value}
            onChange={this.props.handleInputChange}
            width={8}
          />
          <Form.Input
            placeholder="Company Name"
            label="Company Name"
            name="companyName"
            defaultValue={issuerInformation.companyName.value}
            onChange={this.props.handleInputChange}
            width={8}
          />
          <Form.Input
            placeholder="Commission File Numbe"
            label="Commission File Numbe"
            name="commissionFileNumber"
            defaultValue={issuerInformation.commissionFileNumber.value}
            onChange={this.props.handleInputChange}
            width={8}
          />
          <Form.Input
            placeholder="CRD Number"
            label="CRD Number"
            name="cardNumber"
            defaultValue={issuerInformation.cardNumber.value}
            onChange={this.props.handleInputChange}
            width={8}
          />
        </Grid.Column>
      </Grid>
    );
  }
}
