import React, { Component } from 'react';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import { Link, Route } from 'react-router-dom';
import { isEmpty, find } from 'lodash';
import { Grid, Form, Card, Header, Button } from 'semantic-ui-react';
import { FormInput, MaskedInput, AutoComplete, FormDropDown } from '../../../../../theme/form';
import { US_STATES_FOR_INVESTOR } from '../../../../../constants/account';

import UserVerifiedDetails from '../../../investor/settings/components/UserVerifiedDetails';
import NewPhoneNumber from './profileSettings/NewPhoneNumber';
import NewEmailAddress from './profileSettings/NewEmailAddress';
import ConfirmEmailAddress from '../../../../../modules/auth/containers/ConfirmEmailAddress';
import UpdateProfilePhoto from './profileSettings/UpdateProfilePhoto';
import Helper from '../../../../../helper/utility';
import { InlineLoader, UserAvatar } from '../../../../../theme/shared';
import ConfirmPhoneNumber from './/profileSettings/ConfirmPhoneNumber';

@inject('userDetailsStore', 'userStore', 'identityStore', 'uiStore')
@observer
export default class ProfileData extends Component {
  componentWillMount() {
    const { ID_PROFILE_INFO, setStateValue } = this.props.identityStore;
    const selectedState = find(US_STATES_FOR_INVESTOR, { key: ID_PROFILE_INFO.fields.state.value });
    if (selectedState) {
      setStateValue(selectedState.value);
    }
  }
  navigateToNewPhoneNumber = () => {
    this.props.history.replace(`${this.props.match.url}/new-phone-number`);
  }
  isVerified = (cipStatus) => {
    if (cipStatus !== null) {
      return this.props.userDetailsStore.validAccStatus.includes(cipStatus);
    }
    return false;
  }
  handleUpdateProfileInfo = (e) => {
    e.preventDefault();
    this.props.identityStore.updateUserProfileData().then(() => {
      Helper.toast('Investor profile has been updated.', 'success');
    })
      .catch(() => {});
  }
  render() {
    const {
      email, legalDetails, info,
    } = this.props.userDetailsStore.userDetails;
    const User = { ...this.props.userStore.currentUser };
    const userAvatar = {
      firstName: info ? info.firstName : '', lastName: info ? info.lastName : '', avatarUrl: info ? info.avatar ? info.avatar.url : '' : '', roles: toJS(User.roles),
    };
    const {
      ID_PROFILE_INFO,
      profileInfoChange,
      profileInfoMaskedChange,
      setAddressFieldsForProfile,
    } = this.props.identityStore;
    if (isEmpty(this.props.userDetailsStore.userDetails) || !info) {
      return <InlineLoader />;
    }
    return (
      <Grid>
        <Route path={`${this.props.match.url}/new-phone-number`} component={NewPhoneNumber} />
        <Route
          path={`${this.props.match.url}/confirm`}
          render={props =>
            <ConfirmPhoneNumber newPhoneNumber refLink={this.props.match.url} {...props} />}
        />
        <Route path={`${this.props.match.url}/new-email-address`} component={NewEmailAddress} />
        <Route
          path={`${this.props.match.url}/confirm-email-address`}
          render={props => <ConfirmEmailAddress refLink={this.props.match.url} {...props} />}
        />
        <Route
          path={`${this.props.match.url}/update-profile-photo`}
          render={props => <UpdateProfilePhoto refLink={this.props.match.url} {...props} />}
        />
        <Grid.Column widescreen={8} largeScreen={10} tablet={16} mobile={16}>
          <Card fluid className="form-card">
            <Header as="h5">Personal Profile</Header>
            <Form onSubmit={this.handleUpdateProfileInfo}>
              <Form.Group widths="equal">
                {['firstName', 'lastName'].map(field => (
                  <FormInput
                    key={field}
                    name={field}
                    value={ID_PROFILE_INFO.fields[field].value}
                    fielddata={ID_PROFILE_INFO.fields[field]}
                    changed={profileInfoChange}
                  />
                ))}
              </Form.Group>
              <MaskedInput
                action
                actionlabel="Change"
                actionclass="link-button"
                actioncolor="green"
                name="phoneNumber"
                fielddata={ID_PROFILE_INFO.fields.phoneNumber}
                mask="999-999-9999"
                changed={profileInfoChange}
                clickonaction={this.navigateToNewPhoneNumber}
                readOnly
              />
              <FormInput
                action={{
                  color: 'green', className: 'link-button', content: 'Change', onClick: () => this.props.history.replace(`${this.props.match.url}/new-email-address`),
                }}
                name="email"
                fielddata={ID_PROFILE_INFO.fields.email}
                changed={profileInfoChange}
                readOnly
              />
              <Header as="h5">Mailing Address</Header>
              <AutoComplete
                name="street"
                fielddata={ID_PROFILE_INFO.fields.street}
                onplaceselected={setAddressFieldsForProfile}
                changed={profileInfoChange}
              />
              <Form.Group widths="equal">
                <FormInput
                  name="city"
                  fielddata={ID_PROFILE_INFO.fields.city}
                  changed={profileInfoChange}
                />
                <FormDropDown
                  name="state"
                  fielddata={ID_PROFILE_INFO.fields.state}
                  options={US_STATES_FOR_INVESTOR}
                  search
                  selection
                  compact
                  placeholder="NY"
                  onChange={profileInfoChange}
                />
                <MaskedInput
                  name="zipCode"
                  fielddata={ID_PROFILE_INFO.fields.zipCode}
                  changed={profileInfoMaskedChange}
                  zipCode
                />
              </Form.Group>
              <Button inverted color="green" disabled={!ID_PROFILE_INFO.meta.isValid}>Update profile info</Button>
            </Form>
          </Card>
        </Grid.Column>
        <Grid.Column widescreen={5} largeScreen={6} tablet={16} mobile={16}>
          <Card.Group>
            <Card fluid className="form-card">
              <Header as="h5">Profile Photo</Header>
              <div>
                <UserAvatar UserInfo={userAvatar} />
                <Link to={`${this.props.match.url}/update-profile-photo`}><b>Change profile photo</b></Link>
              </div>
            </Card>
            {userAvatar.roles.includes('investor') &&
              <UserVerifiedDetails
                {...this.props}
                email={email}
                legalDetails={legalDetails}
                isUserVerified={this.isVerified}
              />
            }
          </Card.Group>
        </Grid.Column>
      </Grid>
    );
  }
}
