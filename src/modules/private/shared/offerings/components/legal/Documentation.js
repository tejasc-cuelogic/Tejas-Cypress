import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { DropZoneConfirm as DropZone } from '../../../../../../theme/form';

@inject('offeringCreationStore', 'userStore')
@observer
export default class Documentation extends Component {
  onCorporateFormationDocDrop = (files) => {
    this.props.offeringCreationStore.setFileUploadDataMulitple('DOCUMENTATION_FRM', '', 'corporateFormationDocs', files, 'DOCUMENTS_LEGAL_CORPORATE_FORMATION_DOCS');
  }
  onFormIdDrop = (files) => {
    this.props.offeringCreationStore.setFileUploadData('DOCUMENTATION_FRM', '', 'formId', files, '');
  }
  onIssuerFinancialsDrop = (files) => {
    this.props.offeringCreationStore.setFileUploadDataMulitple('DOCUMENTATION_FRM', '', 'issuerFinancials', files, 'DOCUMENTS_LEGAL_ISSUER_FINANCIALS');
  }
  onLeaseAgreementOrLetterOfIntentDrop = (files) => {
    this.props.offeringCreationStore.setFileUploadDataMulitple('DOCUMENTATION_FRM', '', 'leaseAgreementOrLetterOfIntent', files, 'DOCUMENTS_LA_LOI');
  }
  render() {
    const { isIssuer } = this.props.userStore;
    const { match } = this.props;
    const { DOCUMENTATION_FRM } = this.props.offeringCreationStore;
    return (
      <div className={!isIssuer || (isIssuer && match.url.includes('offering-creation')) ? '' : 'ui card fluid form-card'}>
        <Header as="h4" textAlign="center">In Documentation page!</Header>
        <Header as="h3">Form ID</Header>
        <DropZone
          containerclassname="fluid"
          name="formId"
          fielddata={DOCUMENTATION_FRM.fields.formId}
          ondrop={this.onFormIdDrop}
          onremove={this.handleDelDoc}
          uploadtitle="Upload"
        />
        <Header as="h3">Corporate Formation Documents</Header>
        <DropZone
          multiple
          containerclassname="fluid"
          name="corporateFormationDocs"
          fielddata={DOCUMENTATION_FRM.fields.corporateFormationDocs}
          ondrop={this.onCorporateFormationDocDrop}
          onremove={this.handleDelDoc}
          uploadtitle="Upload"
        />
        <Header as="h3">Issuer Financials</Header>
        <DropZone
          multiple
          containerclassname="fluid"
          name="issuerFinancials"
          fielddata={DOCUMENTATION_FRM.fields.issuerFinancials}
          ondrop={this.onIssuerFinancialsDrop}
          onremove={this.handleDelDoc}
          uploadtitle="Upload"
        />
        <Header as="h3">Lease Agreement or Letter of Intent(LOI)</Header>
        <DropZone
          multiple
          containerclassname="fluid"
          name="leaseAgreementOrLetterOfIntent"
          fielddata={DOCUMENTATION_FRM.fields.leaseAgreementOrLetterOfIntent}
          ondrop={this.onLeaseAgreementOrLetterOfIntentDrop}
          onremove={this.handleDelDoc}
          uploadtitle="Upload"
        />
      </div>
    );
  }
}
