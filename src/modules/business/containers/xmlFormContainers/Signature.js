import React from 'react';
import { inject, observer } from 'mobx-react';
import { Card, Header, Form, Button, Divider, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom'; // Redirect

import PersonalSignature from '../../components/PersonalSignature';
import businessActions from '../../../../actions/business';
import validationActions from '../../../../actions/validation';

@inject('businessStore')
@withRouter
@observer
export default class Signature extends React.Component {
  handleChange = (e, { name, value }) => this.props.businessStore.setSignatureInfo(name, value)

  handleOnBlur = e => validationActions.validateSignatureInfo(e.target.name)

  handlePersonalSignatureChange = (e, { name, value, dataid }) => {
    this.props.businessStore.changePersonalSignature(name, dataid, value);
  }

  handleDateChange = (e, test) => {
    console.log(test);
    // this.props.businessStore.changePersonalSignature(test);
  }
  handleAdd = () => {
    businessActions.addPersonalSignature();
  }
  handleDelete = (e, { dataid }) => this.props.businessStore.deletePersonalSignature(dataid);

  handleBusinessCancel = () => {
    this.props.history.push(`/app/business/${this.props.match.params.businessId}`);
  }

  render() {
    const { signature } = this.props.businessStore;
    return (
      <div>
        <Card fluid className="form-card">
          <Header as="h3" textAlign="left">Issuer Signature</Header>
          <Form.Group widths="3">
            <Form.Input
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
            />
          </Form.Group>
        </Card>
        <Card fluid className="form-card">
          <Header as="h3" textAlign="left">Personal Signatures</Header>
          <PersonalSignature
            signaturePersons={signature.signaturePersons}
            handleChange={this.handlePersonalSignatureChange}
            handleAddClick={this.handleAdd}
            handleDeleteClick={this.handleDelete}
            handleDateChange={this.handleDateChange}
          />
          <div>
            <Button color="grey" compact onClick={this.handleAdd}>Add</Button>
          </div>
        </Card>
        <Divider hidden />
        <div className="right-align">
          <Button color="green" size="large" className="pull-left">
            <Icon name="chevron left" />
            Back
          </Button>
          <Button size="large" onClick={this.handleBusinessCancel}>Cancel</Button>
          <Button color="green" size="large">
            Save
          </Button>
        </div>
      </div>
    );
  }
}
