import React from 'react';
import { Grid, Form, Divider, Button, Dropdown } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import FilerInformation from './xmlFormContainers/FilerInformation';
import IssuerInformation from './xmlFormContainers/IssuerInformation';
import OfferingInformation from './xmlFormContainers/OfferingInformation';
import AnnualReportDisclosureRequirements from './xmlFormContainers/AnnualReportDisclosureRequirements';
import Signature from './xmlFormContainers/Signature';
import FileSelector from './xmlFormContainers/FileSelector';
import businessActions from '../../../actions/business';

@inject('businessStore', 'uiStore')
@observer
export default class XmlForm extends React.Component {
  componentWillMount() {
    businessActions.listOfferings();
  }
  handleUrlChange = (e, { value }) => {
    this.props.businessStore.setOfferingUrl(value);
  }
  handleSelectChange = (e, { value }) => this.props.businessStore.setOfferingId(value);

  handleFormSubmit = (e) => {
    e.preventDefault();
    businessActions.generateXml();
  };

  render() {
    return (
      <div className="content-spacer">
        <Grid stackable className="edgar-form">
          <Form size="large" onSubmit={this.handleFormSubmit}>
            <Dropdown
              fluid
              search
              selection
              loading={this.props.uiStore.dropdownLoader}
              options={this.props.businessStore.offeringList}
              placeholder="Select Business Filing"
              onChange={this.handleSelectChange}
            />
            <Form.Input
              label="Website URL"
              defaultValue={this.props.businessStore.offeringUrl}
              onChange={this.handleUrlChange}
            />
            <FilerInformation />
            <IssuerInformation />
            <OfferingInformation />
            <AnnualReportDisclosureRequirements />
            <Signature />
            <FileSelector />
            <Button fluid color="green" size="large">
              Sign Up
            </Button>
            <Divider section />
          </Form>
        </Grid>
      </div>
    );
  }
}
