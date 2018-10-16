import React, { Component } from 'react';
import { Header, Divider, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { DropZoneConfirm as DropZone } from '../../../../../../theme/form';
import ButtonGroup from '../ButtonGroup';

@inject('offeringCreationStore', 'userStore')
@observer
export default class Documentation extends Component {
  onCorporateFormationDocDrop = (files) => {
    this.props.offeringCreationStore.setFileUploadDataMulitple('DOCUMENTATION_FRM', '', 'corporateFormationDocs', files, 'DOCUMENTS_LEGAL_CORPORATE_FORMATION_DOCS');
  }
  onFormIdDrop = (files) => {
    this.props.offeringCreationStore.setFileUploadDataMulitple('DOCUMENTATION_FRM', '', 'formId', files, 'DOCUMENTS_LEGAL_FORM_ID');
  }
  onIssuerFinancialsDrop = (files) => {
    this.props.offeringCreationStore.setFileUploadDataMulitple('DOCUMENTATION_FRM', '', 'issuerFinancials', files, 'DOCUMENTS_LEGAL_ISSUER_FINANCIALS');
  }
  onLeaseAgreementOrLetterOfIntentDrop = (files) => {
    this.props.offeringCreationStore.setFileUploadDataMulitple('DOCUMENTATION_FRM', '', 'leaseAgreementOrLetterOfIntent', files, 'DOCUMENTS_LA_LOI');
  }
  handleDelDoc = (field, index = undefined) => {
    this.props.offeringCreationStore.removeUploadedDataMultiple('DOCUMENTATION_FRM', field, index, '');
  }
  handleFormSubmit = (isApproved = null) => {
    const {
      DOCUMENTATION_FRM,
      updateOffering,
      currentOfferingId,
    } = this.props.offeringCreationStore;
    updateOffering(currentOfferingId, DOCUMENTATION_FRM.fields, 'legal', 'issuer', true, undefined, isApproved);
  }
  render() {
    const { isIssuer } = this.props.userStore;
    const { match } = this.props;
    const { DOCUMENTATION_FRM } = this.props.offeringCreationStore;
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    const isApproved = false;
    return (
      <div className={!isIssuer || (isIssuer && match.url.includes('offering-creation')) ? '' : 'ui card fluid form-card'}>
        <Header as="h3">Form ID</Header>
        <Form onSubmit={this.handleFormSubmit}>
          <DropZone
            containerclassname="fluid"
            name="formId"
            fielddata={DOCUMENTATION_FRM.fields.formId}
            ondrop={this.onFormIdDrop}
            onremove={field => this.handleDelDoc(field)}
            uploadtitle="Upload"
          />
          <Header as="h3">Corporate Formation Documents</Header>
          <DropZone
            multiple
            containerclassname="fluid"
            name="corporateFormationDocs"
            fielddata={DOCUMENTATION_FRM.fields.corporateFormationDocs}
            ondrop={this.onCorporateFormationDocDrop}
            onremove={(field, index) => this.handleDelDoc(field, index)}
            uploadtitle="Upload"
          />
          <Header as="h3">Issuer Financials</Header>
          <DropZone
            multiple
            containerclassname="fluid"
            name="issuerFinancials"
            fielddata={DOCUMENTATION_FRM.fields.issuerFinancials}
            ondrop={this.onIssuerFinancialsDrop}
            onremove={(field, index) => this.handleDelDoc(field, index)}
            uploadtitle="Upload"
          />
          <Header as="h3">Lease Agreement or Letter of Intent(LOI)</Header>
          <DropZone
            multiple
            containerclassname="fluid"
            name="leaseAgreementOrLetterOfIntent"
            fielddata={DOCUMENTATION_FRM.fields.leaseAgreementOrLetterOfIntent}
            ondrop={this.onLeaseAgreementOrLetterOfIntentDrop}
            onremove={(field, index) => this.handleDelDoc(field, index)}
            uploadtitle="Upload"
          />
          <Divider hidden />
          <ButtonGroup
            isManager={access.asManager}
            formValid={DOCUMENTATION_FRM.meta.isValid}
            isApproved={isApproved}
            updateOffer={this.handleFormSubmit}
          />
        </Form>
      </div>
    );
  }
}
