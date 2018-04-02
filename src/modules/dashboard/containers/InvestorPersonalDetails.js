import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { Modal, Button, Header, Icon, Form, Divider, Input, Popup } from 'semantic-ui-react';

import validationActions from './../../../actions/validation';
import FieldError from '../../../components/common/FieldError';

@inject('profileStore', 'uiStore', 'userStore')
@observer
export default class investorPersonalDetails extends Component {
  componentWillUnmount() {
    this.props.uiStore.clearErrors();
    this.props.profileStore.resetProfileDetails();
  }

  handleInputChange = (e, { name, value }) =>
    validationActions.validateProfileDetailsField(name, value);

  handleDateChange = (date) => {
    validationActions.validateProfileDetailsField('dateOfBirth', date);
  }

  handleSubmitForm = (e) => {
    e.preventDefault();
    validationActions.validateProfileDetailsForm();
    if (this.props.profileStore.canSubmitProfileDetails) {
      console.log(this.props.profileStore.profileDetails);
    }
  }

  render() {
    const { profileDetails } = this.props.profileStore;
    const welcomeMsg = `Hello ${this.props.userStore.currentUser.givenName}!`;
    return (
      <Modal size="tiny" open closeIcon onClose={() => this.props.setDashboardWizardStep()}>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">{welcomeMsg}</Header>
          <p>You’re almost at your personal dashboard</p>
          <Divider />
          <p><Link to="">Federal regulations</Link> require us to collect some more info
            to enable you to fully use your account
          </p>
        </Modal.Header>
        <Modal.Content className="signup-content">
          <Form error onSubmit={this.handleSubmitForm}>
            <Form.Group widths="equal">
              <Form.Field>
                {/* eslint-disable */}
                <label>
                  First Legal Name
                  <Popup
                    trigger={<Icon name="help circle outline" />}
                    content="Put your first name as listed on your driver license"
                    position="top center"
                    className="center-align"
                  />
                </label>
                <Input
                  fluid
                  placeholder={profileDetails.firstLegalName.label}
                  name={profileDetails.firstLegalName.key}
                  value={profileDetails.firstLegalName.value}
                  onChange={this.handleInputChange}
                  error={!!profileDetails.firstLegalName.error}
                />
                <FieldError error={profileDetails.firstLegalName.error} />
              </Form.Field>
              <Form.Field>
                <label>
                  Last Legal Name
                  <Popup
                    trigger={<Icon name="help circle outline" />}
                    content="Put your last name as listed on your driver license"
                    position="top center"
                    className="center-align"
                  />
                </label>
                <Input
                  fluid
                  placeholder={profileDetails.lastLegalName.label}
                  name={profileDetails.lastLegalName.key}
                  value={profileDetails.lastLegalName.value}
                  onChange={this.handleInputChange}
                  error={!!profileDetails.lastLegalName.error}
                />
                <FieldError error={profileDetails.lastLegalName.error} />
              </Form.Field>
            </Form.Group>
            <Form.Field>
              {/* eslint-disable */}
              <label>
                Residental Street
                <Popup
                  trigger={<Icon name="help circle outline" />}
                  content="Put your residental address as listed on your driver license"
                  position="top center"
                  className="center-align"
                />
              </label>
              <Input
                fluid
                placeholder={profileDetails.residentalStreet.label}
                name={profileDetails.residentalStreet.key}
                value={profileDetails.residentalStreet.value}
                onChange={this.handleInputChange}
                error={!!profileDetails.residentalStreet.error}
              />
              <FieldError error={profileDetails.residentalStreet.error} />
            </Form.Field>
            <Form.Group widths="equal">
              <Form.Field>
                <label>
                  {profileDetails.city.label}
                </label>
                <Input
                  fluid
                  placeholder={profileDetails.city.label}
                  name={profileDetails.city.key}
                  value={profileDetails.city.value}
                  onChange={this.handleInputChange}
                  error={!!profileDetails.city.error}
                />
                <FieldError error={profileDetails.city.error} />
              </Form.Field>
              <Form.Field>
                <label>
                  {profileDetails.state.label}
                </label>
                <Input
                  fluid
                  placeholder={profileDetails.state.label}
                  name={profileDetails.state.key}
                  value={profileDetails.state.value}
                  onChange={this.handleInputChange}
                  error={!!profileDetails.state.error}
                />
                <FieldError error={profileDetails.state.error} />
              </Form.Field>
              <Form.Field>
                <label>
                  {profileDetails.zipCode.label}
                </label>
                <Input
                  fluid
                  placeholder={profileDetails.zipCode.label}
                  name={profileDetails.zipCode.key}
                  value={profileDetails.zipCode.value}
                  onChange={this.handleInputChange}
                  error={!!profileDetails.zipCode.error}
                />
                <FieldError error={profileDetails.zipCode.error} />
              </Form.Field>
            </Form.Group>
            {/* <FieldError error={profileDetails.residentalStreet.error} /> */}
            <Form.Group widths="equal">
              <Form.Field>
                <label>
                  {profileDetails.phoneNumber.label}
                </label>
                <Input
                  fluid
                  placeholder={profileDetails.phoneNumber.label}
                  name={profileDetails.phoneNumber.key}
                  value={profileDetails.phoneNumber.value}
                  onChange={this.handleInputChange}
                  error={!!profileDetails.phoneNumber.error}
                />
                <FieldError error={profileDetails.phoneNumber.error} />
              </Form.Field>
              {/* <Form.Input
                fluid
                label={profileDetails.dateOfBirth.label}
                placeholder={profileDetails.dateOfBirth.label}
                name={profileDetails.dateOfBirth.key}
                value={profileDetails.dateOfBirth.value}
                onChange={this.handleInputChange}
                error={!!profileDetails.dateOfBirth.error}
              /> */}
              <Form.Field>
                <label>Date of Birth</label>
                <DatePicker
                  showMonthDropdown
                  showYearDropdown
                  placeholderText={profileDetails.dateOfBirth.label}
                  dateFormat="MM-DD-YYYY"
                  maxDate={moment()}
                  selected={profileDetails.dateOfBirth.value}
                  onChange={this.handleDateChange}
                />
                <FieldError error={profileDetails.dateOfBirth.error} />
              </Form.Field>
            </Form.Group>
            <Form.Field>
              <label>
                {profileDetails.ssn.label}
              </label>
              <Input
                fluid
                placeholder={profileDetails.ssn.label}
                name={profileDetails.ssn.key}
                value={profileDetails.ssn.value}
                onChange={this.handleInputChange}
                error={!!profileDetails.ssn.error}
              />
              <FieldError error={profileDetails.ssn.error} />
            </Form.Field>
            <div className="center-align">
              <Button circular color="green" size="large" disabled={!this.props.profileStore.canSubmitProfileDetails}>Confirm</Button>
            </div>
            <div className="center-align">
              <Button className="cancel-link">I’ll finish this later</Button>
            </div>
          </Form>
        </Modal.Content>
    </Modal>
    );
  }
}
