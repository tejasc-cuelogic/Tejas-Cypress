import React from 'react';
import { observer, inject } from 'mobx-react';
import { get, pick } from 'lodash';
import ReactCodeInput from 'react-code-input';
import { Button, Form, Confirm, Header, Responsive, Icon } from 'semantic-ui-react';
import {
  ImageCropper, FormTextarea, FormInput, MaskedInput, FormPasswordStrength, FormSelect, DropZoneConfirm as DropZone, FormRadioGroup, FormCheckbox, FormDropDown, FormColorPikcer,
} from '.';
import Address from './src/Address';
import HtmlEditor from '../../modules/shared/HtmlEditor';
import { Image64 } from '../shared';
import Helper from '../../helper/utility';

function formHoc(WrappedComponent, metaInfo) {
  // eslint-disable-next-line no-unused-expressions
  return inject(metaInfo.store, 'nsUiStore')(observer((class extends React.Component {
    constructor(props) {
      super(props);
      this.fieldsData = this.props[metaInfo.store][metaInfo.form].fields;
    }

    Input = (name, props) => {
      const fieldData = get(props, 'fielddata') || ((get(props, 'multiForm') ? this.props[metaInfo.store][props.multiForm[0]].fields[props.multiForm[1]][props.multiForm[2]][name] : this.fieldsData[name]));
      return (
        <FormInput
          name={name}
          key={name}
          type="text"
          format={get(fieldData, 'format')}
          fielddata={fieldData}
          onblur={get(props, 'handleBlur') || false}
          changed={(e, result) => this.props[metaInfo.store].formChange(e, result, (get(props, 'multiForm') || metaInfo.form))}
          label={get(props, 'label') || false}
          {...props}
        />
      );
    }

    TextArea = (name, props) => {
      const fieldData = get(props, 'fielddata') || ((get(props, 'multiForm') ? this.fieldsData[props.multiForm[1]][props.multiForm[2]][name] : this.fieldsData[name]));
      return (
        <FormTextarea
          name={name}
          key={name}
          type="text"
          format={get(fieldData, 'format')}
          fielddata={fieldData}
          onblur={get(props, 'handleBlur') || false}
          changed={(e, result) => this.props[metaInfo.store].formChange(e, result, (get(props, 'multiForm') || metaInfo.form))}
          label={get(props, 'label') || false}
          {...props}
        />
      );
    }

    CodeInput = (name, props) => {
      const fieldData = this.fieldData[name];
      return (
        <ReactCodeInput
          fields={props.fields || 6}
          type="number"
          filterChars
          className="otp-field"
          pattern="[0-9]*"
          inputmode="numeric"
          autocomplete="one-time-code"
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
        ondrop={(files, field) => (props.S3Upload ? this.props[metaInfo.store].uploadMedia(field, metaInfo.form, props.uploadPath, files) : this.props[metaInfo.store].setFileUploadData(metaInfo.form, name, this.props[metaInfo.store][metaInfo.form].fields[name].multiple || get(props, 'multiple'), get(props, 'index'), get(props, 'arrayName'), get(props, 'stepName') || this.props[metaInfo.store][metaInfo.form].fields[name].stepName, files, { userRole: metaInfo.userRole || get(props, 'userRole'), investorId: get(props, 'investorId') || '', offeringId: get(props, 'offeringId') || '', applicationId: get(props, 'applicationId') || '', applicationIssuerId: get(props, 'applicationIssuerId') || '', tags: get(props, 'tags') || '' }))}
        onremove={(field, index) => this.props[metaInfo.store].removeUploadedData(metaInfo.form, field, index)}
        containerclassname="fluid"
        {...props}
      />
    )

    RadioGroup = (name, props) => {
      const fieldData = get(props, 'fielddata') || ((get(props, 'multiForm') ? this.fieldsData[props.multiForm[1]][props.multiForm[2]][name] : this.fieldsData[name]));
      return (
        <div className="field">
          <Header as="label">{get(fieldData, 'label') || props.title}</Header>
          <FormRadioGroup
            fielddata={fieldData}
            name={name}
            changed={(e, result) => this.props[metaInfo.store].formChange(e, result, (get(props, 'multiForm') || metaInfo.form))}
            showerror={get(fieldData, 'showError')}
            {...props}
          />
        </div>
      );
    }

    CodeInput = (name, props) => {
      const fieldData = get(props, 'fielddata') || this.fieldsData[name];
      return (
        <ReactCodeInput
          fields={props.fields || 6}
          type="number"
          filterChars
          className="otp-field"
          pattern="[0-9]*"
          inputmode="numeric"
          autocomplete="one-time-code"
          fielddata={fieldData}
          onChange={e => this.props[metaInfo.store].eventFormChange({ name, value: e }, metaInfo.form)}
          {...props}
        />
      );
    }

    FormCheckBox = (name, props) => {
      const fieldData = get(props, 'fielddata') || ((get(props, 'multiForm') ? this.fieldsData[props.multiForm[1]][props.multiForm[2]][name] : this.fieldsData[name]));
      return (
        <FormCheckbox
          name={name}
          fielddata={fieldData}
          changed={(e, result) => this.props[metaInfo.store].formChange(e, result, (get(props, 'multiForm') || metaInfo.form), '', get(props, 'toggle') ? { value: result.checked } : false)}
          containerclassname={`ui relaxed list mr-10 ${get(props, 'customClass')}`}
          {...props}
        />
      );
    }

    FormSelect = (name, props) => {
      const fieldData = get(props, 'fielddata') || ((get(props, 'multiForm') ? this.fieldsData[props.multiForm[1]][props.multiForm[2]][name] : this.fieldsData[name]));
      return (
        <FormSelect
          name={name}
          placeholder="Select"
          fielddata={fieldData}
          changed={(e, result) => this.props[metaInfo.store].formChange(e, result, (get(props, 'multiForm') || metaInfo.form))}
          options={get(props, 'options') || fieldData.options}
          {...props}
        />
      );
    }

    FormPasswordStrength = (name, props) => {
      const fieldData = get(props, 'fielddata') || this.fieldsData[name];
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
          userInputs={
            get(props, 'userInputs')
          }
          changed={(e, result) => this.props[metaInfo.store].passwordChange(e, result, metaInfo.form)}
          fielddata={fieldData}
          showRequiredError
          {...props}
        />
      );
    }

    // Masked = (name, props) => {
    //   const fieldData = get(props, 'fielddata') || this.fieldsData[name];
    //   return (
    //     <MaskedInput
    //       name={name}
    //       key={get(props, 'key')}
    //       value={fieldData.value}
    //       format={fieldData.format}
    //       fielddata={fieldData}
    //       showerror={fieldData.showError}
    //       // eslint-disable-next-line no-shadow
    //       changed={(values, name) => this.props[metaInfo.store].maskChange(values, name, metaInfo.form, fieldData.maskFormattedChange)}
    //       {...props}
    //     />
    //   );
    // }

    Masked = (name, props) => {
      const fieldData = get(props, 'fielddata') || ((get(props, 'multiForm') ? this.fieldsData[props.multiForm[1]][props.multiForm[2]][name] : this.fieldsData[name]));
      return (
        <MaskedInput
          name={name}
          key={get(props, 'key')}
          value={fieldData.value}
          format={fieldData.format}
          fielddata={fieldData}
          showerror={fieldData.showError}
          // eslint-disable-next-line no-shadow
          changed={(values, name) => this.props[metaInfo.store].maskChange(values, name, (get(props, 'multiForm') || metaInfo.form), fieldData.maskFormattedChange)}
          {...props}
        />
      );
    }


    // FormDropDown = (name, props) => {
    //   const fieldData = get(props, 'fielddata') || this.fieldsData[name];
    //   return (
    //     <FormDropDown
    //       name={name}
    //       selection
    //       fielddata={fieldData}
    //       changed={(e, result) => this.props[metaInfo.store].formChange(e, result, metaInfo.form)}
    //       {...props}
    //     />
    //   );
    // }

    FormDropDown = (name, props) => {
      const fieldData = get(props, 'fielddata') || ((get(props, 'multiForm') ? this.fieldsData[props.multiForm[1]][props.multiForm[2]][name] : this.fieldsData[name]));
      return (
        <FormDropDown
          containerwidth={get(props, 'containerwidth') || 8}
          name={name}
          selection
          fielddata={fieldData}
          options={get(props, 'options') || fieldData.options}
          onChange={(e, result) => this.props[metaInfo.store].formChange(e, result, (get(props, 'multiForm') || metaInfo.form), props.multiple ? 'dropdown' : false)}
          {...props}
        />
      );
    }

    FormTextarea = (name, props) => {
      const fieldData = get(props, 'fielddata') || this.fieldsData[name];
      return (
        <FormTextarea
          name={name}
          fielddata={fieldData}
          changed={(e, result) => this.props[metaInfo.store].formChange(e, result, metaInfo.form)}
          containerclassname="secondary"
          {...props}
        />
      );
    }

    HtmlEditor = (name, props) => {
      const fieldData = get(props, 'fielddata') || ((get(props, 'multiForm') ? this.fieldsData[props.multiForm[1]][props.multiForm[2]][name] : this.fieldsData[name]));
      return (
        <HtmlEditor
          name={name}
          content={fieldData.value}
          form={metaInfo.form}
          changed={(field, value, form, index) => this.props[metaInfo.store].editorChange(field, value, form, get(props, 'multiForm') ? props.multiForm[1] : undefined, get(props, 'multiForm') ? props.multiForm[2] : index)}
          {...props}
        />
      );
    }

    ImageCropper = (name, props) => {
      const fieldData = get(props, 'fielddata') || ((get(props, 'multiForm') ? this.props[metaInfo.store][props.multiForm[0]].fields[props.multiForm[1]][props.multiForm[2]][name] : this.fieldsData[name]));
      const arrayName = Array.isArray(get(props, 'multiForm')) ? get(props, 'multiForm')[1] : false;
      const index = Array.isArray(get(props, 'multiForm')) ? get(props, 'multiForm')[2] : -1;
      const handleVerifyFileExtension = (fileExt, field) => {
        const validate = Helper.validateImageExtension(fileExt);
        if (validate.isInvalid) {
          const attr = 'error';
          const { errorMsg } = validate;
          this.props[metaInfo.store].setMediaAttribute(get(props, 'multiForm') || metaInfo.form, attr, errorMsg, field, index, arrayName);
          this.props[metaInfo.store].setMediaAttribute(get(props, 'multiForm') || metaInfo.form, 'value', '', field, index, arrayName);
        }
      };
      const handelImageDimension = (width, height, field) => {
        if (width < 200 || height < 200) {
          const attr = 'error';
          const errorMsg = 'Image size should not be less than 200 x 200.';
          this.props[metaInfo.store].setMediaAttribute(get(props, 'multiForm') || metaInfo.form, attr, errorMsg, field, index, arrayName);
          this.props[metaInfo.store].setMediaAttribute(get(props, 'multiForm') || metaInfo.form, 'value', '', field, index, arrayName);
        }
      };
      const setData = (attr, value) => {
        this.props[metaInfo.store].setMediaAttribute(get(props, 'multiForm') || metaInfo.form, attr, value, name, index, arrayName);
      };
      const handleResetImageCropper = () => {
        this.props[metaInfo.store].resetImageCropper(get(props, 'multiForm') || metaInfo.form, name, index, arrayName);
      };
      const setConfirmModal = (val) => {
        this.props[metaInfo.store].setMediaAttribute(get(props, 'multiForm') || metaInfo.form, 'confirmModal', val, name, index, arrayName);
      };
      const handleRemoveConfirm = () => {
        if (props.removeMedia) {
          props.removeMedia(get(props, 'multiForm') || metaInfo.form, name);
        }
        this.props[metaInfo.store].resetImageCropper(get(props, 'multiForm') || metaInfo.form, name, index, arrayName);
      };
      const handleFileUploadLoader = fileId => this.props[metaInfo.store].handleUploadLoader(fileId);
      return (
        <Form className={`${!props.isImagePreviewDisabled ? 'cropper-wrap' : ''} tombstone-img`}>
          {fieldData.preSignedUrl && !props.isImagePreviewDisabled ? (
            <div className="file-uploader attached" style={get(props, 'style')}>
              {!props.isReadonly
                && <Button onClick={() => setConfirmModal(true)} circular icon={{ className: 'ns-close-light' }} />
              }
              <Image64 srcUrl={fieldData.preSignedUrl} />
              <Confirm
                content="Are you sure you want to remove this media file?"
                open={fieldData.confirmModal}
                onCancel={() => setConfirmModal(false)}
                onConfirm={handleRemoveConfirm}
                size="mini"
                className="deletion"
              />
            </div>
          ) : fieldData.value && props.isImagePreviewDisabled ? (
            <div className="file-uploader attached">
              <Responsive
                as={Button}
                minWidth={768}
                size="tiny"
                compact
                className="ghost-button remove pull-right"
                onClick={() => setConfirmModal(true)}
              >
                Remove
                    </Responsive>
              <Responsive
                as={Icon}
                maxWidth={767}
                name="remove"
                className="pull-right"
                onClick={() => setConfirmModal(true)}
              />
              {handleFileUploadLoader(fieldData.fileId) ? 'Loading...'
                : <span title={fieldData.value}>{fieldData.value}</span>
              }
              <Confirm
                content="Are you sure you want to remove this media file?"
                open={fieldData.confirmModal}
                onCancel={() => setConfirmModal(false)}
                onConfirm={handleRemoveConfirm}
                size="mini"
                className="deletion"
              />
            </div>
          ) : (
                <ImageCropper
                  disabled={props.isReadonly}
                  fieldData={fieldData}
                  setData={(attr, value) => setData(attr, value)}
                  verifyExtension={handleVerifyFileExtension}
                  handelReset={handleResetImageCropper}
                  verifyImageDimension={handelImageDimension}
                  field={fieldData}
                  modalUploadAction={fieldName => this.props[metaInfo.store].uploadMedia(fieldName, (get(props, 'multiForm') || metaInfo.form), props.uploadPath)}
                  name={name}
                  cropInModal
                  aspect={3 / 2}
                  size="small"
                />
              )
          }
        </Form>
      );
    }

    ColorPikcer = (name, props) => {
      const fieldData = get(props, 'fielddata') || ((get(props, 'multiForm') ? this.fieldsData[props.multiForm[1]][props.multiForm[2]][name] : this.fieldsData[name]));
      return (
        <FormColorPikcer
          fieldData={fieldData}
          name={name}
          // props={props}
          onblur={get(props, 'handleBlur') || false}
          changed={(e, result) => this.props[metaInfo.store].formChange(e, result, (get(props, 'multiForm') || metaInfo.form))}
          metaInfo={metaInfo}
          {...props}
        />
      );
    }

    render() {
      const { currTime } = this.props[metaInfo.store];
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
        FormTextarea: this.FormTextarea,
        ImageCropper: this.ImageCropper,
        HtmlEditor: this.HtmlEditor,
        TextArea: this.TextArea,
        ColorPikcer: this.ColorPikcer,
      };
      return (
        <WrappedComponent
          {...this.props}
          smartElement={smartElement}
          currTime={currTime}
        />
      );
    }
  })));
}

export default (formHoc);
