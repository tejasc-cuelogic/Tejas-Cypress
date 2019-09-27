/*  eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Header, Button, Divider, Confirm, Icon, Popup, Grid } from 'semantic-ui-react';
import { withRouter, Link } from 'react-router-dom';
import { FormInput, MaskedInput, FormTextarea, DropZoneConfirm as DropZone, AutoComplete, FormCheckbox, ImageCropper } from '../../../../../../theme/form';
import { Image64 } from '../../../../../../theme/shared';
import Helper from '../../../../../../helper/utility';
import { PROFILE_PHOTO_BYTES } from '../../../../../../services/constants/user';
import ButtonGroup from '../ButtonGroup';
import HtmlEditor from '../../../../../shared/HtmlEditor';

const HeaderWithTooltip = ({ header, tooltip }) => (
  <Header as="h4">
    {header}
    <Popup
      trigger={<Icon className="ns-help-circle" />}
      content={tooltip}
      position="top center"
      className="center-align"
      wide
    />
  </Header>
);

@inject('offeringCreationStore', 'uiStore', 'userStore', 'offeringsStore')
@withRouter
@observer
export default class Leader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leaderFormInvalid: false,
    };
    this.props.offeringCreationStore.setLeadershipExpData(this.props.index);
  }

  componentWillUnmount() {
    this.setState({ leaderFormInvalid: false });
  }

  onFileDrop = (files, name, index) => {
    this.props.offeringCreationStore.uploadFileToS3('LEADERSHIP_FRM', name, files, 'leadership', index);
  }

  setData = (attr, value, fieldName, index) => {
    this.props.offeringCreationStore.setLeadershipProfilePhoto(attr, value, fieldName, index);
  }

  handleDelDoc = (field) => {
    this.props.offeringCreationStore.removeUploadedDataMultiple('LEADERSHIP_FRM', field, this.props.index || 0, 'leadership', true);
  }

  toggleConfirmModal = (e, index, formName) => {
    e.preventDefault();
    this.props.offeringCreationStore.toggleConfirmModal(index, formName);
  }

  removeData = (confirmModalName, arrayName = 'leadership') => {
    this.props.offeringCreationStore.removeData(confirmModalName, arrayName);
    if (arrayName === 'leadership') {
      this.props.history.push(`${this.props.refLink}/leader/1`);
      this.handleFormSubmit(null, 'Leader has been deleted successfully.');
    }
  }

  handleFormSubmit = (isApproved = null, successMsg) => {
    const { LEADERSHIP_FRM, updateOffering, currentOfferingId } = this.props.offeringCreationStore;
    if (LEADERSHIP_FRM.fields.leadership[this.props.index || 0].email.value !== '' && (LEADERSHIP_FRM.fields.leadership[this.props.index || 0].email.error === undefined || LEADERSHIP_FRM.fields.leadership[this.props.index || 0].email.error === false)) {
      this.setState({ leaderFormInvalid: false });
      updateOffering(currentOfferingId, LEADERSHIP_FRM.fields, 'leadership', null, true, successMsg, isApproved, true, this.props.index || 0);
    } else {
      this.setState({ leaderFormInvalid: true });
    }
  }

  addMore = (e, formName, arrayName) => {
    e.preventDefault();
    this.props.offeringCreationStore.addMore(formName, arrayName);
  }

  handleVerifyFileSize = (fileSize, field) => {
    if (fileSize > PROFILE_PHOTO_BYTES) {
      const leaderNumber = this.props.index;
      const index = leaderNumber || 0;
      const attr = 'error';
      const errorMsg = 'File size cannot be more than 5 MB.';
      this.props.offeringCreationStore.setLeadershipProfilePhoto(attr, errorMsg, field, index);
      this.props.offeringCreationStore.setLeadershipProfilePhoto('value', '', field, index);
    }
  }

  handleVerifyFileExtension = (fileExt, field) => {
    const validate = Helper.validateImageExtension(fileExt);
    if (validate.isInvalid) {
      const leaderNumber = this.props.index;
      const index = leaderNumber || 0;
      const attr = 'error';
      const { errorMsg } = validate;
      this.props.offeringCreationStore.setLeadershipProfilePhoto(attr, errorMsg, field, index);
      this.props.offeringCreationStore.setLeadershipProfilePhoto('value', '', field, index);
    }
  }

  handleresetProfilePhoto = (field, index) => {
    this.props.offeringCreationStore.resetLeadershipProfilePhoto(field, index);
  }

  handelImageDeimension = (width, height, field) => {
    if (width < 200 || height < 200) {
      const leaderNumber = this.props.index;
      const index = leaderNumber || 0;
      const attr = 'error';
      const errorMsg = 'Image size should not be less than 200 x 200.';
      this.props.offeringCreationStore.setLeadershipProfilePhoto(attr, errorMsg, field, index);
      this.props.offeringCreationStore.setLeadershipProfilePhoto('value', '', field, index);
    }
  }

  uploadMedia = (name) => {
    const leaderNumber = this.props.index;
    const index = leaderNumber || 0;
    this.props.offeringCreationStore.uploadMediaForLeadership(name, 'LEADERSHIP_FRM', index);
  }

  arrayFormChange = (e, result, formName, arrayName, index) => {
    this.setState({ leaderFormInvalid: false });
    this.props.offeringCreationStore.formArrayChange(e, result, formName, arrayName, index);
  }

  editorChange =
  (field, value, form, index) => this.props.offeringCreationStore.rtEditorChange(field, value, form, 'leadership', index);

  render() {
    const leaderNumber = this.props.index;
    const formName = 'LEADERSHIP_FRM';
    const index = leaderNumber || 0;
    const {
      LEADERSHIP_EXP_FRM, confirmModal, confirmModalName, removeIndex, LEADERSHIP_FRM,
      formArrayChange, maskArrayChange, setAddressFields, currentOfferingId,
    } = this.props.offeringCreationStore;
    const { match } = this.props;
    const { isIssuer } = this.props.userStore;
    const { offer } = this.props.offeringsStore;
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    const isManager = access.asManager;
    const submitted = (offer && offer.leadership && offer.leadership[index]
      && offer.leadership[index].submitted) ? offer.leadership[index].submitted : null;
    const approved = (offer && offer.leadership && offer.leadership[index]
      && offer.leadership[index].approved) ? offer.leadership[index].approved : null;
    const issuerSubmitted = (offer && offer.leadership && offer.leadership[index]
      && offer.leadership[index].issuerSubmitted) ? offer.leadership[index].issuerSubmitted : null;
    const isReadonly = ((isIssuer && issuerSubmitted) || (submitted && !isManager && !isIssuer)
      || (isManager && approved && approved.status));
    const leaderCount = LEADERSHIP_FRM.fields.leadership.length;
    return (
      <>
        <Form className={isIssuer && !match.url.includes('offering-creation') ? 'ui card fluid form-card' : ''}>
          <Header as="h4">
            {`Leader ${index + 1}`}
            {!isReadonly && leaderCount > 1
              && (
<Button.Group size="mini" floated="right">
                <Button inverted color="red" content="Delete Leader" onClick={e => this.toggleConfirmModal(e, index, formName)} />
              </Button.Group>
              )
            }
          </Header>
          <FormCheckbox
            disabled={isReadonly}
            fielddata={LEADERSHIP_FRM.fields.leadership[index].isPublic}
            name="isPublic"
            changed={(e, result) => formArrayChange(e, result, formName, 'leadership', index)}
            defaults
            containerclassname="ui relaxed list"
          />
          <Header as="h4">Personal Info</Header>
          <Form.Group widths={2}>
            {
              ['firstName', 'lastName', 'email'].map(field => (
                <FormInput
                  displayMode={isReadonly}
                  name={field}
                  fielddata={LEADERSHIP_FRM.fields.leadership[index][field]}
                  changed={(e, result) => this.arrayFormChange(e, result, formName, 'leadership', index)}
                />
              ))
            }
            <MaskedInput
              displayMode={isReadonly}
              name="number"
              fielddata={LEADERSHIP_FRM.fields.leadership[index].number}
              format="(###) ###-####"
              changed={(values, name) => maskArrayChange(values, formName, name, 'leadership', index)}
              phoneNumber
            />
          </Form.Group>
          <Form.Group widths={3}>
            <MaskedInput
              displayMode={isReadonly}
              name="dob"
              fielddata={LEADERSHIP_FRM.fields.leadership[index].dob}
              format="##/##/####"
              changed={(values, name) => maskArrayChange(values, formName, name, 'leadership', index)}
              dateOfBirth
            />
            <FormInput
              displayMode={isReadonly}
              name="citizenship"
              fielddata={LEADERSHIP_FRM.fields.leadership[index].citizenship}
              changed={(e, result) => formArrayChange(e, result, formName, 'leadership', index)}
            />
            <MaskedInput
              displayMode={isReadonly}
              name="percentOwned"
              fielddata={LEADERSHIP_FRM.fields.leadership[index].percentOwned}
              percentage
              allowNegative={false}
              changed={(values, name) => maskArrayChange(values, formName, name, 'leadership', index)}
            />
            <FormInput
              displayMode={isReadonly}
              name="companyPosition"
              fielddata={LEADERSHIP_FRM.fields.leadership[index].companyPosition}
              changed={(e, result) => formArrayChange(e, result, formName, 'leadership', index)}
            />
            <MaskedInput
              displayMode={isReadonly}
              name="dateOfService"
              fielddata={LEADERSHIP_FRM.fields.leadership[index].dateOfService}
              format="##/##/####"
              changed={(values, name) => maskArrayChange(values, formName, name, 'leadership', index)}
              dateOfBirth
            />
          {isReadonly
            ? (
              <FormInput
                key="ssn"
                name="ssn"
                fielddata={Helper.encrypSsnNumberByForm(LEADERSHIP_FRM.fields.leadership[index]).ssn}
                changed={(e, result) => formArrayChange(e, result, formName)}
                displayMode={isReadonly}
              />
            )
            : (
                <MaskedInput
                  name="ssn"
                  type="tel"
                  fielddata={LEADERSHIP_FRM.fields.leadership[index].ssn}
                  ssn
                  changed={(values, name) => maskArrayChange(values, formName, name, 'leadership', index)}
                />
            )}

          </Form.Group>
          <Header as="h4">Address</Header>
          <AutoComplete
            displayMode={isReadonly}
            readOnly={isReadonly}
            name="street"
            fielddata={LEADERSHIP_FRM.fields.leadership[index].street}
            onplaceselected={place => setAddressFields(place, index)}
            changed={(e, result) => formArrayChange(e, result, formName, 'leadership', index)}
            placeHolder="Street Address, City, State, Zip"
          />
          <Form.Group widths="equal">
            {
              ['city', 'state'].map(field => (
                <FormInput
                  displayMode={isReadonly}
                  name={field}
                  fielddata={LEADERSHIP_FRM.fields.leadership[index][field]}
                  changed={(e, result) => formArrayChange(e, result, formName, 'leadership', index)}
                />
              ))
            }
            <MaskedInput
              displayMode={isReadonly}
              name="zip"
              fielddata={LEADERSHIP_FRM.fields.leadership[index].zip}
              changed={(values, name) => maskArrayChange(values, formName, name, 'leadership', index)}
              zipCode
            />
          </Form.Group>
          <HeaderWithTooltip header="Bio" tooltip="To be used on the public offering page" />
          <HtmlEditor
            imageUploadPath={`offerings/${currentOfferingId}`}
            readOnly={isReadonly}
            changed={this.editorChange}
            index={index}
            name="bio"
            form="LEADERSHIP_FRM"
            content={LEADERSHIP_FRM.fields.leadership[index].bio.value}
          />
          <Divider section />
          <HeaderWithTooltip header="Website and Social Profiles" tooltip="To be used on the public offering page" />
          {
            ['website', 'facebook', 'linkedin', 'twitter'].map(field => (
              <FormInput
                displayMode={isReadonly}
                name={field}
                fielddata={LEADERSHIP_FRM.fields.leadership[index][field]}
                changed={(e, result) => formArrayChange(e, result, formName, 'leadership', index)}
              />
            ))
          }
          <Divider section />
          <Header as="h4">Uploads</Header>
          <Grid stackable>
            <Grid.Column width="6">
              <div className="ui form cropper-wrap headshot-img">
                <Form.Field>
                  <label>Headshot image</label>
                  {LEADERSHIP_FRM.fields.leadership[index].headshot.value ? (
                    <div className="file-uploader attached">
                      {!isReadonly
                        && <Button onClick={() => this.handleDelDoc('headshot')} circular icon={{ className: 'ns-close-light' }} />
                      }
                      <Image64
                        srcUrl={LEADERSHIP_FRM.fields.leadership[index].headshot.preSignedUrl}
                      />
                    </div>
                  ) : (
                    <ImageCropper
                      disabled={isReadonly}
                      fieldData={LEADERSHIP_FRM.fields.leadership[index].headshot}
                      setData={(attr, value) => this.setData(attr, value, 'headshot', index)}
                      verifySize={this.handleVerifyFileSize}
                      verifyExtension={this.handleVerifyFileExtension}
                      handelReset={() => this.handleresetProfilePhoto('headshot', index)}
                      verifyImageDimension={this.handelImageDeimension}
                      field={LEADERSHIP_FRM.fields.leadership[index].headshot}
                      modalUploadAction={this.uploadMedia}
                      name="headshot"
                      cropInModal
                      aspect={1 / 1}
                    />
                  )}
                </Form.Field>
              </div>
            </Grid.Column>
            <Grid.Column width="10">
              <div className="ui form cropper-wrap hero-img">
                <Form.Field>
                  <label>Hero image</label>
                  {LEADERSHIP_FRM.fields.leadership[index].heroImage.value ? (
                    <div className="file-uploader attached">
                      {!isReadonly
                      && <Button onClick={() => this.handleDelDoc('heroImage')} circular icon={{ className: 'ns-close-light' }} />
                      }
                      <Image64
                        srcUrl={LEADERSHIP_FRM.fields.leadership[index].heroImage.preSignedUrl}
                      />
                    </div>
                  ) : (
                    <ImageCropper
                      disabled={isReadonly}
                      fieldData={LEADERSHIP_FRM.fields.leadership[index].heroImage}
                      setData={(attr, value) => this.setData(attr, value, 'heroImage', index)}
                      verifySize={this.handleVerifyFileSize}
                      verifyExtension={this.handleVerifyFileExtension}
                      handelReset={() => this.handleresetProfilePhoto('heroImage', index)}
                      verifyImageDimension={this.handelImageDeimension}
                      field={LEADERSHIP_FRM.fields.leadership[index].heroImage}
                      modalUploadAction={this.uploadMedia}
                      name="heroImage"
                      cropInModal
                      aspect={16 / 9}
                    />
                  )}
                </Form.Field>
              </div>
            </Grid.Column>
          </Grid>
          <Divider hidden />
          <Form.Group widths={3}>
            {['license'].map(field => (
              <DropZone
                disabled={isReadonly}
                name={field}
                fielddata={LEADERSHIP_FRM.fields.leadership[index][field]}
                ondrop={(files, name) => this.onFileDrop(files, name, index)}
                onremove={fieldName => this.handleDelDoc(fieldName)}
                uploadtitle="Upload a file"
                tooltip={field !== 'license' ? 'To be used on the public offering page' : false}
                containerclassname="field"
              />
            ))}
          </Form.Group>
          <Divider section />
          <Header as="h4">
            Experience
            {!isReadonly && LEADERSHIP_EXP_FRM.fields.employer.length < 5
              && <Link to={this.props.match.url} className="link" onClick={e => this.addMore(e, 'LEADERSHIP_EXP_FRM', 'employer')}><small>+ Add another business</small></Link>
            }
          </Header>
          {
            LEADERSHIP_EXP_FRM.fields.employer.map((exp, index2) => (
              <>
                <Header as="h6">
                  {`Business ${index2 + 1}`}
                  {!isReadonly && LEADERSHIP_EXP_FRM.fields.employer.length > 1
                    && (
<Link to={this.props.match.url} className="link" onClick={e => this.toggleConfirmModal(e, index2, 'LEADERSHIP_EXP_FRM')}>
                      <Icon className="ns-close-circle" color="grey" />
                    </Link>
                    )
                  }
                </Header>
                <div className="featured-section">
                  <Form.Group widths={2}>
                    {
                      ['name', 'type'].map(field => (
                        <FormInput
                          displayMode={isReadonly}
                          name={field}
                          fielddata={exp[field]}
                          changed={(e, result) => formArrayChange(e, result, 'LEADERSHIP_EXP_FRM', 'employer', index2, index)}
                        />
                      ))
                    }
                    <MaskedInput
                      displayMode={isReadonly}
                      name="dateOfService"
                      fielddata={exp.dateOfService}
                      format="##-##-####"
                      changed={(values, name) => maskArrayChange(values, 'LEADERSHIP_EXP_FRM', name, 'employer', index2, index)}
                      dateOfBirth
                    />
                    <FormInput
                      displayMode={isReadonly}
                      name="title"
                      fielddata={exp.title}
                      changed={(e, result) => formArrayChange(e, result, 'LEADERSHIP_EXP_FRM', 'employer', index2, index)}
                    />
                  </Form.Group>
                  <FormTextarea
                    readOnly={isReadonly}
                    name="description"
                    fielddata={exp.description}
                    changed={(e, result) => formArrayChange(e, result, 'LEADERSHIP_EXP_FRM', 'employer', index2, index)}
                    containerclassname="secondary"
                  />
                </div>
              </>
            ))
          }
          <Divider section />
          <Header as="h4">Other Business Information</Header>
          {
            ['otherEntities', 'promoters'].map(field => (
              <FormTextarea
                readOnly={isReadonly}
                name={field}
                fielddata={LEADERSHIP_FRM.fields.leadership[index][field]}
                changed={(e, result) => formArrayChange(e, result, formName, 'leadership', index)}
                containerclassname="secondary"
              />
            ))
          }
          <Divider hidden />
          <ButtonGroup
            isIssuer={isIssuer}
            submitted={submitted}
            isManager={isManager}
            approved={approved}
            updateOffer={isApproved => this.handleFormSubmit(isApproved, 'Leadership has been Updated Successfully')}
            issuerSubmitted={issuerSubmitted}
            leaderFormInvalid={this.state.leaderFormInvalid}
          />
        </Form>
        <Confirm
          header="Confirm"
          content={`Are you sure you want to remove this ${confirmModalName === 'LEADERSHIP_FRM' ? 'leader' : 'business'} ${removeIndex + 1}?`}
          open={confirmModal}
          onCancel={this.toggleConfirmModal}
          onConfirm={() => this.removeData(confirmModalName, confirmModalName === 'LEADERSHIP_FRM' ? 'leadership' : 'employer')}
          size="mini"
          className="deletion"
        />
      </>
    );
  }
}
