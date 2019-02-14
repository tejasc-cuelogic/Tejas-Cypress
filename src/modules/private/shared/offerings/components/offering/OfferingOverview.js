import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Divider, Header, Button, Confirm } from 'semantic-ui-react';
import { FormTextarea, FormInput, DropZoneConfirm as DropZone } from '../../../../../../theme/form';
import ButtonGroup from '../ButtonGroup';
import HtmlEditor from '../../../../../shared/HtmlEditor';

@inject('offeringCreationStore', 'userStore', 'offeringsStore')
@observer
export default class OfferingOverview extends Component {
  componentWillMount() {
    this.props.offeringCreationStore.setFormData('OFFERING_COMPANY_FRM', 'offering.about');
    this.props.offeringCreationStore.setFormData('COMPANY_LAUNCH_FRM', 'offering.launch');
    this.props.offeringCreationStore.setFormData('OFFERING_OVERVIEW_FRM', 'offering.overview');
  }
  onFileDrop = (files, name) => {
    this.props.offeringCreationStore.uploadFileToS3('OFFERING_OVERVIEW_FRM', name, files);
  }
  handleDelDoc = (field) => {
    this.props.offeringCreationStore.removeFileFromS3('OFFERING_OVERVIEW_FRM', field);
  }
  toggleConfirmModal = (e, index, formName) => {
    e.preventDefault();
    this.props.offeringCreationStore.toggleConfirmModal(index, formName);
  }
  removeData = (confirmModalName, arrayName = 'highlight') => {
    this.props.offeringCreationStore.removeData(confirmModalName, arrayName);
  }
  addNewBullet = (e) => {
    e.preventDefault();
    this.props.offeringCreationStore.addMore('OFFERING_OVERVIEW_FRM', 'highlight');
  }
  handleFormSubmit = (isApproved = null) => {
    const {
      OFFERING_OVERVIEW_FRM,
      currentOfferingId, updateOffering,
    } = this.props.offeringCreationStore;
    updateOffering(currentOfferingId, OFFERING_OVERVIEW_FRM.fields, 'offering', 'overview', true, undefined, isApproved);
  }
  editorChange =
  (field, value, form) => this.props.offeringCreationStore.rtEditorChange(field, value, form);
  render() {
    const {
      OFFERING_OVERVIEW_FRM, formArrayChange, confirmModal, confirmModalName, removeIndex,
    } = this.props.offeringCreationStore;
    const formName = 'OFFERING_OVERVIEW_FRM';
    const { isIssuer } = this.props.userStore;
    const { offer } = this.props.offeringsStore;
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    const isManager = access.asManager;
    const submitted = (offer && offer.offering && offer.offering.overview &&
      offer.offering.overview.submitted) ? offer.offering.overview.submitted : null;
    const approved = (offer && offer.offering && offer.offering.overview &&
      offer.offering.overview.approved) ? offer.offering.overview.approved : null;
    const issuerSubmitted = (offer && offer.offering && offer.offering.overview &&
      offer.offering.overview.issuerSubmitted) ? offer.offering.overview.issuerSubmitted : null;
    const isReadonly = ((isIssuer && issuerSubmitted) || (submitted && !isManager && !isIssuer) ||
      (isManager && approved && approved.status));
    return (
      <Form>
        <Header as="h4">Elevator pitch</Header>
        <HtmlEditor
          readOnly={isReadonly}
          changed={this.editorChange}
          name="elevatorPitch"
          form="OFFERING_OVERVIEW_FRM"
          content={OFFERING_OVERVIEW_FRM.fields.elevatorPitch.value}
        />
        <Header as="h4">{OFFERING_OVERVIEW_FRM.fields.tombstoneDescription.label}</Header>
        <FormTextarea
          readOnly={isReadonly}
          key="tombstoneDescription"
          name="tombstoneDescription"
          fielddata={OFFERING_OVERVIEW_FRM.fields.tombstoneDescription}
          changed={(e, result) => formArrayChange(e, result, formName)}
          containerclassname="secondary"
          hidelabel
        />
        <Divider section />
        <Header as="h4">Offering highlights (Top bullet points)</Header>
        {
          OFFERING_OVERVIEW_FRM.fields.highlight.map((highlights, index) => (
            <FormInput
              removed={!isReadonly && OFFERING_OVERVIEW_FRM.fields.highlight.length &&
                OFFERING_OVERVIEW_FRM.fields.highlight.length > 1 ?
                e => this.toggleConfirmModal(e, index, formName) : false}
              displayMode={isReadonly}
              name="highlight"
              label={`Bullet ${index + 1}`}
              fielddata={highlights.highlight}
              changed={(e, result) => formArrayChange(e, result, 'OFFERING_OVERVIEW_FRM', 'highlight', index)}
            />
          ))
        }
        <Button type="button" size="small" color="blue" className="link-button" onClick={e => this.addNewBullet(e)}>+ Add new bullet</Button>
        <Divider section />
        <Header as="h4">Social Media
          <Header.Subheader>
            Links to social media profiles where investors can learn more about offering
          </Header.Subheader>
        </Header>
        {
          ['facebook_url', 'linkedin_url', 'twitter_url', 'instagram_url', 'yelp_url'].map(field => (
            <FormInput
              displayMode={isReadonly}
              key={field}
              name={field}
              fielddata={OFFERING_OVERVIEW_FRM.fields[field]}
              changed={(e, result) => formArrayChange(e, result, formName)}
            />
          ))
        }
        <Divider section />
        <Header as="h4">Social media share links
          <Header.Subheader>
            Share links that go on the user’s social media to share the offering
          </Header.Subheader>
        </Header>
        <Header as="h6">Facebook</Header>
        <Form.Group>
          <FormInput
            displayMode={isReadonly}
            name="facebook_shareLink"
            containerwidth="10"
            fielddata={OFFERING_OVERVIEW_FRM.fields.facebook_shareLink}
            changed={(e, result) => formArrayChange(e, result, formName)}
          />
          <DropZone
            disabled={isReadonly}
            name="facebook_featuredImageUpload"
            fielddata={OFFERING_OVERVIEW_FRM.fields.facebook_featuredImageUpload}
            ondrop={(files, name) => this.onFileDrop(files, name)}
            onremove={field => this.handleDelDoc(field)}
            uploadtitle="Choose a file or drag it here"
            containerclassname="field six wide"
          />
        </Form.Group>
        <FormTextarea
          readOnly={isReadonly}
          name="facebook_blurb"
          fielddata={OFFERING_OVERVIEW_FRM.fields.facebook_blurb}
          changed={(e, result) => formArrayChange(e, result, formName)}
          containerclassname="secondary"
        />
        <Header as="h6">Twitter</Header>
        <Form.Group>
          <FormInput
            displayMode={isReadonly}
            name="twitter_shareLink"
            containerwidth="10"
            fielddata={OFFERING_OVERVIEW_FRM.fields.twitter_shareLink}
            changed={(e, result) => formArrayChange(e, result, formName)}
          />
          <DropZone
            disabled={isReadonly}
            name="twitter_featuredImageUpload"
            fielddata={OFFERING_OVERVIEW_FRM.fields.twitter_featuredImageUpload}
            ondrop={(files, name) => this.onFileDrop(files, name)}
            onremove={fieldName => this.handleDelDoc(fieldName)}
            uploadtitle="Choose a file or drag it here"
            containerclassname="field six wide"
          />
        </Form.Group>
        <FormTextarea
          readOnly={isReadonly}
          name="twitter_blurb"
          fielddata={OFFERING_OVERVIEW_FRM.fields.twitter_blurb}
          changed={(e, result) => formArrayChange(e, result, formName)}
          containerclassname="secondary"
        />
        <Divider section />
        <Header as="h4">Google
          <Header.Subheader>
            Google metadata that shows up when people search for the offering
          </Header.Subheader>
        </Header>
        <FormTextarea
          readOnly={isReadonly}
          name="googleMeta"
          fielddata={OFFERING_OVERVIEW_FRM.fields.googleMeta}
          changed={(e, result) => formArrayChange(e, result, formName)}
          containerclassname="secondary"
        />
        <Divider hidden />
        <ButtonGroup
          isIssuer={isIssuer}
          submitted={submitted}
          isManager={isManager}
          formValid={OFFERING_OVERVIEW_FRM.meta.isValid}
          approved={approved}
          updateOffer={this.handleFormSubmit}
          issuerSubmitted={issuerSubmitted}
        />
        <Confirm
          header="Confirm"
          content={`Are you sure you want to remove this bullet ${removeIndex + 1}?`}
          open={confirmModal}
          onCancel={this.toggleConfirmModal}
          onConfirm={() => this.removeData(confirmModalName)}
          size="mini"
          className="deletion"
        />
      </Form>
    );
  }
}

