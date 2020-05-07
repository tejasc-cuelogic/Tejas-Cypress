import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Form, Header, Divider, Grid } from 'semantic-ui-react';
import OfferingButtonGroup from '../../../shared/offerings/components/OfferingButtonGroup';
import formHOC from '../../../../../theme/form/formHOC';
import CardHeaderMeta from './CardHeaderMeta';

const metaInfo = {
  store: 'collectionStore',
  form: 'CARD_HEADER_META_FRM',
};

@inject('offeringCreationStore')
@withRouter
@observer
class CollectionHeader extends Component {
  constructor(props) {
    super(props);
    this.props.collectionStore.setFormData('CARD_HEADER_SOCIAL_FRM', 'marketing.header');
  }

  removeMedia = (form, name) => {
    window.logger(form, name);
  }

  handleFormSubmit = () => {
    const params = {
      keyName: 'header',
      forms: ['CARD_HEADER_META_FRM', 'CARD_HEADER_SOCIAL_FRM'],
    };
    this.props.collectionStore.upsertCollection(params);
  }

  render() {
    const { collectionStore, smartElement } = this.props;
    const { CARD_HEADER_META_FRM, collectionId } = collectionStore;
    const isReadOnly = false;
    return (
      <div className="inner-content-spacer">
        <Form>
          <Header as="h3">Header Preview</Header>
          <Grid columns="2">
            <Grid.Column>
              {smartElement.Input('title', {
                readOnly: isReadOnly,
                // fielddata: CARD_HEADER_META_FRM.fields.title,
              })}
            </Grid.Column>
            <Grid.Column>
              {smartElement.Input('bgColor', {
                readOnly: isReadOnly,
              })}
            </Grid.Column>
          </Grid>
          <Grid columns="2">
            <Grid.Column>
              <Header as="h4">{CARD_HEADER_META_FRM.fields.image.label}</Header>
              {smartElement.ImageCropper('image', {
                uploadPath: `collection/${collectionId}`,
                removeMedia: this.removeMedia,
                isImagePreviewDisabled: true,
              })}
            </Grid.Column>
            <Grid.Column>
              <Header as="h4">{CARD_HEADER_META_FRM.fields.bgImage.label}</Header>
              {smartElement.ImageCropper('bgImage', {
                uploadPath: `collection/${collectionId}`,
                removeMedia: this.removeMedia,
                isImagePreviewDisabled: true,
              })}
              <Divider hidden />
            </Grid.Column>
          </Grid>
          <Grid>
            <Header as="h4">Tombstone</Header>
            <Form.Group widths={1}>
              <Form.Field>
                <Header as="h6">{CARD_HEADER_META_FRM.fields.description.label}</Header>
                {smartElement.HtmlEditor('description', {
                  imageUploadPath: `collection/${collectionId}`,
                })}
              </Form.Field>
            </Form.Group>
          </Grid>
          <Grid columns="2">
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
          </Grid>
          <CardHeaderMeta />
          <Divider section />
          <OfferingButtonGroup isDisable={!(CARD_HEADER_META_FRM.meta.isValid)} updateOffer={this.handleFormSubmit} />
        </Form>
      </div>
    );
  }
}

export default formHOC(CollectionHeader, metaInfo);
