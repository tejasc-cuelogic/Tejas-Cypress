import React, { Component } from 'react';
import { Header, Form, Divider } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FileUploaderLarge } from '../../../../components/form/FormElements';

@inject('iraAccountStore')
@observer
export default class Identity extends Component {
  render() {
    const { formIdentity, identityChange } = this.props.iraAccountStore;
    return (
      <div>
        <Header as="h1" textAlign="center">Confirm your identity and upload your drivers license</Header>
        <Header as="h4" textAlign="center">Lorem psum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore</Header>
        <Divider section hidden />
        <Form className="file-uploader-large">
          <FileUploaderLarge
            name="driversLicence"
            fielddata={formIdentity.fields.driversLicence}
            uploadDocument={identityChange}
          />
        </Form>
        <Divider section hidden />
        <p className="center-align">As a regulated financial service company operating in the US we are periodically
          required to identify users on the  platform. That’s why lorem ipsum dolor sit amet
        </p>
      </div>
    );
  }
}
