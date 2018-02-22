import React from 'react';
import { Grid, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import FilerInformation from '../components/FilerInformation';
import IssuerInformation from '../components/IssuerInformation';
import OfferingInformation from '../components/OfferingInformation';
import AnnualReportDisclosureRequirements from '../components/AnnualReportDisclosureRequirements';
import Signature from '../components/Signature';

@inject('businessStore')
@observer
export default class XmlForm extends React.Component {
  handleFilerInputChange = (e, { name, value }) => {
    this.props.businessStore.setFilerInfo(name, value);
  }
  handleIssuerInputChange = (e, { name, value }) => {
    this.props.businessStore.setIssuerInfo(name, value);
  }
  handleOfferingInputChange = (e, { name, value }) => {
    this.props.businessStore.setOfferingInfo(name, value);
  }
  handleReportInputChange = (e, { name, value }) => {
    this.props.businessStore.setAnnualReportInfo(name, value);
  }
  handleSignatureInputChange = (e, { name, value }) => {
    this.props.businessStore.setSignatureInfo(name, value);
  }
  handleSelectChange = (e, { value }) => {
    this.props.businessStore.setCountry(value);
  }

  render() {
    console.log(this.props.businessStore.annualReportDisclosureRequirements);
    return (
      <div className="content-spacer">
        <Grid stackable className="edgar-form">
          <Form size="large">
            <FilerInformation
              handleInputChange={this.handleFilerInputChange}
            />
            <IssuerInformation
              handleInputChange={this.handleIssuerInputChange}
            />
            <OfferingInformation
              handleInputChange={this.handleOfferingInputChange}
            />
            <AnnualReportDisclosureRequirements
              handleInputChange={this.handleReportInputChange}
              handleSelectChange={this.handleSelectChange}
              annualReportDisclosureRequirements={
                this.props.businessStore.annualReportDisclosureRequirements}
            />
            <Signature
              handleInputChange={this.handleSignatureInputChange}
              signature={this.props.businessStore.signature}
            />
          </Form>
        </Grid>
      </div>
    );
  }
}
