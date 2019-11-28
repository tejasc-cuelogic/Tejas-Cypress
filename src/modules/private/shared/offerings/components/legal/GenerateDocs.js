import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { isEmpty, get } from 'lodash';
import { Form, Header, Button, Divider } from 'semantic-ui-react';
import EdgarFilingList from './EdgarFilingList';
import { DropZoneConfirm as DropZone } from '../../../../../../theme/form';
import { CAMPAIGN_KEYTERMS_SECURITIES_ENUM } from '../../../../../../constants/offering';

@inject('offeringCreationStore', 'uiStore', 'userStore', 'offeringsStore')
@observer
export default class GenerateDocs extends Component {
  constructor(props) {
    super(props);
    const {
      currentOfferingId,
      getOfferingFilingList,
      // setFormData,
    } = this.props.offeringCreationStore;
    getOfferingFilingList(currentOfferingId);
    // setFormData('GENERAL_FRM', 'legal.general');
    // setFormData('RISK_FACTORS_FRM', 'legal.riskFactors');
    // setFormData('DOCUMENTATION_FRM', 'legal.documentation.issuer');
    // setFormData('ADMIN_DOCUMENTATION_FRM', 'legal.documentation.admin');
  }

  onFileDrop = (files, field, stepName) => {
    this.props.offeringCreationStore.setFileUploadData('ADMIN_DOCUMENTATION_FRM', field, files, '', null, stepName, true);
  }

  handleDelDoc = (field, stepName) => {
    this.props.offeringCreationStore.removeUploadedData('ADMIN_DOCUMENTATION_FRM', '', field, null, stepName, true);
  }

  createBusinessFiling = (e) => {
    e.stopPropagation();
    this.props.offeringCreationStore.generateBusinessFiling();
  }

  render() {
    const { inProgress } = this.props.uiStore;
    const {
      offeringFilingList, ADMIN_DOCUMENTATION_FRM, filingListApiRes,
    } = this.props.offeringCreationStore;
    const { isIssuer } = this.props.userStore;
    const { offer } = this.props.offeringsStore;
    const { match } = this.props;
    const securities = get(offer, 'keyTerms.securities');
    let documentLists = ['escrow', 'resolutionOfBorrowing', 'formC', 'promissoryNote', 'securityAgreement', 'disclosure', 'personalGuarantee'];
    documentLists = [CAMPAIGN_KEYTERMS_SECURITIES_ENUM.TERM_NOTE, CAMPAIGN_KEYTERMS_SECURITIES_ENUM.REVENUE_SHARING_NOTE].includes(securities) ? [...documentLists, 'npa'] : [...documentLists];
    documentLists = securities === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.PREFERRED_EQUITY_506C ? [...documentLists, 'purchaseAgreement', 'proxyAgreement'] : [...documentLists];
    documentLists = securities === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.REAL_ESTATE ? [...documentLists, 'llcAgreement', 'subscriptionAgreement'] : [...documentLists];
    return (
      <div className={!isIssuer || (isIssuer && match.url.includes('offering-creation')) ? '' : 'ui card fluid form-card'}>
        <Form>
          <Header as="h4">Generate Docs from Templates</Header>
          <Button
            primary
            className="relaxed"
            content="Generate Docs"
            onClick={this.createBusinessFiling}
            loading={inProgress}
          />
          <Divider section />
          <EdgarFilingList
            offeringFilings={offeringFilingList}
            loading={filingListApiRes.loading}
            offeringDetails={offer}
          />
          {!isEmpty(offeringFilingList)
            && (
            <>
              <Header as="h4">Upload Final Signed Docs</Header>
              <Form.Group widths={2}>
              {documentLists.map(field => (
                <DropZone
                  size="small"
                  name="term"
                  fielddata={ADMIN_DOCUMENTATION_FRM.fields[field]}
                  ondrop={files => this.onFileDrop(files, field, ADMIN_DOCUMENTATION_FRM.fields[field].stepName)}
                  onremove={() => this.handleDelDoc(field, ADMIN_DOCUMENTATION_FRM.fields[field].stepName)}
                  uploadtitle="Upload"
                  containerclassname="field"
                />
              ))
              }
              </Form.Group>
            </>
            )
          }
        </Form>
      </div>
    );
  }
}
