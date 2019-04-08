import React, { Component } from 'react';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import { Link, Route } from 'react-router-dom';
import { isEmpty, find, capitalize } from 'lodash';
import { Grid, Form, Card, Header, Button, Table } from 'semantic-ui-react';
import { FormInput, MaskedInput, AutoComplete, FormDropDown } from '../../../../../theme/form';
import { US_STATES_FOR_INVESTOR } from '../../../../../constants/account';

import UserVerifiedDetails from '../../../investor/settings/components/UserVerifiedDetails';
import UserInvestorDetails from '../../../investor/settings/components/UserInvestorDetails';
import NewPhoneNumber from './profileSettings/NewPhoneNumber';
import NewEmailAddress from './profileSettings/NewEmailAddress';
import ConfirmEmailAddress from '../../../../../modules/auth/containers/ConfirmEmailAddress';
import UpdateProfilePhoto from './profileSettings/UpdateProfilePhoto';
import Helper from '../../../../../helper/utility';
import { InlineLoader, UserAvatar, Image64 } from '../../../../../theme/shared';
import ConfirmPhoneNumber from './/profileSettings/ConfirmPhoneNumber';
import EstablishProfile from '../../../investor/accountSetup/containers/establishProfile';


@inject('userDetailsStore', 'userStore', 'identityStore', 'uiStore')
@observer
export default class ProfileData extends Component {
  componentWillMount() {
    const { ID_PROFILE_INFO, setStateValue } = this.props.identityStore;
    const selectedState = find(US_STATES_FOR_INVESTOR, { key: ID_PROFILE_INFO.fields.state.value });
    if (selectedState) {
      setStateValue(selectedState.value);
    }
    this.props.uiStore.setProgress(false);
  }
  navigateToNewPhoneNumber = () => {
    this.props.history.replace(`${this.props.match.url}/new-phone-number`);
  }
  handleUpdateProfileInfo = (e) => {
    e.preventDefault();
    const userRole = capitalize(this.props.userStore.currentUser.roles[0]);
    this.props.identityStore.updateUserProfileData().then(() => {
      Helper.toast(`${userRole} profile has been updated.`, 'success');
    })
      .catch(() => { });
  }
  render() {
    const {
      email, legalDetails, info, phone, investorProfileData, status,
    } = this.props.userDetailsStore.userDetails;
    const { signupStatus, validAccStatus } = this.props.userDetailsStore;
    const User = { ...this.props.userStore.currentUser };
    const userAvatar = {
      firstName: info ? info.firstName : '', lastName: info ? info.lastName : '', avatarUrl: info ? info.avatar ? info.avatar.url : '' : '', roles: toJS(User.roles),
    };
    const { inProgress } = this.props.uiStore;
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
        <Route path={`${this.props.match.url}/new-phone-number`} render={() => <NewPhoneNumber refLink={this.props.match.url} />} />
        <Route
          path={`${this.props.match.url}/confirm`}
          render={props =>
            <ConfirmPhoneNumber newPhoneNumber refLink={this.props.match.url} {...props} />}
        />
        <Route path={`${this.props.match.url}/new-email-address`} render={() => <NewEmailAddress refLink={this.props.match.url} />} />
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
            <Form onSubmit={this.handleUpdateProfileInfo} className="profile-settings">
              <Table structured basic className="form-table profile-table">
                <Table.Body>
                  <Table.Row>
                    <Table.Cell rowSpan="2">
                      <div className="profile-pic-wrapper">
                        {userAvatar.avatarUrl ?
                          <Image64
                            avatar
                            circular
                            size=""
                            srcUrl={userAvatar.avatarUrl}
                          /> :
                          <UserAvatar UserInfo={userAvatar} />
                        }
                        <Button as={Link} to={`${this.props.match.url}/update-profile-photo`} circular icon={{ className: 'ns-pencil' }} className="change-profile-icon" color="green" />
                      </div>
                    </Table.Cell>
                    <Table.Cell><b>Phone number</b></Table.Cell>
                    <Table.Cell>{phone && phone.number ? Helper.phoneNumberFormatter(phone.number) : 'N/A'}</Table.Cell>
                    <Table.Cell><Link to={`${this.props.match.url}/new-phone-number`}>Change Phone</Link></Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell><b>E-mail Address</b></Table.Cell>
                    <Table.Cell>{email && email.address ? email.address : 'N/A'}</Table.Cell>
                    <Table.Cell><Link to={`${this.props.match.url}/new-email-address`}>Change Email</Link></Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
              <div className="field-wrap">
                <Form.Group widths={2}>
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
              </div>
              <Header as="h5">Mailing Address</Header>
              <div className="field-wrap">
                <AutoComplete
                  name="street"
                  fielddata={ID_PROFILE_INFO.fields.street}
                  onplaceselected={setAddressFieldsForProfile}
                  changed={profileInfoChange}
                />
                <Form.Group widths={3}>
                  <FormInput
                    name="streetTwo"
                    fielddata={ID_PROFILE_INFO.fields.streetTwo}
                    changed={profileInfoChange}
                  />
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
                    defaultValue=""
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
                <Button primary loading={inProgress} disabled={!ID_PROFILE_INFO.meta.isValid} className="mt-20">Update information</Button>
              </div>
            </Form>
          </Card>
        </Grid.Column>
        {userAvatar.roles.includes('investor') &&
          <Grid.Column widescreen={5} largeScreen={6} tablet={16} mobile={16}>
            <Card.Group>
              <UserVerifiedDetails
                {...this.props}
                email={email}
                legalDetails={legalDetails}
                status={status}
                signupStatus={signupStatus}
                validAccStatus={validAccStatus}
              />
            </Card.Group>
            {investorProfileData && !investorProfileData.isPartialProfile &&
              <UserInvestorDetails
                {...this.props}
                investorProfileData={investorProfileData}
              />
            }
            <Route exact path={`${this.props.match.url}/establish-profile`} render={() => <EstablishProfile refUrl={this.props.match.url} />} />
          </Grid.Column>
        }
      </Grid>
    );
  }
}
