import React from 'react';
import { Form, Header, Divider } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

@inject('businessStore')
@observer
export default class FilerInformation extends React.Component {
  handleChange = (e, { name, value }) => {
    this.props.businessStore.setFilerInfo(name, value);
  }

  render() {
    const { filerInformation } = this.props.businessStore;
    return (
      <div>
        <Divider section />
        <Header as="h1">Filer Information</Header>
        <Form.Group widths="equal">
          <Form.Input
            placeholder="Filer CIK"
            label="Filer CIK"
            name="filerCik"
            defaultValue={filerInformation.filerCik.value}
            onChange={this.handleChange}
            className="column"
            width={8}
          />
          <Form.Input
            placeholder="Filer CCC"
            label="Filer CCC"
            name="filerCcc"
            defaultValue={filerInformation.filerCcc.value}
            onChange={this.handleChange}
            className="column"
            width={8}
          />
        </Form.Group>
        <Form.Group inline>
          <Form.Radio
            label="Live"
            value="LIVE"
            name="liveTestFlag"
            onChange={this.handleChange}
          />
          <Form.Radio
            label="Test"
            value="TEST"
            name="liveTestFlag"
            onChange={this.handleChange}
          />
        </Form.Group>
        <Form.Group inline>
          <Form.Checkbox
            label="Would you like a Return Copy?"
            name="returnCopyFlag"
            onChange={this.props.handleChange}
          />
          <Form.Checkbox
            label="Would you like a Return Copy?"
            name="returnCopyFlag"
            onChange={this.props.handleChange}
          />
        </Form.Group>
        <Form.Input
          placeholder="Name"
          label="Name"
          name="contactName"
          defaultValue={filerInformation.contactName.value}
          onChange={this.handleChange}
        />
        <Form.Input
          placeholder="Phone Number"
          label="Phone Number"
          name="contactPhone"
          defaultValue={filerInformation.contactPhone.value}
          onChange={this.handleChange}
        />
        <Form.Input
          placeholder="Email"
          label="Email"
          name="contactEmail"
          defaultValue={filerInformation.contactEmail.value}
          onChange={this.handleChange}
        />
        <Form.Checkbox
          label="Would you like a Return Copy?"
          name="returnCopyFlag"
          onChange={this.props.handleChange}
        />
      </div>
    );
  }
}
