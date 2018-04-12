import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { Modal, Button, Header, Icon, Form, Divider, Input, Popup } from 'semantic-ui-react';
import InputMask from 'react-input-mask';
import Autocomplete from 'react-google-autocomplete';

import validationActions from './../../../actions/validation';
import FieldError from '../../../components/common/FieldError';
import { PROFILE_DETAILS_TITLE } from '../../../constants/profile';
import profileActions from '../../../actions/profile';
import Helper from '../../../helper/utility';

@inject('profileStore', 'uiStore', 'userStore')
@observer
export default class investorPersonalDetails extends Component {
  componentWillMount() {
    const { currentUser } = this.props.userStore;
    this.props.profileStore.setProfileDetails('firstLegalName', currentUser.givenName);
    this.props.profileStore.setProfileDetails('lastLegalName', currentUser.familyName);
  }

  componentWillUnmount() {
    this.props.uiStore.clearErrors();
    // this.props.profileStore.resetProfileDetails();
  }

  handleInputChange = (e, { name, value }) =>
    validationActions.validateProfileDetailsField(name, value);

  handleAutocompleteInputChange = e =>
    validationActions.validateProfileDetailsField(e.target.name, e.target.value);

  handleDateChange = (date) => {
    validationActions.validateProfileDetailsField('dateOfBirth', date);
  }

  handleMaskedInputChange = (e) => {
    const maskedInputValue = e.target.value;
    const unMaskedInputValue = Helper.unMaskInput(maskedInputValue);
    validationActions.validateProfileDetailsField(e.target.name, unMaskedInputValue);
  }

  handleSubmitForm = (e) => {
    e.preventDefault();
    validationActions.validateProfileDetailsForm();
    if (this.props.profileStore.canSubmitProfileDetails) {
      this.props.setDashboardWizardStep('SelectQuestionsOrEditInformation');
    }
  }

  render() {
    const { profileDetails } = this.props.profileStore;
    const welcomeMsg = `Hello ${this.props.userStore.currentUser.givenName}!`;
    return (
      <Modal size="mini" open closeIcon onClose={() => this.props.setDashboardWizardStep()}>
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
              <Form.Field width={6}>
                {/* <Label basic color="red" pointing="below">
                {profileDetails.title.error}</Label> */}
                <Form.Select
                  fluid
                  label={profileDetails.title.label}
                  name={profileDetails.title.key}
                  value={profileDetails.title.value}
                  onChange={this.handleInputChange}
                  error={!!profileDetails.title.error}
                  options={PROFILE_DETAILS_TITLE}
                />
                <FieldError error={profileDetails.title.error} />
              </Form.Field>
              <Form.Field>
                {/* eslint-disable jsx-a11y/label-has-for */}
                <Popup
                  trigger={<label>First Legal Name</label>}
                  content="Put your first name as listed on your driver license"
                  position="top center"
                  className="center-align"
                />
                {/* <Label basic color="red" pointing="below">
                {profileDetails.firstLegalName.error}</Label> */}
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
                <Popup
                  trigger={<label>Last Legal Name</label>}
                  content="Put your last name as listed on your driver license"
                  position="top center"
                  className="center-align"
                />
                {/* <Label basic color="red" pointing="below">
                {profileDetails.lastLegalName.error}</Label> */}
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
              <label>
                Residental Street
                <Popup
                  trigger={<Icon name="help circle outline" />}
                  content="Put your residental address as listed on your driver license"
                  position="top center"
                  className="center-align"
                />
              </label>
              {/* <Label basic color="red" pointing="below">
              {profileDetails.residentalStreet.error}</Label> */}
              <Autocomplete
                onPlaceSelected={(place) => {
                  profileActions.setAddressFieldsOnGoogleAutocomplete(place);
                }}
                types={['address']}
                placeholder={profileDetails.residentalStreet.label}
                name={profileDetails.residentalStreet.key}
                value={profileDetails.residentalStreet.value}
                onChange={this.handleAutocompleteInputChange}
              />
              <FieldError error={profileDetails.residentalStreet.error} />
            </Form.Field>
            <Form.Group widths="equal">
              <Form.Field>
                {/* <Label basic color="red" pointing="below">
                {profileDetails.city.error}</Label> */}
                <Form.Input
                  fluid
                  label={profileDetails.city.label}
                  placeholder={profileDetails.city.label}
                  name={profileDetails.city.key}
                  value={profileDetails.city.value}
                  onChange={this.handleInputChange}
                  error={!!profileDetails.city.error}
                />
                <FieldError error={profileDetails.city.error} />
              </Form.Field>
              <Form.Field>
                {/* <Label basic color="red" pointing="below">
                {profileDetails.state.error}</Label> */}
                <Form.Input
                  fluid
                  label={profileDetails.state.label}
                  placeholder={profileDetails.state.label}
                  name={profileDetails.state.key}
                  value={profileDetails.state.value}
                  onChange={this.handleInputChange}
                  error={!!profileDetails.state.error}
                />
                <FieldError error={profileDetails.state.error} />
              </Form.Field>
              <Form.Field>
                {/* <Label basic color="red" pointing="below">
                {profileDetails.zipCode.error}</Label> */}
                <Form.Input
                  fluid
                  label={profileDetails.zipCode.label}
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
                {/* <Label basic color="red" pointing="below">
                {profileDetails.phoneNumber.error}</Label> */}
                <InputMask
                  name={profileDetails.phoneNumber.key}
                  value={profileDetails.phoneNumber.value}
                  onChange={this.handleMaskedInputChange}
                  error={!!profileDetails.phoneNumber.error}
                  mask="999-999-9999"
                  maskChar=" "
                  alwaysShowMask
                />
                <FieldError error={profileDetails.phoneNumber.error} />
              </Form.Field>
              <Form.Field>
                <label>Date of Birth</label>
                {/* <Label basic color="red" pointing="below">
                {profileDetails.dateOfBirth.error}</Label> */}
                <DatePicker
                  showMonthDropdown
                  showYearDropdown
                  label="Date of Birth"
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
              {/* <Label basic color="red" pointing="below">
              {profileDetails.ssn.error}</Label> */}
              <InputMask
                label={profileDetails.ssn.label}
                name={profileDetails.ssn.key}
                value={profileDetails.ssn.value}
                onChange={this.handleMaskedInputChange}
                error={!!profileDetails.ssn.error}
                mask="999-999-9999"
                maskChar=" "
                alwaysShowMask
              />
              <FieldError error={profileDetails.ssn.error} />
            </Form.Field>
            <div className="center-align">
              <Button color={!this.props.profileStore.canSubmitProfileDetails ? '' : 'green'} size="large" className="very relaxed" disabled={!this.props.profileStore.canSubmitProfileDetails}>Verify my identity</Button>
            </div>
            <div className="center-align">
              <Button className="cancel-link" onClick={() => this.props.setDashboardWizardStep()}>I’ll finish this later</Button>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
