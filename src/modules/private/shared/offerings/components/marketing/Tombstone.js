import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Form, Header, Divider, Grid } from 'semantic-ui-react';
import ButtonGroupType2 from '../ButtonGroupType2';
import formHOC from '../../../../../../theme/form/formHOC';
import TombstoneMeta from './TombstoneMeta';
import TombstonePreview from './TombstonePreview';

const metaInfo = {
  store: 'manageOfferingStore',
  form: 'TOMBSTONE_BASIC_FRM',
};

@inject('manageOfferingStore', 'offeringsStore')
@withRouter
@observer
class Tombstone extends Component {
  uploadMedia = (name) => {
    this.props.manageOfferingStore.uploadMedia(name).then(() => this.forceUpdate());
  }

  render() {
    const { manageOfferingStore, smartElement, offeringsStore } = this.props;
    const { TOMBSTONE_BASIC_FRM } = manageOfferingStore;
    const isReadonly = false;
    return (
      <div className="inner-content-spacer">
        <Form>
          <TombstonePreview
            manageOfferingStore={manageOfferingStore}
            offeringsStore={offeringsStore}
          />
          <Grid columns="2">
            <Grid.Column>
              <Header as="h4">{TOMBSTONE_BASIC_FRM.fields.image.label}</Header>
              {smartElement.ImageCropper('image', { disabled: isReadonly, uploadMedia: this.uploadMedia })}
              <Divider hidden />
            </Grid.Column>
            <Grid.Column>
              <Header as="h4">Tombstone</Header>
              {smartElement.Input('customTag', { readOnly: isReadonly })}
              {smartElement.FormTextarea('description', { readOnly: isReadonly, containerclassname: 'secondary' })}
              {smartElement.FormCheckBox('toggleMeta', { defaults: true, containerclassname: 'ui list' })}
            </Grid.Column>
          </Grid>
          <TombstoneMeta />
          <Divider section />
          <ButtonGroupType2
            submitted={false}
            isManager={false}
            approved={false}
            updateOffer={this.handleFormSubmit}
          />
        </Form>
      </div>
    );
  }
}

export default formHOC(Tombstone, metaInfo);
