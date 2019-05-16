import React from 'react';
import { Form, Card } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom'; // Redirect
import Chips from 'react-chips/lib/Chips';
import { FieldError } from './../../../../../../theme/shared';
import { FormInput, FormRadioGroup } from './../../../../../../theme/form';

@inject('businessStore')
@withRouter
@observer
export default class FilerInformation extends React.Component {
  componentWillUnmount() {
    this.props.businessStore.setXmlError();
  }

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
    this.props.businessStore.onFieldChange('formFilerInfo', 'notificationEmail', chips);
  }

  handleCheckboxChange = (e, { name }) => {
    this.props.businessStore.togglefilerCheckbox(name);
  }

  render() {
    const { formFilerInfo, filerInfoChange } = this.props.businessStore;
    return (
      <div>
        <Card fluid className="form-card">
          <FormInput
            type="text"
            fielddata={formFilerInfo.fields.offeringUrl}
            name="offeringUrl"
            changed={filerInfoChange}
          />
          <Form.Group widths="equal">
            <FormInput
              type="text"
              fielddata={formFilerInfo.fields.filerCik}
              name="filerCik"
              changed={filerInfoChange}
            />
            <FormInput
              type="text"
              fielddata={formFilerInfo.fields.filerCcc}
              name="filerCcc"
              changed={filerInfoChange}
            />
          </Form.Group>
          <Form.Group inline>
            { /* eslint-disable jsx-a11y/label-has-for */}
            <label>
              Is this Live or Test filing?
            </label>
            <FormRadioGroup
              fielddata={formFilerInfo.fields.liveTestFlag}
              name="liveTestFlag"
              changed={filerInfoChange}
            />
          </Form.Group>
          <Form.Group inline>
            <Form.Checkbox
              label="Would you like a Return Copy?"
              name="returnCopyFlag"
              checked={formFilerInfo.fields.returnCopyFlag.value}
              onChange={this.handleCheckboxChange}
            />
            <Form.Checkbox
              label="Is this an electronic copy of an official filing submitted in paper format in connection with a hardship exemption?"
              name="confirmingCopyFlag"
              checked={formFilerInfo.fields.confirmingCopyFlag.value}
              onChange={this.handleCheckboxChange}
            />
          </Form.Group>
        </Card>
        <Card.Group stackable itemsPerRow={2}>
          <Card fluid className="form-card">
            <FormInput
              type="text"
              fielddata={formFilerInfo.fields.contactName}
              name="contactName"
              changed={filerInfoChange}
            />
            <FormInput
              type="text"
              fielddata={formFilerInfo.fields.contactPhone}
              name="contactPhone"
              changed={filerInfoChange}
            />
            <FormInput
              type="email"
              fielddata={formFilerInfo.fields.contactEmail}
              name="contactEmail"
              changed={filerInfoChange}
            />
          </Card>
          <Card fluid className="form-card">
            <Form.Checkbox
              label="Notify via Filing Website only?"
              name="overrideInternetFlag"
              checked={formFilerInfo.fields.overrideInternetFlag.value}
              onChange={this.handleCheckboxChange}
            />
            <div className={!formFilerInfo.fields.overrideInternetFlag.value ? 'field disabled' : 'field'} >
              { /* eslint-disable jsx-a11y/label-has-for */}
              <label>
                Enter notification email
              </label>
              <Chips
                value={formFilerInfo.fields.notificationEmail.value}
                onChange={this.handleNotificationEmailChange}
                createChipKeys={[9, 13, 32, 188]}
              />
              {formFilerInfo.fields.notificationEmail.error &&
                <FieldError error={formFilerInfo.fields.notificationEmail.error} />
              }
            </div>
          </Card>
        </Card.Group>
      </div>
    );
  }
}
