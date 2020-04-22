import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Form, Divider, Grid } from 'semantic-ui-react';
import OfferingButtonGroup from '../OfferingButtonGroup';
import formHOC from '../../../../../../theme/form/formHOC';
import TombstoneHeaderMeta from './TombstoneHeaderMeta';
import CampaignSubHeaderPreview from './CampaignSubHeaderPreview';

const metaInfo = {
  store: 'manageOfferingStore',
  form: 'SUB_HEADER_BASIC_FRM',
};

@inject('manageOfferingStore')
@withRouter
@observer
class CampaignSubHeader extends Component {
  constructor(props) {
    super(props);
    this.props.manageOfferingStore.setFormData('TOMBSTONE_HEADER_META_FRM', 'subHeader');
  }

  uploadMedia = (name) => {
    this.props.manageOfferingStore.uploadMedia(name, 'SUB_HEADER_BASIC_FRM');
  }

  removeMedia = (form, name) => {
    window.logger(form, name);
  }

  handleFormSubmit = () => {
    const params = {
      keyName: 'subHeader',
      forms: ['SUB_HEADER_BASIC_FRM', 'TOMBSTONE_HEADER_META_FRM'],
      cleanData: true,
    };
    this.props.manageOfferingStore.updateOffering(params);
  }

  render() {
    const { smartElement, manageOfferingStore } = this.props;
    const { SUB_HEADER_BASIC_FRM, campaignStatus } = manageOfferingStore;
    const isReadOnly = campaignStatus.lock;
    return (
      <div className="inner-content-spacer">
        <Form>
          <Grid>
            {smartElement.RadioGroup('stage', { displayMode: isReadOnly })}
          </Grid>
          <Grid columns="5">
            {['closeDate', 'raisedAmount', 'investorCount', 'repaymentCount'].map(field => (
              <Grid.Column>
                {smartElement.Masked(field, { prefix: field === 'raisedAmount' ? '$' : '', currency: field === 'raisedAmount', dateOfBirth: field === 'closeDate', displayMode: isReadOnly })}
              </Grid.Column>
            ))}
          </Grid>
          <Divider hidden />
          <CampaignSubHeaderPreview />
          <Divider section />
          <Grid columns="1">
            <Grid.Column>
              {smartElement.FormCheckBox('toggleMeta', { fielddata: SUB_HEADER_BASIC_FRM.fields.toggleMeta, defaults: true, containerclassname: 'ui list field', label: 'Display Toggle' })}
            </Grid.Column>
          </Grid>
          <TombstoneHeaderMeta hideHighlight noAddMore title="Additional Fields" />
          <Divider section />
          <OfferingButtonGroup
            updateOffer={this.handleFormSubmit}
          />
        </Form>
      </div>
    );
  }
}

export default formHOC(CampaignSubHeader, metaInfo);