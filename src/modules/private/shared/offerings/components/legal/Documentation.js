import React, { Component } from 'react';
import { Header, Divider, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { DropZoneConfirm as DropZone } from '../../../../../../theme/form';
import ButtonGroup from '../ButtonGroup';

@inject('offeringCreationStore', 'userStore', 'offeringsStore')
@observer
export default class Documentation extends Component {
  componentWillMount() {
    const { setFormData } = this.props.offeringCreationStore;
    // setFormData('GENERAL_FRM', 'legal.general');
    // setFormData('RISK_FACTORS_FRM', 'legal.riskFactors');
    setFormData('DOCUMENTATION_FRM', 'legal.documentation.issuer');
    setFormData('ADMIN_DOCUMENTATION_FRM', 'legal.documentation.admin');
  }
  onCorporateFormationDocDrop = (files) => {
    this.props.offeringCreationStore.setFileUploadDataMulitple('DOCUMENTATION_FRM', '', 'corpFormation', files, 'DOCUMENTS_LEGAL_CORPORATE_FORMATION_DOCS');
  }
  onFormIdDrop = (files) => {
    this.props.offeringCreationStore.setFileUploadDataMulitple('DOCUMENTATION_FRM', '', 'formID', files, 'DOCUMENTS_LEGAL_FORM_ID');
  }
  onIssuerFinancialsDrop = (files) => {
    this.props.offeringCreationStore.setFileUploadDataMulitple('DOCUMENTATION_FRM', '', 'issuerFinancials', files, 'DOCUMENTS_LEGAL_ISSUER_FINANCIALS');
  }
  onLeaseAgreementOrLetterOfIntentDrop = (files) => {
    this.props.offeringCreationStore.setFileUploadDataMulitple('DOCUMENTATION_FRM', '', 'leaseAgreement', files, 'DOCUMENTS_LA_LOI');
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
    const { offer } = this.props.offeringsStore;
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    const isManager = access.asManager;
    const submitted = (offer && offer.legal && offer.legal.documentation &&
      offer.legal.documentation.issuer && offer.legal.documentation.issuer.submitted)
      ? offer.legal.documentation.issuer.submitted : null;
    const approved = (offer && offer.legal && offer.legal.documentation &&
      offer.legal.documentation.issuer &&
      offer.legal.documentation.issuer.approved) ? offer.legal.documentation.issuer.approved : null;
    const issuerSubmitted = (offer && offer.legal && offer.legal.documentation &&
      offer.legal.documentation.issuer && offer.legal.documentation.issuer.issuerSubmitted)
      ? offer.legal.documentation.issuer.issuerSubmitted : null;
    const isReadonly = ((isIssuer && issuerSubmitted) || (submitted && !isManager && !isIssuer) ||
      (isManager && approved && approved.status));
    return (
      <div className={!isIssuer || (isIssuer && match.url.includes('offering-creation')) ? '' : 'ui card fluid form-card'}>
        <Header as="h4">Form ID</Header>
        <Form>
          <DropZone
            disabled={isReadonly}
            containerclassname="fluid"
            name="formID"
            fielddata={DOCUMENTATION_FRM.fields.formID}
            ondrop={this.onFormIdDrop}
            onremove={field => this.handleDelDoc(field)}
            uploadtitle="Upload"
          />
          <Header as="h4">Corporate Formation Documents</Header>
          <DropZone
            disabled={isReadonly}
            multiple
            containerclassname="fluid"
            name="corpFormation"
            fielddata={DOCUMENTATION_FRM.fields.corpFormation}
            ondrop={this.onCorporateFormationDocDrop}
            onremove={(field, index) => this.handleDelDoc(field, index)}
            uploadtitle="Upload"
          />
          <Header as="h4">Issuer Financials</Header>
          <DropZone
            disabled={isReadonly}
            multiple
            containerclassname="fluid"
            name="issuerFinancials"
            fielddata={DOCUMENTATION_FRM.fields.issuerFinancials}
            ondrop={this.onIssuerFinancialsDrop}
            onremove={(field, index) => this.handleDelDoc(field, index)}
            uploadtitle="Upload"
          />
          <Header as="h4">Lease Agreement or Letter of Intent(LOI)</Header>
          <DropZone
            disabled={isReadonly}
            multiple
            containerclassname="fluid"
            name="leaseAgreement"
            fielddata={DOCUMENTATION_FRM.fields.leaseAgreement}
            ondrop={this.onLeaseAgreementOrLetterOfIntentDrop}
            onremove={(field, index) => this.handleDelDoc(field, index)}
            uploadtitle="Upload"
          />
          <Divider hidden />
          <ButtonGroup
            isIssuer={isIssuer}
            submitted={submitted}
            isManager={isManager}
            formValid={DOCUMENTATION_FRM.meta.isValid}
            approved={approved}
            updateOffer={this.handleFormSubmit}
            issuerSubmitted={issuerSubmitted}
          />
        </Form>
      </div>
    );
  }
}
