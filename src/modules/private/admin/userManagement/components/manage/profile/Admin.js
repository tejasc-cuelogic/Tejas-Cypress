/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Form, Divider } from 'semantic-ui-react';
import { FormInput, MaskedInput } from '../../../../../../../theme/form';

@inject('userDetailsStore')
@withRouter
@observer
export default class Admin extends Component {
  state = { displayMode: true };
  componentWillMount() {
    this.props.userDetailsStore.setFormData('USER_BASIC', false);
  }
  render() {
    const { USER_BASIC, formChange } = this.props.userDetailsStore;
    const formName = 'USER_BASIC';
    const { displayMode } = this.state;
    return (
      <Form>
        <Header as="h4">
          User{"'"}s profile data
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
        <Header as="h6">Role and Capabilities</Header>
        <Form.Group widths={2}>
          <Form.Input fluid label="Role" placeholder="Address" value="Admin" readOnly className="display-only" />
          <div className="field display-only">
            <label>Capabilities</label>
            <div className="ui fluid input">
              {USER_BASIC.fields.capabilities.value.join(', ')}
            </div>
          </div>
        </Form.Group>
      </Form>
    );
  }
}
