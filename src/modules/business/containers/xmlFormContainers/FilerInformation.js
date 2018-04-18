import React from 'react';
import { Form, Card, Divider, Button, Icon, Popup, Input } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom'; // Redirect
import Chips from 'react-chips/lib/Chips';

import validationActions from '../../../../actions/validation';
import busiessActions from '../../../../actions/business';
import Helper from '../../../../helper/utility';

@inject('businessStore')
@withRouter
@observer
export default class FilerInformation extends React.Component {
  componentWillUnmount() {
    this.props.businessStore.setXmlError();
  }

  handleChange = (e, { name, value }) => this.props.businessStore.setFilerInfo(name, value)

  handleNotificationEmailChange = (chips) => {
    const newErrors = { ...this.props.businessStore.xmlErrors };
    const pattern = /^([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)@([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)[\\.]([a-zA-Z]{2,9})$/;
    let isValid = true;
    chips.map((element) => {
      isValid = pattern.test(element);
      return isValid;
    });
    if (!isValid) {
      const errorMessage = 'The notificationEmail format is invalid.';
      newErrors.notificationEmailElement = errorMessage;
      this.props.businessStore.setXmlError(newErrors);
      this.props.businessStore.setFilerError('notificationEmail', errorMessage);
    } else {
      this.props.businessStore.removeXmlError('notificationEmailElement');
    }
    this.props.businessStore.setFilerInfo('notificationEmail', chips);
    validationActions.validateFilerInfoField('notificationEmail');
  }

  handleCheckboxChange = (e, { name }) => {
    this.props.businessStore.togglefilerCheckbox(name);
  }

  handleBusinessCancel = () => {
    this.props.history.push(`/app/business/${this.props.match.params.businessId}`);
  }

  handleFilerInformationSubmit = (e) => {
    e.preventDefault();
    const { filerInformation } = this.props.businessStore;
    busiessActions.validateFilerInfo(filerInformation);

    if (this.props.businessStore.canSubmitFilerInfoXmlForm) {
      busiessActions.submitXMLInformation('filerInformation')
        .then((data) => {
          this.props.businessStore.setXmlError();
          this.props.businessStore.setXmlActiveTabId(1);
          const { xmlSubmissionId } = data.body.data.upsertFilerInformation;
          this.props.businessStore.setXmlSubmissionId(xmlSubmissionId);
          Helper.toast('Filer information submitted successfully', 'success');
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  handleOnBlur = e => validationActions.validateFilerInfoField(e.target.name)

  render() {
    const { filerInformation } = this.props.businessStore;
    return (
      <div>
        <Form className="edgar-form">
          <Card fluid className="form-card">
            <Form.Field>
              { /* eslint-disable jsx-a11y/label-has-for */ }
              <label>Website URL</label>
              <Popup
                trigger={
                  <Input
                    value={filerInformation.offeringUrl.value}
                    onChange={this.handleChange}
                    name="offeringUrl"
                    onBlur={this.handleOnBlur}
                    error={!!filerInformation.offeringUrl.error}
                    className="column"
                    placeholder="Website URL"
                  />
                }
                content="Please enter URL of page, for which screenshot will be generated"
                on="focus"
                size="tiny"
              />
            </Form.Field>
            <Form.Group widths="equal">
              <Form.Input
                placeholder="Filer CIK"
                label="Filer CIK"
                name="filerCik"
                value={filerInformation.filerCik.value}
                onChange={this.handleChange}
                onBlur={this.handleOnBlur}
                className="column"
                error={!!filerInformation.filerCik.error}
              />
              <Form.Input
                placeholder="Filer CCC"
                label="Filer CCC"
                name="filerCcc"
                value={filerInformation.filerCcc.value}
                onChange={this.handleChange}
                onBlur={this.handleOnBlur}
                className="column"
                error={!!filerInformation.filerCcc.error}
              />
            </Form.Group>
            <Form.Group inline>
              <Form.Radio
                label="Live"
                value="LIVE"
                name="liveTestFlag"
                checked={filerInformation.liveTestFlag.value === 'LIVE'}
                error={!!filerInformation.liveTestFlag.error}
                onChange={this.handleChange}
              />
              <Form.Radio
                label="Test"
                value="TEST"
                name="liveTestFlag"
                checked={filerInformation.liveTestFlag.value === 'TEST'}
                error={!!filerInformation.liveTestFlag.error}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Group inline>
              <Form.Checkbox
                label="Would you like a Return Copy?"
                name="returnCopyFlag"
                checked={filerInformation.returnCopyFlag.value}
                onChange={this.handleCheckboxChange}
              />
              <Form.Checkbox
                label="Is this an electronic copy of an official filing submitted in paper format in connection with a hardship exemption?"
                name="confirmingCopyFlag"
                checked={filerInformation.confirmingCopyFlag.value}
                onChange={this.handleCheckboxChange}
              />
            </Form.Group>
            <Form.Input
              placeholder="Name"
              label="Name"
              name="contactName"
              value={filerInformation.contactName.value}
              error={!!filerInformation.contactName.error}
              onChange={this.handleChange}
              onBlur={this.handleOnBlur}
            />
            <Form.Input
              placeholder="Phone Number"
              label="Phone Number"
              name="contactPhone"
              value={filerInformation.contactPhone.value}
              error={!!filerInformation.contactPhone.error}
              onChange={this.handleChange}
              onBlur={this.handleOnBlur}
            />
            <Form.Input
              placeholder="Email"
              label="Email"
              name="contactEmail"
              value={filerInformation.contactEmail.value}
              error={!!filerInformation.contactEmail.error}
              onChange={this.handleChange}
              onBlur={this.handleOnBlur}
            />
            <Form.Checkbox
              label="Notify via Filing Website only?"
              name="overrideInternetFlag"
              checked={filerInformation.overrideInternetFlag.value}
              onChange={this.handleCheckboxChange}
              onBlur={this.handleOnBlur}
            />
            <div className={!filerInformation.overrideInternetFlag.value ? 'field disabled' : 'field'} >
              { /* eslint-disable jsx-a11y/label-has-for */ }
              <label>
                Enter notification email
              </label>
              <Chips
                value={filerInformation.notificationEmail.value}
                error={!!filerInformation.notificationEmail.error}
                onChange={this.handleNotificationEmailChange}
                createChipKeys={[9, 13, 32, 188]}
              />
            </div>
          </Card>
          <Divider hidden />
          <div className="right-align">
            <Button size="large" onClick={this.handleBusinessCancel}>Cancel</Button>
            <Button color="green" size="large" onClick={this.handleFilerInformationSubmit}>
              Save & Next <Icon name="chevron right" />
            </Button>
          </div>
        </Form>

      </div>
    );
  }
}
