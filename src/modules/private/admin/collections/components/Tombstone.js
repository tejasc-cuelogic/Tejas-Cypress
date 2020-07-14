import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Form, Header, Divider, Grid } from 'semantic-ui-react';
import OfferingButtonGroup from '../../../shared/offerings/components/OfferingButtonGroup';
import formHOC from '../../../../../theme/form/formHOC';
import TombstonePreview from './TombstonePreview';

const metaInfo = {
  store: 'collectionStore',
  form: 'TOMBSTONE_FRM',
};

@inject('offeringCreationStore')
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
    const { collectionStore, smartElement } = this.props;
    const { TOMBSTONE_FRM, collectionId, isLocked } = collectionStore;
    return (
      <div className="inner-content-spacer">
        <Form>
          <Header as="h3">Card Preview</Header>
          <TombstonePreview />
          <Grid columns="2">
            <Grid.Column>
              {smartElement.Input('title', {
                readOnly: isLocked,
                // fielddata: TOMBSTONE_FRM.fields.title,
              })}
            </Grid.Column>
            <Grid.Column>
              {smartElement.ColorPikcer('bgColor', {
                readOnly: isLocked,
              })}
            </Grid.Column>
          </Grid>
          <Grid columns="2">
            <Grid.Column>
              <Header as="h4">{TOMBSTONE_FRM.fields.image.label}</Header>
              {smartElement.ImageCropper('image', {
                uploadPath: `collection/${collectionId}`,
                removeMedia: this.removeMedia,
                isImagePreviewDisabled: true,
                disabled: isLocked,
              })}
            </Grid.Column>
            <Grid.Column>
              <Header as="h4">{TOMBSTONE_FRM.fields.bgImage.label}</Header>
              {smartElement.ImageCropper('bgImage', {
                uploadPath: `collection/${collectionId}`,
                removeMedia: this.removeMedia,
                isImagePreviewDisabled: true,
                disabled: isLocked,
              })}
              <Divider hidden />
            </Grid.Column>
          </Grid>
          <Grid columns="2">
            <Grid.Column>
              {smartElement.ColorPikcer('descriptionColor', {
                readOnly: isLocked,
              })}
              <Divider hidden />
              {smartElement.Input('text', {
                readOnly: isLocked,
              })}
              <Divider hidden />
              {smartElement.ColorPikcer('color', {
                readOnly: isLocked,
              })}
              <Divider hidden />
              {smartElement.ColorPikcer('textColor', {
                readOnly: isLocked,
              })}
              <Divider hidden />
            </Grid.Column>
            <Grid.Column>
                <Form.Field>
                  <Header as="h6">{TOMBSTONE_FRM.fields.description.label}</Header>
                  {smartElement.HtmlEditor('description', {
                    imageUploadPath: `collection/${collectionId}`,
                    readOnly: isLocked,
                  })}
                </Form.Field>
            </Grid.Column>
          </Grid>
          {/* <Grid columns="2">
            <Grid.Column>
              {smartElement.Input('text', {
                readOnly: isReadOnly,
              })}
            </Grid.Column>
            <Grid.Column>
              {smartElement.Input('color', {
                readOnly: isReadOnly,
              })}
            </Grid.Column>
          </Grid> */}
          <Divider section />
          <OfferingButtonGroup isDisable={!(TOMBSTONE_FRM.meta.isValid) || isLocked} updateOffer={this.handleFormSubmit} />
        </Form>
      </div>
    );
  }
}

export default formHOC(Tombstone, metaInfo);
