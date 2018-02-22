import React from 'react';
import { Divider, Form, Grid, Header } from 'semantic-ui-react';

const IssuerInformation = props => (
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
        defaultValue={props.nameOfIssuer}
        onChange={props.handleInputChange}
        width={8}
      />
      <p>Legal Status of Issuer</p>
      <Form.Input
        placeholder="Form"
        label="Form"
        name="legalStatusForm"
        defaultValue={props.legalStatusForm}
        onChange={props.handleInputChange}
        width={8}
      />
      <Form.Input
        placeholder="Jurisdiction of Incorporation/Organization"
        label="Jurisdiction of Incorporation/Organization"
        name="jurisdictionOrganization"
        defaultValue={props.jurisdictionOrganization}
        onChange={props.handleInputChange}
        width={8}
      />
      <Form.Input
        placeholder="Date of Incorporation/Organization"
        label="Date of Incorporation/Organization"
        name="dateIncorporation"
        defaultValue={props.dateIncorporation}
        onChange={props.handleInputChange}
        width={8}
      />
      <p>Physical Address of issuer</p>
      <Form.Input
        placeholder="Address 1"
        label="Address Line 1"
        name="street1"
        defaultValue={props.street1}
        onChange={props.handleInputChange}
        width={8}
      />
      <Form.Input
        placeholder="City"
        label="City"
        name="city"
        defaultValue={props.city}
        onChange={props.handleInputChange}
        width={8}
      />
      <Form.Input
        placeholder="State/Country"
        label="State/Country"
        name="stateOrCountry"
        defaultValue={props.stateOrCountry}
        onChange={props.handleInputChange}
        width={8}
      />
      <Form.Input
        placeholder="Zip"
        label="Mailing Zip/ Zip Code"
        name="zipCode"
        defaultValue={props.zipCode}
        onChange={props.handleInputChange}
        width={8}
      />
      <Form.Input
        placeholder="Website of Issuer"
        label="Website of Issuer"
        name="issuerWebsite"
        defaultValue={props.issuerWebsite}
        onChange={props.handleInputChange}
        width={8}
      />
      <p>Intermediary through which the Offering will be Conducted</p>
      <Form.Input
        placeholder="CIK Number of Intermediary"
        label="CIK"
        name="commissionCik"
        defaultValue={props.commissionCik}
        onChange={props.handleInputChange}
        width={8}
      />
      <Form.Input
        placeholder="Company Name"
        label="Company Name"
        name="companyName"
        defaultValue={props.companyName}
        onChange={props.handleInputChange}
        width={8}
      />
      <Form.Input
        placeholder="Commission File Numbe"
        label="Commission File Numbe"
        name="commissionFileNumber"
        defaultValue={props.commissionFileNumber}
        onChange={props.handleInputChange}
        width={8}
      />
      <Form.Input
        placeholder="CRD Number"
        label="CRD Number"
        name="crdNumber"
        defaultValue={props.crdNumber}
        onChange={props.handleInputChange}
        width={8}
      />
    </Grid.Column>
  </Grid>
);

export default IssuerInformation;
