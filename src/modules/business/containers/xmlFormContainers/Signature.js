import React from 'react';
import { inject, observer } from 'mobx-react';
import { Card, Header, Form, Button, Divider, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom'; // Redirect
import _ from 'lodash';

import PersonalSignature from '../../components/PersonalSignature';
import businessActions from '../../../../actions/business';
import validationActions from '../../../../actions/validation';
import Helper from '../../../../helper/utility';
import {
  XML_STATUSES,
} from '../../../../constants/business';

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
    validationActions.validatePersonalSig(name, dataid);
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

  handleSignatureSubmit = (e) => {
    e.preventDefault();
    const { signature } = this.props.businessStore;
    businessActions.validateSignatureInfo(signature);

    if (this.props.businessStore.canSubmitSigntureForm &&
      !_.includes(this.props.businessStore.canSubmitSignaturePersonsForm, false)) {
      businessActions.submitXMLInformation('signature')
        .then((data) => {
          this.props.businessStore.setXmlError();
          this.props.businessStore.setXmlActiveTabId(5);
          if (this.props.businessStore.xmlSubmissionId === undefined) {
            const { xmlSubmissionId } = data.upsertXmlInformation;
            this.props.businessStore.setXmlSubmissionId(xmlSubmissionId);
          }
          Helper.toast('Signature information submitted successfully', 'success');
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  render() {
    const { signature, xmlSubmissionStatus } = this.props.businessStore;
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
          <Button
            color="green"
            size="large"
            className="pull-left"
            onClick={() => this.props.businessStore.setXmlActiveTabId(3)}
          >
            <Icon name="chevron left" />
            Back
          </Button>
          <Button size="large" onClick={this.handleBusinessCancel}>Cancel</Button>
          {
            xmlSubmissionStatus !== XML_STATUSES.completed &&
            <Button color="green" size="large" onClick={this.handleSignatureSubmit}>
              Save & Next <Icon name="chevron right" />
            </Button>
          }
        </div>
      </div>
    );
  }
}
