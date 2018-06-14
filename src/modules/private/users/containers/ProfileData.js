import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link, Route } from 'react-router-dom';
import { Grid, Form, Card, Header, Button } from 'semantic-ui-react';
import { FormSelect, FormInput, MaskedInput, AutoComplete } from '../../../../theme/form/FormElements';
import { US_STATES } from '../../../../constants/account';

import UserVerifiedDetails from '../components/UserVerifiedDetails';
import NewPhoneNumber from './NewPhoneNumber';
import NewEmailAddress from './NewEmailAddress';
import UpdateProfilePhoto from './UpdateProfilePhoto';
import Helper from '../../../../helper/utility';

@inject('userDetailsStore', 'userStore', 'profileStore', 'uiStore')
@observer
export default class ProfileData extends Component {
  componentWillMount() {
    this.props.userDetailsStore.getUser(this.props.userStore.currentUser.sub);
  }
  navigateToNewPhoneNumber = () => {
    this.props.history.replace(`${this.props.match.url}/new-phone-number`);
  }
  handleUpdateProfileInfo = (e) => {
    e.preventDefault();
    this.props.profileStore.updateUserProfileData().then(() => {
      Helper.toast('Investor profile has been updated.', 'success');
    })
      .catch(() => {});
  }
  render() {
    const { email, legalDetails } = this.props.userDetailsStore.userDetails;
    const {
      updateProfileInfo,
      updateProfileInfoChange,
      setAddressFields,
    } = this.props.profileStore;
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
              <Header as="h4">Mailing Address</Header>
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
              <h3>Profile Photo</h3>
              {/* <Randavatar name={this.props.UserInfo.fullname}
              avatarKey={this.props.UserInfo.avatarKey} size="small" /> */}
              <Link to={`${this.props.match.url}/update-profile-photo`}><b>Change profile photo</b></Link>
            </Card>
            <UserVerifiedDetails
              {...this.props}
              email={email}
              legalDetails={legalDetails}
            />
          </Card.Group>
        </Grid.Column>
      </Grid>
    );
  }
}
