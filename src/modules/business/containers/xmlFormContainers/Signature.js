import React from 'react';
import { inject, observer } from 'mobx-react';
import { Card, Header, Form, Button, Divider } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom'; // Redirect

import PersonalSignature from '../../components/PersonalSignature';
import businessActions from '../../../../actions/business';
import validationActions from '../../../../actions/validation';
import { FormInput } from './../../../../components/form/FormElements';
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
    const {
      formSignatureInfo,
      signatureInfoChange,
      xmlSubmissionStatus,
    } = this.props.businessStore;
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
            xmlSubmissionStatus={xmlSubmissionStatus}
          />
          <Divider hidden />
          {
            xmlSubmissionStatus === XML_STATUSES.draft &&
            <div>
              <Button color="grey" compact onClick={this.handleAdd}>Add</Button>
            </div>
          }
        </Card>
      </div>
    );
  }
}
