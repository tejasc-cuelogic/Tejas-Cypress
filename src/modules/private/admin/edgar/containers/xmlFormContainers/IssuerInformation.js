import React from 'react';
import { Form, Card, Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom'; // Redirect
import { US_STATES, LEGAL_FORM_TYPES } from '../../../../../../constants/business';
import { FormInput, FormSelect, MaskedInput } from './../../../../../../theme/form';

@inject('businessStore')
@withRouter
@observer
export default class IssuerInformation extends React.Component {
  componentWillUnmount() {
    this.props.businessStore.setXmlError();
  }

  getOtherDescriptionClass = () => this.props.businessStore.formIssuerInfo.fields.legalStatusForm.value !== 'Other'

  handleSelectChange = (e, {
    dataidentifier,
    dataname,
    name,
    value,
  }) => {
    this.props.businessStore.setCountry(dataidentifier, dataname, name, value);
  }

  render() {
    const { formIssuerInfo, issuerInfoChange, verifyDateIncorporation } = this.props.businessStore;
    return (
      <div>
        <Card fluid className="form-card">
          <FormInput
            type="text"
            fielddata={formIssuerInfo.fields.nameOfIssuer}
            name="nameOfIssuer"
            changed={issuerInfoChange}
          />
          <Header as="h6">Legal Status of Issuer</Header>
          <Form.Group widths="equal">
            <FormSelect
              fielddata={formIssuerInfo.fields.legalStatusForm}
              name="legalStatusForm"
              changed={issuerInfoChange}
              options={LEGAL_FORM_TYPES}
            />
            <FormInput
              type="text"
              fielddata={formIssuerInfo.fields.legalStatusOtherDesc}
              name="legalStatusOtherDesc"
              changed={issuerInfoChange}
              disabled={this.getOtherDescriptionClass()}
            />
            <FormSelect
              fielddata={formIssuerInfo.fields.jurisdictionOrganization}
              name="jurisdictionOrganization"
              dataidentifier="formIssuerInfo"
              dataname="fields"
              changed={issuerInfoChange}
              options={US_STATES}
            />
            <MaskedInput
              name="dateIncorporation"
              fielddata={formIssuerInfo.fields.dateIncorporation}
              format="##/##/####"
              changed={verifyDateIncorporation}
              dateOfBirth
              showerror
            />
          </Form.Group>
        </Card>
        <Card fluid className="form-card">
          <Header as="h5">Physical Address of issuer</Header>
          <Form.Group widths="equal">
            <FormInput
              type="text"
              fielddata={formIssuerInfo.fields.street1}
              name="street1"
              changed={issuerInfoChange}
            />
            <FormInput
              type="text"
              fielddata={formIssuerInfo.fields.street2}
              name="street2"
              changed={issuerInfoChange}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <FormInput
              type="text"
              fielddata={formIssuerInfo.fields.city}
              name="city"
              changed={issuerInfoChange}
            />
            <FormSelect
              fielddata={formIssuerInfo.fields.stateOrCountry}
              name="stateOrCountry"
              dataidentifier="formIssuerInfo"
              dataname="fields"
              changed={issuerInfoChange}
              options={US_STATES}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <FormInput
              type="text"
              fielddata={formIssuerInfo.fields.zipCode}
              name="zipCode"
              changed={issuerInfoChange}
            />
            <FormInput
              type="text"
              fielddata={formIssuerInfo.fields.issuerWebsite}
              name="issuerWebsite"
              changed={issuerInfoChange}
            />
          </Form.Group>
        </Card>
        <Card fluid className="form-card">
          <Header as="h5">Intermediary through which the Offering will be Conducted</Header>
          <Form.Group widths="equal">
            <FormInput
              type="text"
              fielddata={formIssuerInfo.fields.commissionCik}
              name="commissionCik"
              changed={issuerInfoChange}
            />
            <FormInput
              type="text"
              fielddata={formIssuerInfo.fields.companyName}
              name="companyName"
              changed={issuerInfoChange}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <FormInput
              type="text"
              fielddata={formIssuerInfo.fields.commissionFileNumber}
              name="commissionFileNumber"
              changed={issuerInfoChange}
            />
            <FormInput
              type="text"
              fielddata={formIssuerInfo.fields.crdNumber}
              name="crdNumber"
              changed={issuerInfoChange}
            />
          </Form.Group>
        </Card>
      </div>
    );
  }
}
