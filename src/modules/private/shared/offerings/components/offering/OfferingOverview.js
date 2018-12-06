import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Form, Divider, Header, Button } from 'semantic-ui-react';
import { FormTextarea, FormInput, DropZoneConfirm as DropZone } from '../../../../../../theme/form';
import ButtonGroup from '../ButtonGroup';

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
  render() {
    const {
      OFFERING_OVERVIEW_FRM,
      formArrayChange,
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
        {
          ['elevatorPitch', 'tombstoneDescription'].map(field => (
            <Aux>
              <Header as="h4">{OFFERING_OVERVIEW_FRM.fields[field].label}</Header>
              <FormTextarea
                readOnly={isReadonly}
                key={field}
                name={field}
                fielddata={OFFERING_OVERVIEW_FRM.fields[field]}
                changed={(e, result) => formArrayChange(e, result, formName)}
                containerclassname="secondary"
                hidelabel
              />
              <Divider section />
            </Aux>
          ))
        }
        <Header as="h4">Offering highlights (Top bullet points)</Header>
        {
          OFFERING_OVERVIEW_FRM.fields.highlight.map((highlights, index) => (
            <FormInput
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
        <FormInput
          displayMode={isReadonly}
          name="facebook_shareLink"
          fielddata={OFFERING_OVERVIEW_FRM.fields.facebook_shareLink}
          changed={(e, result) => formArrayChange(e, result, formName)}
        />
        <FormTextarea
          readOnly={isReadonly}
          name="facebook_blurb"
          fielddata={OFFERING_OVERVIEW_FRM.fields.facebook_blurb}
          changed={(e, result) => formArrayChange(e, result, formName)}
          containerclassname="secondary"
        />
        <DropZone
          disabled={isReadonly}
          name="facebook_featuredImageUpload"
          fielddata={OFFERING_OVERVIEW_FRM.fields.facebook_featuredImageUpload}
          ondrop={(files, name) => this.onFileDrop(files, name)}
          onremove={field => this.handleDelDoc(field)}
          uploadtitle="Choose a file or drag it here"
          containerclassname="field"
        />
        <Header as="h6">Twitter</Header>
        <FormInput
          displayMode={isReadonly}
          name="twitter_shareLink"
          fielddata={OFFERING_OVERVIEW_FRM.fields.twitter_shareLink}
          changed={(e, result) => formArrayChange(e, result, formName)}
        />
        <FormTextarea
          readOnly={isReadonly}
          name="twitter_blurb"
          fielddata={OFFERING_OVERVIEW_FRM.fields.twitter_blurb}
          changed={(e, result) => formArrayChange(e, result, formName)}
          containerclassname="secondary"
        />
        <DropZone
          disabled={isReadonly}
          name="twitter_featuredImageUpload"
          fielddata={OFFERING_OVERVIEW_FRM.fields.twitter_featuredImageUpload}
          ondrop={(files, name) => this.onFileDrop(files, name)}
          onremove={fieldName => this.handleDelDoc(fieldName)}
          uploadtitle="Choose a file or drag it here"
          containerclassname="field"
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
      </Form>
    );
  }
}

