import React, { Component } from 'react';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import { Link, Route } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import { Grid, Form, Card, Header, Button } from 'semantic-ui-react';
import { FormSelect, FormInput, MaskedInput, AutoComplete } from '../../../../../theme/form';
import { US_STATES } from '../../../../../constants/account';

import UserVerifiedDetails from '../../../investor/settings/components/UserVerifiedDetails';
import NewPhoneNumber from './profileSettings/NewPhoneNumber';
import NewEmailAddress from './profileSettings/NewEmailAddress';
import UpdateProfilePhoto from './profileSettings/UpdateProfilePhoto';
import Helper from '../../../../../helper/utility';
import { Spinner, UserAvatar } from '../../../../../theme/shared';

@inject('userDetailsStore', 'userStore', 'identityStore', 'uiStore')
@observer
export default class ProfileData extends Component {
  navigateToNewPhoneNumber = () => {
    this.props.history.replace(`${this.props.match.url}/new-phone-number`);
  }
  handleNavToVerifyIdentity = (step) => {
    this.props.uiStore.setDashboardWizardStep(step);
  }
  isVerified = (cipStatus) => {
    let checkStatus = '';
    if (cipStatus !== null) {
      checkStatus = cipStatus.status;
      return this.props.userDetailsStore.validAccStatus.includes(checkStatus);
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
      email, legalDetails, avatar, firstName, lastName,
    } = this.props.userDetailsStore.userDetails;
    const User = { ...this.props.userStore.currentUser };
    const userAvatar = {
      firstName, lastName, avatarUrl: avatar ? avatar.url : '', roles: toJS(User.roles),
    };
    const {
      ID_PROFILE_INFO,
      profileInfoChange,
      setAddressFieldsForProfile,
    } = this.props.identityStore;
    if (isEmpty(this.props.userDetailsStore.userDetails)) {
      return (
        <div>
          <Spinner loaderMessage="Loading..." />
        </div>
      );
    }
    return (
      <Grid>
        <Route path={`${this.props.match.url}/new-phone-number`} component={NewPhoneNumber} />
        <Route path={`${this.props.match.url}/new-email-address`} component={NewEmailAddress} />
        <Route
          path={`${this.props.match.url}/update-profile-photo`}
          render={props => <UpdateProfilePhoto refLink={this.props.match.url} {...props} />}
        />
        <Grid.Column widescreen={8} largeScreen={10} tablet={16} mobile={16}>
          <Card fluid className="form-card">
            <Header as="h3">Personal Profile</Header>
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
              <Header as="h4">Mailing Address</Header>
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
                <FormSelect
                  name="state"
                  fielddata={ID_PROFILE_INFO.fields.state}
                  options={US_STATES}
                  changed={profileInfoChange}
                />
                <FormInput
                  name="zipCode"
                  fielddata={ID_PROFILE_INFO.fields.zipCode}
                  changed={profileInfoChange}
                />
              </Form.Group>
              <Button inverted color="green" disabled={!ID_PROFILE_INFO.meta.isValid}>Update profile info</Button>
            </Form>
          </Card>
        </Grid.Column>
        <Grid.Column widescreen={5} largeScreen={6} tablet={16} mobile={16}>
          <Card.Group>
            <Card fluid className="form-card">
              <h3>Profile Photo</h3>
              <div>
                <UserAvatar UserInfo={userAvatar} />
                <Link to={`${this.props.match.url}/update-profile-photo`}><b>Change profile photo</b></Link>
              </div>
            </Card>
            <UserVerifiedDetails
              {...this.props}
              email={email}
              legalDetails={legalDetails}
              isUserVerified={this.isVerified}
              handleNavToVerifyIdentity={this.handleNavToVerifyIdentity}
            />
          </Card.Group>
        </Grid.Column>
      </Grid>
    );
  }
}
