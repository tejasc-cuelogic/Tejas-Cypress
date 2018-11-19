import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { isEmpty } from 'lodash';
import { Form, Header, Button, Divider } from 'semantic-ui-react';
import EdgarFilingList from './EdgarFilingList';
import { DropZoneConfirm as DropZone } from '../../../../../../theme/form';

@inject('offeringCreationStore', 'uiStore', 'userStore')
@observer
export default class GenerateDocs extends Component {
  componentWillMount() {
    const {
      currentOfferingId,
      getOfferingFilingList,
      setFormData,
    } = this.props.offeringCreationStore;
    getOfferingFilingList(currentOfferingId);
    setFormData('GENERAL_FRM', 'legal.general');
    setFormData('RISK_FACTORS_FRM', 'legal.riskFactors');
    setFormData('DOCUMENTATION_FRM', 'legal.documentation.issuer');
    setFormData('ADMIN_DOCUMENTATION_FRM', 'legal.documentation.admin');
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
    const { offeringFilingList, ADMIN_DOCUMENTATION_FRM } = this.props.offeringCreationStore;
    const { isIssuer } = this.props.userStore;
    const { match } = this.props;
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
          <EdgarFilingList offeringFilings={offeringFilingList} />
          {!isEmpty(offeringFilingList) &&
            <Aux>
              <Header as="h4">Upload Final Signed Docs</Header>
              {['escrow', 'resolutionOfBorrowing', 'formC', 'npa', 'promissoryNote', 'securityAgreement', 'disclosure', 'personalGuarantee'].map(field => (
                <DropZone
                  size="small"
                  name="term"
                  fielddata={ADMIN_DOCUMENTATION_FRM.fields[field]}
                  ondrop={files =>
                    this.onFileDrop(files, field, ADMIN_DOCUMENTATION_FRM.fields[field].stepName)}
                  onremove={() =>
                    this.handleDelDoc(field, ADMIN_DOCUMENTATION_FRM.fields[field].stepName)}
                  uploadtitle="Upload"
                />
                // <div className="field-wrap">
                // </div>
              ))
              }
            </Aux>
          }
        </Form>
      </div>
    );
  }
}
