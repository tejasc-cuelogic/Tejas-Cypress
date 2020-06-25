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
          <Grid>
            {smartElement.RadioGroup('stage', { displayMode: isReadOnly })}
          </Grid>
          <Grid columns="5">
            {['launchDate', 'closeDate', 'hardCloseDate', 'raisedAmount', 'investorCount'].map(field => (
              <Grid.Column>
                {smartElement.Masked(field, { prefix: field === 'raisedAmount' ? '$' : '', currency: field === 'raisedAmount', dateOfBirth: ['closeDate', 'launchDate', 'hardCloseDate'].includes(field), displayMode: isReadOnly })}
              </Grid.Column>
            ))}
          </Grid>
          <Divider hidden />
          <TombstonePreview />
          <Grid columns="2">
            <Grid.Column>
              <Header as="h4">{TOMBSTONE_BASIC_FRM.fields.image.label}</Header>
              {smartElement.ImageCropper('image', { disabled: isReadOnly, uploadPath: `offerings/${currentOfferingId}`, removeMedia: this.removeMedia, isImagePreviewDisabled: true })}
              <Divider hidden />
            </Grid.Column>
            <Grid.Column>
              {smartElement.Input('customTag', { readOnly: isReadOnly })}
              <Form.Group widths={1}>
                <Form.Field>
                  <Header as="h4">{TOMBSTONE_BASIC_FRM.fields.description.label}</Header>
                  {smartElement.HtmlEditor('description', { readOnly: isReadOnly, imageUploadPath: `offerings/${currentOfferingId}` })}
                </Form.Field>
              </Form.Group>
              <Divider hidden />
              {/* {smartElement.FormTextarea('description', { readOnly: isReadOnly, containerclassname: 'secondary' })} */}
              {smartElement.FormCheckBox('toggleMeta', { defaults: true, toggle: true, containerclassname: 'ui list field', label: 'Display Toggle' })}
              {smartElement.FormCheckBox('showOfferedBy', { customClass: 'custom-toggle', defaults: true, toggle: true })}
              {smartElement.Input('offeredBy')}
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
