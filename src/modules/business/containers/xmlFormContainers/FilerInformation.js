import React from 'react';
import { Form, Header, Divider } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import Chips from 'react-chips/lib/Chips';
import validationActions from '../../../../actions/validation';

@inject('businessStore')
@observer
export default class FilerInformation extends React.Component {
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

  handleOnBlur = e => validationActions.validateFilerInfoField(e.target.name)

  render() {
    const { filerInformation } = this.props.businessStore;
    return (
      <div>
        <Divider section />
        <Header as="h1">Filer Information</Header>
        <Form.Group>
          <Form.Input
            placeholder="Filer CIK"
            label="Filer CIK"
            name="filerCik"
            value={filerInformation.filerCik.value}
            onChange={this.handleChange}
            onBlur={this.handleOnBlur}
            className="column"
            error={!!filerInformation.filerCik.error}
            width={8}
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
            width={8}
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
      </div>
    );
  }
}
