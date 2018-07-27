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

@inject('userDetailsStore', 'userStore', 'profileStore', 'uiStore', 'accountStore')
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
      return this.props.accountStore.validAccStatus.includes(checkStatus);
    }
    return false;
  }
  handleUpdateProfileInfo = (e) => {
    e.preventDefault();
    this.props.profileStore.updateUserProfileData().then(() => {
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
      updateProfileInfo,
      updateProfileInfoChange,
      setAddressFields,
    } = this.props.profileStore;
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
            <Header as="h5">Personal Profile</Header>
            <Form onSubmit={this.handleUpdateProfileInfo}>
              <Form.Group widths="equal">
                {['firstName', 'lastName'].map(field => (
                  <FormInput
                    key={field}
                    name={field}
                    value={updateProfileInfo.fields[field].value}
                    fielddata={updateProfileInfo.fields[field]}
                    changed={updateProfileInfoChange}
                  />
                ))}
              </Form.Group>
              <MaskedInput
                action
                actionlabel="Change"
                actionclass="link-button"
                actioncolor="green"
                name="phoneNumber"
                fielddata={updateProfileInfo.fields.phoneNumber}
                mask="999-999-9999"
                changed={updateProfileInfoChange}
                clickonaction={this.navigateToNewPhoneNumber}
                readOnly
              />
              <FormInput
                action={{
                  color: 'green', className: 'link-button', content: 'Change', onClick: () => this.props.history.replace(`${this.props.match.url}/new-email-address`),
                }}
                name="email"
                fielddata={updateProfileInfo.fields.email}
                changed={updateProfileInfoChange}
                readOnly
              />
              <Header as="h5">Mailing Address</Header>
              <AutoComplete
                name="street"
                fielddata={updateProfileInfo.fields.street}
                onplaceselected={setAddressFields}
                changed={updateProfileInfoChange}
              />
              <Form.Group widths="equal">
                <FormInput
                  name="city"
                  fielddata={updateProfileInfo.fields.city}
                  changed={updateProfileInfoChange}
                />
                <FormSelect
                  name="state"
                  fielddata={updateProfileInfo.fields.state}
                  options={US_STATES}
                  changed={updateProfileInfoChange}
                />
                <FormInput
                  name="zipCode"
                  fielddata={updateProfileInfo.fields.zipCode}
                  changed={updateProfileInfoChange}
                />
              </Form.Group>
              <Button inverted color="green" disabled={!updateProfileInfo.meta.isValid}>Update profile info</Button>
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
