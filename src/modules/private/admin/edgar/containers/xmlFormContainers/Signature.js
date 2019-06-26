import React from 'react';
import { inject, observer } from 'mobx-react';
import { Card, Header, Form, Button, Divider } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom'; // Redirect

import PersonalSignature from '../../components/PersonalSignature';
import { businessActions } from '../../../../../../services/actions';
import { FormInput } from '../../../../../../theme/form';
import {
  XML_STATUSES,
} from '../../../../../../constants/business';

@inject('businessStore')
@withRouter
@observer
export default class Signature extends React.Component {
  componentWillUnmount() {
    this.props.businessStore.setXmlError();
  }

  handlePersonalSignatureChange = (e, { name, value, dataid }) => {
    this.props.businessStore.changePersonalSignature(name, dataid, value, true);
  }

  handleAdd = () => {
    businessActions.addPersonalSignature();
  }

  changedDate = (e, { name, value, dataid }) => {
    this.props.businessStore.changePersonalSignature(name, dataid, value, true);
  };

  handleDelete = (e, { dataid }) => this.props.businessStore.deletePersonalSignature(dataid);

  render() {
    const {
      formSignatureInfo,
      signatureInfoChange,
      xmlSubmissionStatus,
    } = this.props.businessStore;
    return (
      <div>
        <Card fluid className="form-card">
          <Header as="h5" textAlign="left">Issuer Signature</Header>
          <Form.Group widths="3">
            {
              ['issuer', 'issuerSignature', 'issuerTitle'].map(field => (
                <FormInput
                  type="text"
                  key={field}
                  name={field}
                  fielddata={formSignatureInfo.fields[field]}
                  changed={signatureInfoChange}
                />
              ))
            }
          </Form.Group>
        </Card>
        <Card fluid className="form-card">
          <Header as="h5" textAlign="left">Personal Signatures</Header>
          <PersonalSignature
            signaturePersons={formSignatureInfo.fields.signaturePersons}
            handleChange={this.handlePersonalSignatureChange}
            handleAddClick={this.handleAdd}
            handleDeleteClick={this.handleDelete}
            handleOnBlurSigPer={this.handlePersonalSignatureOnBlur}
            xmlSubmissionStatus={xmlSubmissionStatus}
            changedDate={this.changedDate}
          />
          <Divider hidden />
          {
            xmlSubmissionStatus === XML_STATUSES.draft
            && (
<div>
              <Button primary compact onClick={this.handleAdd}>Add</Button>
            </div>
            )
          }
        </Card>
      </div>
    );
  }
}
