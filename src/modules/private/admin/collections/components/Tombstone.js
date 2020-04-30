import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Form, Header, Divider, Grid } from 'semantic-ui-react';
import OfferingButtonGroup from '../../../shared/offerings/components/OfferingButtonGroup';
import formHOC from '../../../../../theme/form/formHOC';
import TombstonePreview from '../../../shared/offerings/components/marketing/TombstonePreview';

const metaInfo = {
  store: 'collectionStore',
  form: 'TOMBSTONE_FRM',
};

@inject('collectionStore', 'offeringCreationStore')
@withRouter
@observer
class Tombstone extends Component {
  removeMedia = (form, name) => {
    window.logger(form, name);
  }

  handleFormSubmit = () => {
    const params = {
      keyName: 'tombstone',
      forms: ['TOMBSTONE_FRM'], // 'TOMBSTONE_HEADER_META_FRM'
    };
    this.props.collectionStore.upsertCollection(params);
  }

  render() {
    const { collectionStore, offeringCreationStore, smartElement } = this.props;
    const { TOMBSTONE_FRM } = collectionStore;
    const { currentOfferingId } = offeringCreationStore;
    const isReadOnly = false;
    return (
      <div className="inner-content-spacer">
        <Form>
          <TombstonePreview />
          <Grid columns="2">
            <Grid.Column>
              <Header as="h4">{TOMBSTONE_FRM.fields.image.label}</Header>
              {smartElement.ImageCropper('image', { uploadPath: `offerings/${currentOfferingId}`, removeMedia: this.removeMedia, isImagePreviewDisabled: true })}
              <Divider hidden />
              <Header as="h4">{TOMBSTONE_FRM.fields.bgImage.label}</Header>
              {smartElement.ImageCropper('bgImage', { uploadPath: `offerings/${currentOfferingId}`, removeMedia: this.removeMedia, isImagePreviewDisabled: true })}
              <Divider hidden />
            </Grid.Column>
            <Grid.Column>
              <Header as="h4">Tombstone</Header>
              <Form.Group widths={1}>
                <Form.Field>
                  <Header as="h6">{TOMBSTONE_FRM.fields.description.label}</Header>
                  {smartElement.HtmlEditor('description', { imageUploadPath: `offerings/${currentOfferingId}` })}
                </Form.Field>
              </Form.Group>
              <Divider hidden />
              {/* {smartElement.FormTextarea('description', { containerclassname: 'secondary' })} */}
            </Grid.Column>
          </Grid>
          <Grid columns="2">
            <Grid.Column>
              {smartElement.Input('title', {
                readOnly: isReadOnly,
                // changed: (e, result) => customFormArrayChange(e, result, 'TOMBSTONE_FRM'),
              })}
            </Grid.Column>
            <Grid.Column>
              {smartElement.Input('bgColor', {
                readOnly: isReadOnly,
                // changed: (e, result) => customFormArrayChange(e, result, 'TOMBSTONE_FRM'),
              })}
            </Grid.Column>
          </Grid>
          <Grid columns="2">
            <Grid.Column>
              {smartElement.Input('color', {
                readOnly: isReadOnly,
                // changed: (e, result) => customFormArrayChange(e, result, 'TOMBSTONE_FRM'),
              })}
            </Grid.Column>
            <Grid.Column>
              {smartElement.Input('text', {
                readOnly: isReadOnly,
                // changed: (e, result) => customFormArrayChange(e, result, 'TOMBSTONE_FRM'),
              })}
            </Grid.Column>
          </Grid>
          {/* <Grid columns="2">
            {Object.keys(TOMBSTONE_FRM.fields.tag).map(field => (
              <Grid.Column>
                {smartElement.Input(field, {
                  fielddata: TOMBSTONE_FRM.fields.tag[field],
                  changed: (e, result) => customFormArrayChange(e, result, 'TOMBSTONE_FRM', 'tag'),
                })}
              </Grid.Column>
            ))}
          </Grid> */}
          <Divider section />
          <OfferingButtonGroup updateOffer={() => this.handleFormSubmit()} />
        </Form>
      </div>
    );
  }
}

export default formHOC(Tombstone, metaInfo);
