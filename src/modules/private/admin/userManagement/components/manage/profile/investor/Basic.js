import React, { Component } from 'react';
import { toJS } from 'mobx';
import { withRouter, Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Icon, Form, Divider, Button } from 'semantic-ui-react';
import { FormInput, MaskedInput } from '../../../../../../../../theme/form';

@inject('userDetailsStore')
@withRouter
@observer
export default class Basic extends Component {
  state = { displayMode: true };
  componentWillMount() {
    this.props.userDetailsStore.setFormData('USER_BASIC', false);
    this.props.userDetailsStore.setAddressCheck();
  }
  render() {
    const {
      detailsOfUser, USER_BASIC, formChange, isAddressSkip, toggleAddressVerification,
    } = this.props.userDetailsStore;
    const formName = 'USER_BASIC';
    const details = toJS({ ...detailsOfUser.data.user });
    const { displayMode } = this.state;
    return (
      <Form>
        <Header as="h4">
          Basic Profile Info
          <Button.Group floated="right">
            <Link to={this.props.match.url} className="link mr-10"><small><Icon className="ns-pencil" /> Edit profile data</small></Link>
            <Button compact onClick={() => toggleAddressVerification()} color={isAddressSkip ? 'green' : 'blue'}>{isAddressSkip ? 'Force Address Check' : 'Skip Address Check'}</Button>
          </Button.Group>
        </Header>
        <Header as="h6">Personal Info</Header>
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
            format="###-###-####"
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
        <Form.Group widths={4}>
          {
          ['firstLegalName', 'lastLegalName'].map(field => (
            <FormInput
              key={field}
              name={field}
              fielddata={USER_BASIC.fields[field]}
              changed={(e, result) => formChange(e, result, formName)}
              displayMode={displayMode}
            />
            ))
          }
          {
          ['ssn', 'dateOfBirth'].map(field => (
            <MaskedInput
              name={field}
              fielddata={USER_BASIC.fields[field]}
              changed={formChange}
              ssn={field === 'ssn'}
              dateOfBirth={field === 'dateOfBirth'}
              displayMode={displayMode}
            />
            ))
          }
        </Form.Group>
        <Divider />
        <Header as="h6">Mailing Address</Header>
        <Form.Group widths={4}>
          <Form.Input fluid label="Address" placeholder="Address" value="32, East Square Complex" readOnly className="display-only" />
          <Form.Input fluid label="City" placeholder="City" value="New York" readOnly className="display-only" />
          <Form.Input fluid label="State" placeholder="State" value="New York" readOnly className="display-only" />
          <Form.Input fluid label="ZIP Code" placeholder="ZIP Code" value="12458" readOnly className="display-only" />
        </Form.Group>
        <Header as="h6">Legal Address</Header>
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
