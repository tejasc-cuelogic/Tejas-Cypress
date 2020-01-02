import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Form, Header, Divider, Grid } from 'semantic-ui-react';
import OfferingButtonGroup from '../OfferingButtonGroup';
import formHOC from '../../../../../../theme/form/formHOC';
import TombstoneMeta from './TombstoneMeta';
import TombstonePreview from './TombstonePreview';

const metaInfo = {
  store: 'manageOfferingStore',
  form: 'TOMBSTONE_BASIC_FRM',
};

@inject('manageOfferingStore')
@withRouter
@observer
class Tombstone extends Component {
  uploadMedia = (name) => {
    this.props.manageOfferingStore.uploadMedia(name);
  }

  removeMedia = (form, name) => {
    console.log(form, name);
  }

  handleFormSubmit = () => {
    const params = {
      keyName: 'tombstone',
      forms: ['TOMBSTONE_BASIC_FRM', 'TOMBSTONE_META_FRM'],
    };
    this.props.manageOfferingStore.updateOffering(params);
  }

  render() {
    const { manageOfferingStore, smartElement } = this.props;
    const { TOMBSTONE_BASIC_FRM } = manageOfferingStore;
    const isReadonly = false;
    return (
      <div className="inner-content-spacer">
        <Form>
          <TombstonePreview />
          <Grid columns="2">
            <Grid.Column>
              <Header as="h4">{TOMBSTONE_BASIC_FRM.fields.image.label}</Header>
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
          <TombstoneMeta />
          <Divider section />
          <OfferingButtonGroup
            updateOffer={this.handleFormSubmit}
          />
        </Form>
      </div>
    );
  }
}

export default formHOC(Tombstone, metaInfo);
