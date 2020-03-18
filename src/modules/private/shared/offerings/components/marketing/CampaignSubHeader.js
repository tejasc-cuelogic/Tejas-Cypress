import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Form, Divider, Grid } from 'semantic-ui-react';
import OfferingButtonGroup from '../OfferingButtonGroup';
import formHOC from '../../../../../../theme/form/formHOC';
import TombstoneHeaderMeta from './TombstoneHeaderMeta';

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
    console.log(form, name);
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
    const { SUB_HEADER_BASIC_FRM } = manageOfferingStore;
    return (
      <div className="inner-content-spacer">
        <Form>
          <Divider hidden />
          <Divider section />
          <Grid columns="1">
            <Grid.Column>
              {smartElement.FormCheckBox('toggleMeta', { fielddata: SUB_HEADER_BASIC_FRM.fields.toggleMeta, defaults: true, containerclassname: 'ui list field', label: 'Sub Header Toggle Meta' })}
            </Grid.Column>
          </Grid>
          <TombstoneHeaderMeta hideHighlight noAddMore title="Sub Header Meta" />
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
