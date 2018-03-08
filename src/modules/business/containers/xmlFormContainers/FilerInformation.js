import React from 'react';
import { Form, Header, Divider } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import validationActions from '../../../../actions/validation';

@inject('businessStore')
@observer
export default class FilerInformation extends React.Component {
  handleChange = (e, { name, value }) => validationActions.validateFilerInfoField(name, value)

  handleCheckboxChange = (e, { name }) => {
    this.props.businessStore.togglefilerCheckbox(name);
  }

  render() {
    const { filerInformation } = this.props.businessStore;
    return (
      <div>
        <Divider section />
        <Header as="h1">Filer Information</Header>
        <Form.Group>
          <Form.Input
            placeholder="Filer CIK"
            label="Filer CIK"
            name="filerCik"
            defaultValue={filerInformation.filerCik.value}
            onChange={this.handleChange}
            className="column"
            error={!!filerInformation.filerCik.error}
            width={8}
          />
          <Form.Input
            placeholder="Filer CCC"
            label="Filer CCC"
            name="filerCcc"
            defaultValue={filerInformation.filerCcc.value}
            onChange={this.handleChange}
            className="column"
            error={!!filerInformation.filerCcc.error}
            width={8}
          />
        </Form.Group>
        <Form.Group inline>
          <Form.Radio
            label="Live"
            value="LIVE"
            name="liveTestFlag"
            checked={filerInformation.liveTestFlag.value === 'LIVE'}
            onChange={this.handleChange}
          />
          <Form.Radio
            label="Test"
            value="TEST"
            name="liveTestFlag"
            checked={filerInformation.liveTestFlag.value === 'TEST'}
            onChange={this.handleChange}
          />
        </Form.Group>
        <Form.Group inline>
          <Form.Checkbox
            label="Would you like a Return Copy?"
            name="returnCopyFlag"
            checked={filerInformation.returnCopyFlag.value}
            onChange={this.handleCheckboxChange}
          />
          <Form.Checkbox
            label="Is this an electronic copy of an official filing submitted in paper format in connection with a hardship exemption?"
            name="confirmingCopyFlag"
            checked={filerInformation.confirmingCopyFlag.value}
            onChange={this.handleCheckboxChange}
          />
        </Form.Group>
        <Form.Input
          placeholder="Name"
          label="Name"
          name="contactName"
          defaultValue={filerInformation.contactName.value}
          error={!!filerInformation.contactName.error}
          onChange={this.handleChange}
        />
        <Form.Input
          placeholder="Phone Number"
          label="Phone Number"
          name="contactPhone"
          defaultValue={filerInformation.contactPhone.value}
          error={!!filerInformation.contactPhone.error}
          onChange={this.handleChange}
        />
        <Form.Input
          placeholder="Email"
          label="Email"
          name="contactEmail"
          defaultValue={filerInformation.contactEmail.value}
          error={!!filerInformation.contactEmail.error}
          onChange={this.handleChange}
        />
        <Form.Checkbox
          label="Notify via Filing Website only?"
          name="overrideInternetFlag"
          checked={filerInformation.overrideInternetFlag.value}
          onChange={this.handleCheckboxChange}
        />
      </div>
    );
  }
}
