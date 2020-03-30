import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Form, Header, Divider, Grid } from 'semantic-ui-react';
import OfferingButtonGroup from '../OfferingButtonGroup';
import formHOC from '../../../../../../theme/form/formHOC';
import TombstoneHeaderMeta from './TombstoneHeaderMeta';
import CampaignHeaderPreview from './CampaignHeaderPreview';
import CampaignHeaderSocial from './CampaignHeaderSocial';

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
    window.logger(form, name);
  }

  handleFormSubmit = () => {
    const params = {
      keyName: 'header',
      forms: ['HEADER_BASIC_FRM', 'TOMBSTONE_HEADER_META_FRM', 'OFFERING_MISC_FRM'],
    };
    this.props.manageOfferingStore.updateOffering(params);
  }

  render() {
    const { manageOfferingStore, offeringCreationStore, smartElement } = this.props;
    const { HEADER_BASIC_FRM, campaignStatus } = manageOfferingStore;
    const { currentOfferingId } = offeringCreationStore;
    const isReadOnly = campaignStatus.lock;
    return (
      <div className="inner-content-spacer">
        <Form>
          <Grid columns="5">
            {['closeDate', 'raisedAmount', 'investorCount', 'repaymentCount', 'earlyBird'].map(field => (
              <Grid.Column>
                {smartElement.Masked(field, { prefix: field === 'raisedAmount' ? '$' : false, currency: field === 'raisedAmount', dateOfBirth: field === 'closeDate', displayMode: isReadOnly })}
              </Grid.Column>
            ))}
          </Grid>
          <Divider hidden />
          <CampaignHeaderPreview newLayout />
          <Divider hidden />
          <Divider section />
          <Grid columns="2">
            <Grid.Column>
              <Header as="h4">{HEADER_BASIC_FRM.fields.heroImage.label}</Header>
              {smartElement.ImageCropper('heroImage', { disabled: isReadOnly, uploadPath: `offerings/${currentOfferingId}`, removeMedia: this.removeMedia })}
              <Divider hidden />
            </Grid.Column>
            <Grid.Column>
            <Header as="h4">{HEADER_BASIC_FRM.fields.heroBackgroundImage.label}</Header>
              {smartElement.ImageCropper('heroBackgroundImage', { disabled: isReadOnly, uploadPath: `offerings/${currentOfferingId}`, removeMedia: this.removeMedia })}
              <Divider hidden />
            </Grid.Column>
          </Grid>
          <Grid columns="2">
            <Grid.Column>
              {smartElement.Input('heroVideoURL', { displayMode: isReadOnly })}
            </Grid.Column>
            <Grid.Column>
              {smartElement.FormCheckBox('toggleMeta', { defaults: true, containerclassname: 'ui list field', label: 'Header Toggle Meta' })}
            </Grid.Column>
          </Grid>
          <CampaignHeaderSocial />
          <TombstoneHeaderMeta hideHighlight title="Header Meta" />
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
