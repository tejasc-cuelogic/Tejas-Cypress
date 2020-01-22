import React from 'react';
import { observer, inject } from 'mobx-react';
import { get, pick } from 'lodash';
import ReactCodeInput from 'react-code-input';
import { FormInput, MaskedInput, FormPasswordStrength, FormSelect, DropZoneConfirm as DropZone, FormRadioGroup, FormCheckbox, FormDropDown, FormTextarea } from '.';
import Address from './src/Address';

function formHoc(WrappedComponent, metaInfo) {
  // eslint-disable-next-line no-unused-expressions
  return inject(metaInfo.store, 'nsUiStore')(observer((class extends React.Component {
    Input = (name, props) => {
      const fieldData = this.props[metaInfo.store][metaInfo.form].fields[name];
      return (
        <FormInput
          name={name}
          key={name}
          type="text"
          format={get(fieldData, 'format')}
          fielddata={fieldData}
          onblur={get(props, 'handleBlur') || false}
          changed={(e, result) => this.props[metaInfo.store].formChange(e, result, metaInfo.form)}
          label={get(props, 'label') || false}
          {...props}
        />
      );
    }

    TextArea = (name, props) => {
      const fieldData = get(props, 'fielddata') || this.fieldsData[name];
      return (
        <FormTextarea
          name={name}
          key={name}
          type="text"
          format={get(fieldData, 'format')}
          fielddata={fieldData}
          onblur={get(props, 'handleBlur') || false}
          changed={(e, result) => this.props[metaInfo.store].formChange(e, result, metaInfo.form)}
          label={get(props, 'label') || false}
          {...props}
        />
      );
    }

    RadioGroup = (name, props) => {
      const fieldData = this.props[metaInfo.store][metaInfo.form].fields[name];
      return (
        <FormRadioGroup
          fielddata={fieldData}
          name={name}
          changed={(e, result) => this.props[metaInfo.store].formChange(e, result, metaInfo.form)}
          containerclassname="button-radio center-align"
          showerror={fieldData.showError}
          {...props}
        />
      );
    }

    CodeInput = (name, props) => {
      const fieldData = this.props[metaInfo.store][metaInfo.form].fields[name];
      return (
        <ReactCodeInput
          fields={props.fields || 6}
          type="number"
          filterChars
          className="otp-field"
          pattern="[0-9]*"
          inputmode="numeric"
          fielddata={fieldData}
          onChange={e => this.props[metaInfo.store].eventFormChange({ name, value: e }, metaInfo.form)}
          {...props}
        />
      );
    }

    Address = props => (
      <Address
        fielddata={pick(this.props[metaInfo.store][metaInfo.form].fields, ['street', 'city', 'state', 'streetTwo', 'zipCode'])}
        changed={(e, result) => this.props[metaInfo.store].formChange(e, result, metaInfo.form)}
        populateData={place => this.props[metaInfo.store].setAddressFields(place, metaInfo.form)}
        maskchanged={(values, name) => this.props[metaInfo.store].maskChange(values, name, metaInfo.form)}
        {...props}
      />
    )

    DropZone = (name, props) => (
      <DropZone
        name={name}
        multiple={this.props[metaInfo.store][metaInfo.form].fields[name].multiple || get(props, 'multiple')}
        label={this.props[metaInfo.store][metaInfo.form].fields[name].label}
        fielddata={this.props[metaInfo.store][metaInfo.form].fields[name]}
        ondrop={files => this.props[metaInfo.store].setFileUploadData(metaInfo.form, name, this.props[metaInfo.store][metaInfo.form].fields[name].multiple || get(props, 'multiple'), get(props, 'index'), get(props, 'arrayName'), get(props, 'stepName') || this.props[metaInfo.store][metaInfo.form].fields[name].stepName, files, { userRole: metaInfo.userRole || get(props, 'userRole'), investorId: get(props, 'investorId') || '', offeringId: get(props, 'offeringId') || '', applicationId: get(props, 'applicationId') || '', applicationIssuerId: get(props, 'applicationIssuerId') || '', tags: get(props, 'tags') || '' })}
        onremove={(field, index) => this.props[metaInfo.store].removeUploadedData(metaInfo.form, field, index)}
        containerclassname="fluid"
      />
    )

    RadioGroup = (name, props) => {
      const fieldData = this.props[metaInfo.store][metaInfo.form].fields[name];
      return (
        <FormRadioGroup
          fielddata={fieldData}
          name={name}
          changed={(e, result) => this.props[metaInfo.store].formChange(e, result, metaInfo.form)}
          containerclassname="button-radio center-align"
          showerror={fieldData.showError}
          {...props}
        />
      );
    }

    CodeInput = (name, props) => {
      const fieldData = this.props[metaInfo.store][metaInfo.form].fields[name];
      return (
        <ReactCodeInput
          fields={props.fields || 6}
          type="number"
          filterChars
          className="otp-field"
          pattern="[0-9]*"
          inputmode="numeric"
          fielddata={fieldData}
          onChange={e => this.props[metaInfo.store].eventFormChange({ name, value: e }, metaInfo.form)}
          {...props}
        />
      );
    }

    FormCheckBox = (name, props) => {
      const fieldData = this.props[metaInfo.store][metaInfo.form].fields[name];
      return (
        <FormCheckbox
          name={name}
          fielddata={fieldData}
          changed={(e, result) => this.props[metaInfo.store].formChange(e, result, metaInfo.form)}
          containerclassname="ui relaxed list"
          {...props}
        />
      );
    }

    FormSelect = (name, props) => {
      const fieldData = this.props[metaInfo.store][metaInfo.form].fields[name];
      return (
        <FormSelect
          containerwidth={8}
          name={name}
          placeholder="Select"
          fielddata={fieldData}
          changed={(e, result) => this.props[metaInfo.store].formChange(e, result, metaInfo.form)}
          {...props}
        />
      );
    }

    FormPasswordStrength = (name, props) => {
      const fieldData = this.props[metaInfo.store][metaInfo.form].fields[name];
      return (
        <FormPasswordStrength
          key={name}
          type="password"
          minLength={8}
          minScore={4}
          iconDisplay
          tooShortWord="Weak"
          scoreWords={['Weak', 'Weak', 'Okay', 'Good', 'Strong']}
          inputProps={{
            name: 'password', autoComplete: 'off', placeholder: 'Password',
          }}
          changed={(e, result) => this.props[metaInfo.store].passwordChange(e, result, metaInfo.form)}
          fielddata={fieldData}
          showRequiredError
          {...props}
        />
      );
    }

    Masked = (name, props) => {
      const fieldData = this.props[metaInfo.store][metaInfo.form].fields[name];
      return (
        <MaskedInput
          name={name}
          key={get(props, 'key')}
          value={fieldData.value}
          format={fieldData.format}
          fielddata={fieldData}
          showerror={fieldData.showError}
          // eslint-disable-next-line no-shadow
          changed={(values, name) => this.props[metaInfo.store].maskChange(values, name, metaInfo.form, fieldData.maskFormattedChange)}
          {...props}
        />
      );
    }

    FormDropDown = (name, props) => {
      const fieldData = this.props[metaInfo.store][metaInfo.form].fields[name];
      return (
        <FormDropDown
          name={name}
          selection
          fielddata={fieldData}
          onChange={(e, result) => this.props[metaInfo.store].formChange(e, result, metaInfo.form)}
          {...props}
        />
      );
    }

    render() {
      const smartElement = {
        Input: this.Input,
        DropDown: this.DropDown,
        Masked: this.Masked,
        Address: this.Address,
        FormPasswordStrength: this.FormPasswordStrength,
        CodeInput: this.CodeInput,
        FormSelect: this.FormSelect,
        DropZone: this.DropZone,
        RadioGroup: this.RadioGroup,
        FormCheckBox: this.FormCheckBox,
        FormDropDown: this.FormDropDown,
        TextArea: this.TextArea,
      };
      return (
        <WrappedComponent
          {...this.props}
          smartElement={smartElement}
        />
      );
    }
  })));
}

export default (formHoc);
