import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Form, Header, Divider, Grid } from 'semantic-ui-react';
import OfferingButtonGroup from '../OfferingButtonGroup';
import formHOC from '../../../../../../theme/form/formHOC';
import TombstoneHeaderMeta from './TombstoneHeaderMeta';
import TombstonePreview from './TombstonePreview';

const metaInfo = {
  store: 'manageOfferingStore',
  form: 'TOMBSTONE_BASIC_FRM',
};

@inject('manageOfferingStore', 'offeringCreationStore')
@withRouter
@observer
class Tombstone extends Component {
  constructor(props) {
    super(props);
    this.props.manageOfferingStore.setFormData('TOMBSTONE_HEADER_META_FRM', 'tombstone');
  }

  removeMedia = (form, name) => {
    window.logger(form, name);
  }

  handleFormSubmit = () => {
    const params = {
      keyName: 'tombstone',
      forms: ['TOMBSTONE_BASIC_FRM', 'TOMBSTONE_HEADER_META_FRM'],
    };
    this.props.manageOfferingStore.updateOffering(params);
  }

  render() {
    const { manageOfferingStore, offeringCreationStore, smartElement } = this.props;
    const { TOMBSTONE_BASIC_FRM, campaignStatus } = manageOfferingStore;
    const { currentOfferingId } = offeringCreationStore;
    const isReadOnly = campaignStatus.lock;
    return (
      <div className="inner-content-spacer">
        <Form>
          <TombstonePreview />
          <Grid columns="2">
            <Grid.Column>
              <Header as="h4">{TOMBSTONE_BASIC_FRM.fields.image.label}</Header>
              {smartElement.ImageCropper('image', { disabled: isReadOnly, uploadPath: `offerings/${currentOfferingId}`, removeMedia: this.removeMedia })}
              <Divider hidden />
            </Grid.Column>
            <Grid.Column>
              <Header as="h4">Tombstone</Header>
              {smartElement.Input('customTag', { readOnly: isReadOnly })}
              {smartElement.FormTextarea('description', { readOnly: isReadOnly, containerclassname: 'secondary' })}
              {smartElement.FormCheckBox('toggleMeta', { defaults: true, containerclassname: 'ui list field', label: 'Tombstone Toggle Meta' })}
            </Grid.Column>
          </Grid>
          <TombstoneHeaderMeta />
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
