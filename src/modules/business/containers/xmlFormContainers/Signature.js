import React from 'react';
import { inject, observer } from 'mobx-react';
import { Card, Header, Form, Button, Divider } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom'; // Redirect

import PersonalSignature from '../../components/PersonalSignature';
import businessActions from '../../../../actions/business';
import validationActions from '../../../../actions/validation';
import { FormInput } from './../../../../components/form/FormElements';

@inject('businessStore')
@withRouter
@observer
export default class Signature extends React.Component {
  componentWillUnmount() {
    this.props.businessStore.setXmlError();
  }
  handleChange = (e, { name, value }) => this.props.businessStore.setSignatureInfo(name, value)

  handleOnBlur = e => validationActions.validateSignatureInfo(e.target.name);

  handlePersonalSignatureChange = (e, { name, value, dataid }) => {
    this.props.businessStore.changePersonalSignature(name, dataid, value);
  }

  handlePersonalSignatureOnBlur = (e, dataId) => {
    validationActions.validatePersonalSig(e.target.name, dataId);
  }

  handleAdd = () => {
    businessActions.addPersonalSignature();
  }
  handleDelete = (e, { dataid }) => this.props.businessStore.deletePersonalSignature(dataid);

  handleBusinessCancel = () => {
    this.props.history.push(`/app/business/${this.props.match.params.businessId}`);
  }

  render() {
    const { formSignatureInfo, signatureInfoChange } = this.props.businessStore;
    return (
      <div>
        <Card fluid className="form-card">
          <Header as="h3" textAlign="left">Issuer Signature</Header>
          <Form.Group widths="3">
            <FormInput
              type="text"
              fielddata={formSignatureInfo.fields.issuer}
              name="issuer"
              changed={signatureInfoChange}
            />
            <FormInput
              type="text"
              fielddata={formSignatureInfo.fields.issuerSignature}
              name="issuerSignature"
              changed={signatureInfoChange}
            />
            <FormInput
              type="text"
              fielddata={formSignatureInfo.fields.issuerTitle}
              name="issuerTitle"
              changed={signatureInfoChange}
            />
            {/* <Form.Input
              label={signature.issuer.label}
              name={signature.issuer.key}
              value={signature.issuer.value}
              error={!!signature.issuer.error}
              onChange={this.handleChange}
              onBlur={this.handleOnBlur}
            />
            <Form.Input
              label={signature.issuerSignature.label}
              name={signature.issuerSignature.key}
              value={signature.issuerSignature.value}
              error={!!signature.issuerSignature.error}
              onChange={this.handleChange}
              onBlur={this.handleOnBlur}
            />
            <Form.Input
              label={signature.issuerTitle.label}
              name={signature.issuerTitle.key}
              value={signature.issuerTitle.value}
              error={!!signature.issuerTitle.error}
              onChange={this.handleChange}
              onBlur={this.handleOnBlur}
            /> */}
          </Form.Group>
        </Card>
        <Card fluid className="form-card">
          <Header as="h3" textAlign="left">Personal Signatures</Header>
          <PersonalSignature
            signaturePersons={formSignatureInfo.fields.signaturePersons}
            handleChange={this.handlePersonalSignatureChange}
            handleAddClick={this.handleAdd}
            handleDeleteClick={this.handleDelete}
            handleOnBlurSigPer={this.handlePersonalSignatureOnBlur}
          />
          <Divider hidden />
          <div>
            <Button color="grey" compact onClick={this.handleAdd}>Add</Button>
          </div>
        </Card>
      </div>
    );
  }
}
