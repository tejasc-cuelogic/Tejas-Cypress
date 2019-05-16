import React, { Component } from 'react';
import { toJS } from 'mobx';
import Aux from 'react-aux';
import { withRouter, Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Icon, Form, Divider, Button } from 'semantic-ui-react';
import { FormInput, MaskedInput, AutoComplete } from '../../../../../../../../theme/form';

@inject('userDetailsStore', 'uiStore')
@withRouter
@observer
export default class Basic extends Component {
  state = { displayMode: true };
  componentWillMount() {
    this.props.userDetailsStore.setFormData('USER_BASIC', false);
    this.props.userDetailsStore.setFormData('USER_PROFILE_ADD_ADMIN_FRM', false);
    this.props.userDetailsStore.setAddressCheck();
  }
  updateMode = (e, val) => {
    e.preventDefault();
    this.props.userDetailsStore.setFormData('USER_BASIC', false, undefined, true);
    this.props.userDetailsStore.setFormData('USER_PROFILE_ADD_ADMIN_FRM', false, undefined, true);
    this.setState({ displayMode: !val });
  }
  updateUserData = (e) => {
    e.preventDefault();
    this.props.userDetailsStore.updateUserProfileForSelectedUser().then(() => {
      this.setState({ displayMode: true });
    })
      .catch(() => this.setState({ displayMode: true }));
  }
  render() {
    const {
      detailsOfUser, USER_BASIC, USER_PROFILE_ADD_ADMIN_FRM, setAddressFieldsForProfile,
      formChange, maskChange, isAddressSkip, toggleAddressVerification,
    } = this.props.userDetailsStore;
    const { inProgress } = this.props.uiStore;
    const formName = 'USER_BASIC';
    const details = toJS({ ...detailsOfUser.data.user });
    const { displayMode } = this.state;
    return (
      <Form loading={inProgress}>
        <Header as="h4">
          Basic Profile Info
          <Button.Group floated="right">
            {this.state.displayMode ?
              <Link to={this.props.match.url} onClick={e => this.updateMode(e, true)} className="link mr-10"><small><Icon className="ns-pencil" /> Edit profile data</small></Link> :
              <Aux>
                <Link to="/" className="link mr-10" onClick={e => this.updateMode(e, false)}><small>Cancel</small></Link>
                {USER_BASIC.meta.isValid && USER_PROFILE_ADD_ADMIN_FRM.meta.isValid &&
                  <Link to="/" className="link mr-10" onClick={e => this.updateUserData(e)}><small><Icon name="save" />Update</small></Link>
                }
              </Aux>
            }
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
            format="(###) ###-####"
            displayMode
          />
          <FormInput
            key="address"
            name="address"
            fielddata={USER_BASIC.fields.address}
            changed={(e, result) => formChange(e, result, formName)}
            displayMode
          />
        </Form.Group>
        <Form.Group widths={4}>
          {
          ['firstLegalName', 'lastLegalName', 'ssn'].map(field => (
            <FormInput
              key={field}
              name={field}
              fielddata={USER_BASIC.fields[field]}
              changed={(e, result) => formChange(e, result, formName)}
              displayMode={field === 'ssn' || displayMode}
            />
            ))
          }
          {/* {!displayMode &&
            <MaskedInput
              name="ssn"
              fielddata={USER_BASIC.fields.ssn}
              changed={formChange}
              ssn
              displayMode={displayMode}
            />
          } */}
          <MaskedInput
            name="dateOfBirth"
            fielddata={USER_BASIC.fields.dateOfBirth}
            changed={(values, field) => maskChange(values, 'USER_BASIC', field)}
            dateOfBirth
            displayMode={displayMode}
          />
        </Form.Group>
        <Divider />
        <Header as="h6">Mailing Address</Header>
        <Form.Group widths={3}>
          <AutoComplete
            readOnly={displayMode}
            displayMode={displayMode}
            name="street"
            fielddata={USER_PROFILE_ADD_ADMIN_FRM.fields.street}
            onplaceselected={places => setAddressFieldsForProfile(places, 'USER_PROFILE_ADD_ADMIN_FRM')}
            changed={(e, result) => formChange(e, result, 'USER_PROFILE_ADD_ADMIN_FRM')}
          />
          {
          ['streetTwo', 'city', 'state'].map(field => (
            <FormInput
              key={field}
              name={field}
              fielddata={USER_PROFILE_ADD_ADMIN_FRM.fields[field]}
              changed={(e, result) => formChange(e, result, 'USER_PROFILE_ADD_ADMIN_FRM')}
              displayMode={displayMode}
            />
            ))
          }
          <MaskedInput
            displayMode={displayMode}
            name="zipCode"
            fielddata={USER_PROFILE_ADD_ADMIN_FRM.fields.zipCode}
            changed={(values, field) => maskChange(values, 'USER_PROFILE_ADD_ADMIN_FRM', field)}
            maxlength="5"
            number
          />
        </Form.Group>
        <Header as="h6">Legal Address</Header>
        <Form.Group widths={3}>
          <AutoComplete
            readOnly={displayMode}
            displayMode={displayMode}
            name="street"
            fielddata={USER_BASIC.fields.street}
            onplaceselected={places => setAddressFieldsForProfile(places, 'USER_BASIC')}
            changed={(e, result) => formChange(e, result, 'USER_BASIC')}
          />
          {
          ['streetTwo', 'city', 'state'].map(field => (
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
            displayMode={displayMode}
            name="zipCode"
            fielddata={USER_BASIC.fields.zipCode}
            changed={(values, field) => maskChange(values, formName, field)}
            maxlength="5"
            number
          />
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
