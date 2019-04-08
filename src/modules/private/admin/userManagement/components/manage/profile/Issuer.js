import React, { Component } from 'react';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import { Header, Form, Divider } from 'semantic-ui-react';
import { FormInput, MaskedInput } from '../../../../../../../theme/form';

@inject('userDetailsStore')
@observer
export default class Issuer extends Component {
  state = { displayMode: true };
  componentWillMount() {
    this.props.userDetailsStore.setFormData('USER_BASIC', false);
  }
  render() {
    const { detailsOfUser, USER_BASIC, formChange } = this.props.userDetailsStore;
    const formName = 'USER_BASIC';
    const details = toJS({ ...detailsOfUser.data.user });
    const { displayMode } = this.state;
    return (
      <Form>
        <Header as="h4">
          Profile Info
        </Header>
        <Header as="h6">Personal info</Header>
        <Form.Group widths={4}>
          {
          ['firstName', 'lastName'].map(field => (
            <FormInput
              key={field}
              name={field}
              fielddata={USER_BASIC.fields[field]}
              changed={(e, result) => formChange(e, result, formName)}
              displayMode={displayMode}
            />
          ))
          }
          <MaskedInput
            key="number"
            name="number"
            fielddata={USER_BASIC.fields.number}
            changed={(values, name) => formChange(values, formName, name)}
            phoneNumber
            format="(###) ###-####"
            displayMode={displayMode}
          />
          <FormInput
            key="address"
            name="address"
            fielddata={USER_BASIC.fields.address}
            changed={(e, result) => formChange(e, result, formName)}
            displayMode={displayMode}
          />
        </Form.Group>
        <Divider />
        <Header as="h6">Mailing Address</Header>
        <Form.Group widths={4}>
          {
          ['street', 'city', 'state', 'zipCode'].map(field => (
            <FormInput
              key={field}
              name={field}
              fielddata={USER_BASIC.fields[field]}
              changed={(e, result) => formChange(e, result, formName)}
              displayMode={displayMode}
            />
            ))
          }
        </Form.Group>
        <Divider />
        <Header as="h6">MFA</Header>
        <Form.Group widths={4}>
          <Form.Input type="password" fluid label="Password" placeholder="Password" value="Demopassword123" readOnly className="display-only" />
          <Form.Input
            fluid
            label="Send verification codes to"
            placeholder="Send verification codes to"
            value={details.mfaMode === 'EMAIL' ? 'Email ID' : 'Phone number'}
            readOnly
            className="display-only"
          />
        </Form.Group>
      </Form>
    );
  }
}
