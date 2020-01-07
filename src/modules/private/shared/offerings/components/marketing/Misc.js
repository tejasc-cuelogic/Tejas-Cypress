import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { capitalize } from 'lodash';
import { Form, Header, Divider, Grid } from 'semantic-ui-react';
import OfferingButtonGroup from '../OfferingButtonGroup';
import formHOC from '../../../../../../theme/form/formHOC';

const metaInfo = {
  store: 'manageOfferingStore',
  form: 'OFFERING_MISC_FRM',
};

@inject('manageOfferingStore', 'offeringCreationStore')
@withRouter
@observer
class Misc extends Component {
  // constructor(props) {
  //   super(props);
  //   this.props.manageOfferingStore.setFormData('OFFERING_MISC_FRM', 'misc');
  // }

  uploadMedia = (name) => {
    this.props.manageOfferingStore.uploadMedia(name, 'OFFERING_MISC_FRM');
  }

  removeMedia = (form, name) => {
    console.log(form, name);
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
    const { OFFERING_MISC_FRM } = manageOfferingStore;
    const isReadonly = false;
    return (
      <div className="inner-content-spacer">
        <Form>
          <Grid columns="2">
            <Grid.Column>
            <Header as="h4">{OFFERING_MISC_FRM.fields.logo.label}</Header>
            {smartElement.ImageCropper('logo', { disabled: isReadonly, uploadMedia: this.uploadMedia, removeMedia: this.removeMedia })}
              <Divider hidden />
            </Grid.Column>
            <Grid.Column>
            <Header as="h4">{OFFERING_MISC_FRM.fields.avatar.label}</Header>
            {smartElement.ImageCropper('avatar', { disabled: isReadonly, uploadMedia: this.uploadMedia, removeMedia: this.removeMedia })}            </Grid.Column>
          </Grid>
          <Form.Group widths={1}>
            <Form.Field>
              <Header as="h6">{OFFERING_MISC_FRM.fields.issuerStatement.label}</Header>
              {smartElement.HtmlEditor('issuerStatement', { readOnly: isReadonly, imageUploadPath: `offerings/${currentOfferingId}` })}
            </Form.Field>
          </Form.Group>
          <Header as="h4">Social Media
            <Header.Subheader>
              Links to social media profiles where investors can learn more about offering
            </Header.Subheader>
          </Header>
          {
            ['facebook_url', 'linkedin_url', 'twitter_url', 'instagram_url', 'yelp_url'].map(field => (
              smartElement.Input(field, { displayMode: isReadonly, key: field })
            ))
          }
          <Divider section />
          <Header as="h4">Social media share links
            <Header.Subheader>
              Share links that go on the user’s social media to share the offering
            </Header.Subheader>
          </Header>
          {
            ['facebook', 'twitter'].map(field => (
              <>
                <Header as="h6">{capitalize(field)}</Header>
                <Form.Group>
                  {smartElement.Input(`${field}_shareLink`, { displayMode: isReadonly, key: field, containerwidth: '10' })}
                  {smartElement.DropZone(`${field}_featuredImageUpload`, { displayMode: isReadonly, key: field, uploadtitle: 'Choose a file or drag it here', containerclassname: 'field six wide' })}
                  {/* <DropZone
                    disabled={isReadonly}
                    name="facebook_featuredImageUpload"
                    fielddata={OFFERING_OVERVIEW_FRM.fields.facebook_featuredImageUpload}
                    ondrop={(files, name) => this.onFileDrop(files, name)}
                    onremove={field => this.handleDelDoc(field)}
                    uploadtitle="Choose a file or drag it here"
                    containerclassname="field six wide"
                  /> */}
                </Form.Group>
                {smartElement.FormTextarea(`${field}_blurb`, { readOnly: isReadonly, containerclassname: 'secondary' })}
              </>
            ))
          }
          {/* <Grid columns="2">
            <Grid.Column>
              <Header as="h4">{OFFERING_MISC_FRM.fields.image.label}</Header>
              {smartElement.ImageCropper('image', { disabled: isReadonly, uploadMedia: this.uploadMedia, removeMedia: this.removeMedia })}
              <Divider hidden />
            </Grid.Column>
            <Grid.Column>
              <Header as="h4">Tombstone</Header>
              {smartElement.Input('customTag', { readOnly: isReadonly })}
              {smartElement.FormTextarea('description', { readOnly: isReadonly, containerclassname: 'secondary' })}
              {smartElement.FormCheckBox('toggleMeta', { defaults: true, containerclassname: 'ui list field', label: 'Tombstone Toggle Meta' })}
            </Grid.Column>
          </Grid>
          <Divider section /> */}
          <OfferingButtonGroup
            updateOffer={this.handleFormSubmit}
          />
        </Form>
      </div>
    );
  }
}

export default formHOC(Misc, metaInfo);
