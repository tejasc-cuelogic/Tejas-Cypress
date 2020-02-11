import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Form, Header, Divider, Grid } from 'semantic-ui-react';
import OfferingButtonGroup from '../OfferingButtonGroup';
import formHOC from '../../../../../../theme/form/formHOC';
import TombstoneMeta from './TombstoneMeta';
import CampaignHeaderPreview from './CampaignHeaderPreview';

const metaInfo = {
  store: 'manageOfferingStore',
  form: 'HEADER_BASIC_FRM',
};

@inject('manageOfferingStore', 'offeringCreationStore')
@withRouter
@observer
class CampaignHeader extends Component {
  constructor(props) {
    super(props);
    this.props.manageOfferingStore.setFormData('TOMBSTONE_HEADER_META_FRM', 'header');
  }

  uploadMedia = (name) => {
    this.props.manageOfferingStore.uploadMedia(name, 'HEADER_BASIC_FRM');
  }

  removeMedia = (form, name) => {
    console.log(form, name);
  }

  handleFormSubmit = () => {
    const params = {
      keyName: 'header',
      forms: ['HEADER_BASIC_FRM', 'TOMBSTONE_HEADER_META_FRM'],
    };
    this.props.manageOfferingStore.updateOffering(params);
  }

  render() {
    const { manageOfferingStore, offeringCreationStore, smartElement } = this.props;
    const { HEADER_BASIC_FRM } = manageOfferingStore;
    const { currentOfferingId } = offeringCreationStore;
    const isReadonly = false;
    return (
      <div className="inner-content-spacer">
        <Form>
          <CampaignHeaderPreview newLayout />
          <Divider hidden />
          <Divider section />
          <Grid columns="2">
            <Grid.Column>
              <Header as="h4">{HEADER_BASIC_FRM.fields.heroImage.label}</Header>
              {smartElement.ImageCropper('heroImage', { disabled: isReadonly, uploadPath: `offerings/${currentOfferingId}`, removeMedia: this.removeMedia })}
              <Divider hidden />
            </Grid.Column>
            <Grid.Column>
            <Header as="h4">{HEADER_BASIC_FRM.fields.heroBackgroundImage.label}</Header>
              {smartElement.ImageCropper('heroBackgroundImage', { disabled: isReadonly, uploadPath: `offerings/${currentOfferingId}`, removeMedia: this.removeMedia })}
              <Divider hidden />
            </Grid.Column>
          </Grid>
          <Grid columns="2">
            <Grid.Column>
              {smartElement.Input('heroVideoURL', { readOnly: isReadonly })}
            </Grid.Column>
            <Grid.Column>
              {smartElement.FormCheckBox('toggleMeta', { defaults: true, containerclassname: 'ui list field', label: 'Header Toggle Meta' })}
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

export default formHOC(CampaignHeader, metaInfo);
