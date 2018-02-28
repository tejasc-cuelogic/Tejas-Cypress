import React from 'react';
import { inject, observer } from 'mobx-react';
import { Divider, Header, Form } from 'semantic-ui-react';

import PersonalSignature from '../../components/PersonalSignature';

@inject('businessStore')
@observer
export default class Signature extends React.Component {
  handleChange = (e, { name, value }) => {
    this.props.businessStore.setSignatureInfo(name, value);
  }
  handlePersonalSignatureChange = (e, { name, value, dataId }) => {
    this.props.businessStore.changePersonalSignature(name, dataId, value);
  }
  handleAdd = () => this.props.businessStore.addNewPersonalSignature();

  render() {
    const { signature } = this.props.businessStore;

    return (
      <div>
        <Divider section />
        <Header as="h1" textAlign="left">Signature</Header>
        <Form.Group widths="3">
          <Form.Input
            label={signature.issuer.label}
            name={signature.issuer.key}
            defaultValue={signature.issuer.value}
            onChange={this.handleChange}
          />
          <Form.Input
            label={signature.issuerSignature.label}
            name={signature.issuerSignature.key}
            defaultValue={signature.issuerSignature.value}
            onChange={this.handleChange}
          />
          <Form.Input
            label={signature.issuerTitle.label}
            name={signature.issuerTitle.key}
            defaultValue={signature.issuerTitle.value}
            onChange={this.handleChange}
          />
          <PersonalSignature
            signaturePerson={signature.signaturePerson}
            handleChange={this.handlePersonalSignatureChange}
          />
        </Form.Group>
      </div>
    );
  }
}
