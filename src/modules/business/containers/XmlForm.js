import React from 'react';
import { Form, Divider, Button } from 'semantic-ui-react';
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
        <Form className="edgar-form">
          <Form.Group widths="equal">
            <Form.Select
              fluid
              label="Select Business Filing"
              loading={this.props.uiStore.dropdownLoader}
              options={this.props.businessStore.offeringList}
              placeholder="Select Business Filing"
              onChange={this.handleSelectChange}
              className="column"
              width={8}
            />
            {/* <Dropdown
              fluid
              search
              selection
              loading={this.props.uiStore.dropdownLoader}
              options={this.props.businessStore.offeringList}
              placeholder="Select Business Filing"
              onChange={this.handleSelectChange}
            /> */}
            <Form.Input
              label="Website URL"
              defaultValue={this.props.businessStore.offeringUrl}
              onChange={this.handleUrlChange}
              className="column"
              width={8}
            />
          </Form.Group>
          <FilerInformation />
          <IssuerInformation />
          <OfferingInformation />
          <AnnualReportDisclosureRequirements />
          <Signature />
          <FileSelector />
          <Divider section />
          <div
            className="form-footer"
            style={{
            paddingBottom: '40px',
            }}
          >
            <Button color="green" size="large" onClick={this.handleFormSubmit}>
              Submit
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}
