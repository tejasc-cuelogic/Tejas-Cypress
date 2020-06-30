import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Form, Header, Divider, Grid } from 'semantic-ui-react';
import OfferingButtonGroup from '../OfferingButtonGroup';
import formHOC from '../../../../../../theme/form/formHOC';
import SocialLinks from '../../../marketing/SocialLinks';

const metaInfo = {
  store: 'manageOfferingStore',
  form: 'OFFERING_MISC_FRM',
};

@inject('manageOfferingStore', 'offeringCreationStore')
@withRouter
@observer
class Misc extends Component {
  onFileDrop = (files, name) => {
    this.props.manageOfferingStore.uploadFileToS3('OFFERING_MISC_FRM', name, files);
  }

  removeMedia = (form, name) => {
    window.logger(form, name);
  }

  handleFormSubmit = () => {
    const params = {
      keyName: 'misc',
      forms: 'OFFERING_MISC_FRM',
    };
    this.props.manageOfferingStore.updateOffering(params);
  }

  render() {
    const { smartElement, manageOfferingStore, offeringCreationStore } = this.props;
    const { currentOfferingId } = offeringCreationStore;
    const { OFFERING_MISC_FRM, campaignStatus } = manageOfferingStore;
    const isReadOnly = campaignStatus.lock;
    return (
      <div className="inner-content-spacer">
        <Form>
          <Grid columns="2">
            <Grid.Column>
              <Header as="h4">{OFFERING_MISC_FRM.fields.logo.label}</Header>
              {smartElement.ImageCropper('logo', { disabled: isReadOnly, uploadPath: `offerings/${currentOfferingId}`, removeMedia: this.removeMedia })}
              <Divider hidden />
            </Grid.Column>
            <Grid.Column>
              <Header as="h4">{OFFERING_MISC_FRM.fields.avatar.label}</Header>
              {smartElement.ImageCropper('avatar', { disabled: isReadOnly, uploadPath: `offerings/${currentOfferingId}`, removeMedia: this.removeMedia })}            </Grid.Column>
          </Grid>
          <Form.Field>
            <Header as="h6">{OFFERING_MISC_FRM.fields.issuerStatement.label}</Header>
            {smartElement.HtmlEditor('issuerStatement', { readOnly: isReadOnly, imageUploadPath: `offerings/${currentOfferingId}` })}
          </Form.Field>
          {/* <Header as="h4">Social Media
            <Header.Subheader>
              Links to social media profiles where investors can learn more about offering
            </Header.Subheader>
          </Header>
          {
            ['facebook_url', 'linkedin_url', 'twitter_url', 'instagram_url', 'yelp_url'].map(field => (
              smartElement.Input(field, { displayMode: isReadOnly, key: field })
            ))
          }
          <Divider section /> */}
          <SocialLinks {...this.props} store={metaInfo.store} form={metaInfo.form} uploadPath={`offerings/${currentOfferingId}`} />
          <OfferingButtonGroup
            updateOffer={this.handleFormSubmit}
          />
        </Form>
      </div>
    );
  }
}

export default formHOC(Misc, metaInfo);
