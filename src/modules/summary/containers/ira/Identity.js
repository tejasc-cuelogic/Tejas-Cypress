import React, { Component } from 'react';
import { Header, Form, Divider } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FileUploaderLarge } from '../../../../theme/form/FormElements';

@inject('iraAccountStore')
@observer
export default class Identity extends Component {
  render() {
    const { formIdentity, identityChange } = this.props.iraAccountStore;
    return (
      <div>
        <Header as="h1" textAlign="center">Confirm your identity and upload your <br /> Driver’s License, state-issued ID, or U.S. <br /> passport</Header>
        <Divider section hidden />
        <Form className="file-uploader-large">
          <FileUploaderLarge
            name="identityDoc"
            fielddata={formIdentity.fields.identityDoc}
            uploadDocument={identityChange}
          />
        </Form>
        <Divider section hidden />
        <p className="center-align">As a regulated financial service company operating in the U.S., we are we are periodically required to identify users on the  platform. That’s why lorem ipsum dolor sit amet
        </p>
      </div>
    );
  }
}
