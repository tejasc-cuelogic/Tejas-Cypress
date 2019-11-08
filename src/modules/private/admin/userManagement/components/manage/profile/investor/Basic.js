import React, { Component } from 'react';
import { toJS } from 'mobx';
import { get } from 'lodash';
import { withRouter, Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Icon, Form, Divider, Button } from 'semantic-ui-react';
import { FormInput, MaskedInput, AutoComplete } from '../../../../../../../../theme/form';
import CIPInformation from './CIPInformation';
import OtherInformation from '../OtherInformation';
import LockedInformation from '../LockedInformation';
import UserInvestorDetails from '../../../../../../investor/settings/components/UserInvestorDetails';

@inject('userDetailsStore', 'uiStore', 'referralsStore', 'identityStore')
@withRouter
@observer
export default class Basic extends Component {
  constructor(props) {
    super(props);
    this.state = { displayMode: true };
    this.props.userDetailsStore.setFormData('USER_BASIC', false);
    this.props.userDetailsStore.setFormData('USER_PROFILE_ADD_ADMIN_FRM', false);
    this.props.userDetailsStore.setFormData('USER_PROFILE_PREFERRED_INFO_FRM', false);
    this.props.userDetailsStore.setAddressOrPhoneCheck();
  }

  updateMode = (e, val) => {
    e.preventDefault();
    this.props.userDetailsStore.setFormData('USER_BASIC', false, undefined, true, this.state.displayMode);
    this.props.userDetailsStore.setFormData('USER_PROFILE_ADD_ADMIN_FRM', false, undefined, true);
    this.props.userDetailsStore.setFormData('USER_PROFILE_PREFERRED_INFO_FRM', false, undefined, true);
    this.setState({ displayMode: !val });
  }

  updateUserData = (e) => {
    e.preventDefault();
    const ssnValue = this.props.userDetailsStore.USER_BASIC.fields.ssn.value;
    this.props.uiStore.setProgress();
    this.props.identityStore.isSsnExist(ssnValue)
      .then((isSSNPresent) => {
        if (isSSNPresent) {
          this.props.userDetailsStore.setSSNErrorMessage('The SSN entered is already in use.');
        } else {
          this.props.uiStore.setProgress();
          this.props.userDetailsStore.updateUserProfileForSelectedUser().then(() => {
            this.setState({ displayMode: true });
          })
            .catch(() => this.setState({ displayMode: true }))
            .finally(() => {
              this.props.uiStore.setProgress(false);
            });
        }
        this.props.uiStore.setProgress(false);
      }).catch(() => { });
  }

  render() {
    const {
      detailsOfUser, USER_BASIC, USER_PROFILE_ADD_ADMIN_FRM, USER_PROFILE_PREFERRED_INFO_FRM, setAddressFieldsForProfile,
      formChange, maskChange, isAddressSkip, isPhoneSkip, skipAddressOrPhoneValidationCheck,
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
            {this.state.displayMode
              ? <Link to={this.props.match.url} onClick={e => this.updateMode(e, true)} className="link mr-10"><small><Icon className="ns-pencil" /> Edit profile data</small></Link>
              : (
                <>
                  <Link to="/" className="link mr-10" onClick={e => this.updateMode(e, false)}><small>Cancel</small></Link>
                  {USER_BASIC.meta.isValid && USER_PROFILE_ADD_ADMIN_FRM.meta.isValid
                    && <Link to="/" className="link mr-10" onClick={e => this.updateUserData(e)}><small><Icon name="save" />Update</small></Link>
                  }
                </>
              )
            }
            <Button compact onClick={() => skipAddressOrPhoneValidationCheck('ADDRESS')} color={isAddressSkip ? 'green' : 'blue'}>{isAddressSkip ? 'Force Address Check' : 'Skip Address Check'}</Button>
            <Button compact onClick={() => skipAddressOrPhoneValidationCheck('PHONE')} color={isPhoneSkip ? 'green' : 'blue'}>{isPhoneSkip ? 'Force VoIP Check' : 'Skip VoIP Check'}</Button>
          </Button.Group>
        </Header>
        {get(details, 'locked.lock') === 'LOCKED'
          && (
            <>
              <LockedInformation details={details} />
              <Divider />
            </>
          )
        }
        <Header as="h6">Personal Info</Header>
        <Form.Group widths={2}>
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
        <Form.Group widths={2}>
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
          {displayMode
            ? (
              <FormInput
                key="ssn"
                name="ssn"
                fielddata={USER_BASIC.fields.ssn}
                changed={(e, result) => formChange(e, result, formName)}
                displayMode={displayMode}
              />
            )
            : (
              <MaskedInput
                name="ssn"
                fielddata={USER_BASIC.fields.ssn}
                ssn
                changed={(values, field) => maskChange(values, formName, field)}
                displayMode={displayMode}
                showerror
              />
            )
          }
          <MaskedInput
            name="dateOfBirth"
            fielddata={USER_BASIC.fields.dateOfBirth}
            changed={(values, field) => maskChange(values, formName, field)}
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
        <Header as="h6">Preferred Info</Header>
        <Form.Group widths={3}>
          <FormInput
            name="name"
            fielddata={USER_PROFILE_PREFERRED_INFO_FRM.fields.name}
            changed={(e, result) => formChange(e, result, 'USER_PROFILE_PREFERRED_INFO_FRM')}
            displayMode={displayMode}
          />
          <AutoComplete
            readOnly={displayMode}
            displayMode={displayMode}
            name="street"
            fielddata={USER_PROFILE_PREFERRED_INFO_FRM.fields.street}
            onplaceselected={places => setAddressFieldsForProfile(places, 'USER_PROFILE_PREFERRED_INFO_FRM')}
            changed={(e, result) => formChange(e, result, 'USER_PROFILE_PREFERRED_INFO_FRM')}
          />
          {
            ['streetTwo', 'city', 'state'].map(field => (
              <FormInput
                key={field}
                name={field}
                fielddata={USER_PROFILE_PREFERRED_INFO_FRM.fields[field]}
                changed={(e, result) => formChange(e, result, 'USER_PROFILE_PREFERRED_INFO_FRM')}
                displayMode={displayMode}
              />
            ))
          }
          <MaskedInput
            displayMode={displayMode}
            name="zipCode"
            fielddata={USER_PROFILE_PREFERRED_INFO_FRM.fields.zipCode}
            changed={(values, field) => maskChange(values, 'USER_PROFILE_PREFERRED_INFO_FRM', field)}
            maxlength="5"
            number
          />
        </Form.Group>
        <Divider />
        <CIPInformation details={details} />
        <Divider />
        <OtherInformation details={details} />
        <Divider />
        <UserInvestorDetails isAdmin refLink={this.props.match.url} />
        <Divider />
      </Form>
    );
  }
}
