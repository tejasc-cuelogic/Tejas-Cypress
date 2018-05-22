import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link, Route } from 'react-router-dom';
import { Grid, Form, Card, Header, Button } from 'semantic-ui-react';
import { FormSelect, FormInput, MaskedInput } from '../../../../theme/form/FormElements';
import { US_STATES } from '../../../../constants/account'; //  added Temperarily to update UI as per new layout

import UserVerifiedDetails from '../components/UserVerifiedDetails';
import NewPhoneNumber from './NewPhoneNumber';
import NewEmailAddress from './NewEmailAddress';

const states = {
  label: 'State',
  error: undefined,
};

@inject('userDetailsStore', 'userStore', 'profileStore', 'uiStore')
@observer
export default class ProfileData extends Component {
  componentWillMount() {
    this.props.userDetailsStore.getUser(this.props.userStore.currentUser.sub);
    this.props.profileStore.setProfileInfo(this.props.userStore.currentUser);
  }
  navigateToNewPhoneNumber = () => {
    this.props.history.replace(`${this.props.match.url}/new-phone-number`);
  }
  render() {
    const { email, legalDetails } = this.props.userDetailsStore.userDetails;
    const { updateProfileInfo, updateProfileInfoChange } = this.props.profileStore;
    return (
      <Grid columns={1} stackable>
        <Route path={`${this.props.match.url}/new-phone-number`} component={NewPhoneNumber} />
        <Route path={`${this.props.match.url}/new-email-address`} component={NewEmailAddress} />
        <Grid.Row>
          <Grid.Column width={8}>
            <Card fluid className="form-card">
              <Header as="h3">Personal Profile</Header>
              <Form>
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
                />
                <FormInput
                  action={{
                    color: 'green', className: 'link-button', content: 'Change', onClick: () => this.props.history.replace(`${this.props.match.url}/new-email-address`),
                  }}
                  name="email"
                  fielddata={updateProfileInfo.fields.email}
                  changed={updateProfileInfoChange}
                />
                <Header as="h4">Mailing Address</Header>
                <Form.Input fluid label="Residendial Street" placeholder="Residendial Street" value="123, East Street, Place" />
                <Form.Group widths="equal">
                  <Form.Input fluid label="City" placeholder="City" value="Atlanta" />
                  <FormSelect label="State" name="state" fielddata={states} options={US_STATES} />
                  <Form.Input fluid label="ZIP code" placeholder="ZIP code" />
                </Form.Group>
                <Button inverted color="green" disabled={!updateProfileInfo.meta.isValid}>Update profile info</Button>
              </Form>
            </Card>
          </Grid.Column>
          <Grid.Column width={5}>
            <Card.Group itemsPerRow={1}>
              <Card className="form-card">
                <h3>Profile Photo</h3>
                {/* <Randavatar name={this.props.UserInfo.fullname}
                avatarKey={this.props.UserInfo.avatarKey} size="small" /> */}
                <Link to={this.props.match.url}><b>Change profile photo</b></Link>
              </Card>
              <UserVerifiedDetails
                {...this.props}
                email={email}
                legalDetails={legalDetails}
              />
            </Card.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
