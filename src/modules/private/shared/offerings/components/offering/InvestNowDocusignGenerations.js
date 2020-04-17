import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Card } from 'semantic-ui-react';
import { get } from 'lodash';
import GenerateDocuments from './investNowDocusign/generateDocuments';
import DocumentUpload from './investNowDocusign/documentUpload';
import { InlineLoader } from '../../../../../../theme/shared';

const metaInfo = {
  store: 'offeringCreationStore',
  form: 'DATA_ROOM_FRM',
};

@inject('businessAppReviewStore', 'businessAppStore', 'nsUiStore', 'offeringCreationStore', 'factoryStore', 'offeringsStore')
@withRouter
@observer
class InvestNowDocusignGenerations extends Component {
  constructor(props) {
    super(props);
    const { offer } = this.props.offeringsStore;
    this.props.offeringsStore.setFieldValue('offeringStorageDetails', null);
    this.props.factoryStore.fetchPluginsForFileFactory('InvestNow');
    this.props.offeringsStore.getofferingStorageDetailBySlug(offer.offeringSlug);
  }

  render() {
    const { loadingArray } = this.props.nsUiStore;
    const { setFormDataForBusinessUploadDocuments } = this.props.offeringCreationStore;
    setFormDataForBusinessUploadDocuments('DATA_ROOM_FRM', '');
    const isReadOnlyFlag = false;
    const { offer, offerDataLoading } = this.props.offeringsStore;
    const regulation = get(offer, 'regulation');
    const securities = get(offer, 'keyTerms.securities');
    const showWarningMsg = (!regulation || !securities);
    return (
      (loadingArray.includes('adminListFilePlugins') || offerDataLoading)
        ? <InlineLoader />
        : showWarningMsg
          ? (
            <div className="inner-content-spacer">
              <span className="negative-text mt-10 ml-10">Please select and verify the offering Regulation and Security (and equity class for Equity).</span>
            </div>
          )
          : (
            <>
              <GenerateDocuments />
              <Card fluid className="elastic-search">
                <Card.Content header="Upload Documents" />
                <Card.Content>
                  <Card.Description>
                    <DocumentUpload
                      referenceFrom="BUSINESS_APPLICATION"
                      metaInfo={metaInfo}
                      uploadFormKey="documents"
                      uploadEnum="DOCUMENTS_INVEST_NOW"
                      isReadOnlyFlag={isReadOnlyFlag}
                      isSaveOnly
                    />
                  </Card.Description>
                </Card.Content>
              </Card>
            </>
          )
    );
  }
}

export default InvestNowDocusignGenerations;
