import React from 'react';
import _ from 'lodash';
import { inject, observer } from 'mobx-react';
import { Divider, Header, Form } from 'semantic-ui-react';

@inject('businessStore')
@observer
export default class Signature extends React.Component {
  handleChange = (e, { name, value }) => {
    this.props.businessStore.setSignatureInfo(name, value);
  }

  render() {
    const { signature } = this.props.businessStore;
    return (
      <div>
        <Divider section />
        <Header as="h1" textAlign="left">Signature</Header>
        <Form.Group widths="3">
          {_.map(signature, field => (
            <Form.Input
              label={field.label}
              name={field.key}
              defaultValue={field.value}
              onChange={this.handleChange}
              key={field.key}
            />
          ))}
        </Form.Group>
      </div>
    );
  }
}
