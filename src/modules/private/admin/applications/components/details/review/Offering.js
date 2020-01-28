import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import BusinessApplicationMapping from './applicationMapping/businessApplicationMapping';
// import LegalDocumentUpload from './applicationMapping/legalDocumentUpload';
import { InlineLoader } from '../../../../../../../theme/shared';
import DataRoom from '../../../../../shared/offerings/components/legal/DataRoom';


@inject('businessAppReviewStore', 'businessAppStore', 'nsUiStore', 'offeringCreationStore')
@withRouter
@observer
export default class Offerings extends Component {
  render() {
    const { loadingArray } = this.props.nsUiStore;
    const {
      businessApplicationDetailsAdmin,
    } = this.props.businessAppStore;
    const { setFormDataForBusinessUploadDocuments } = this.props.offeringCreationStore;
    setFormDataForBusinessUploadDocuments('DATA_ROOM_FRM', '');
    return (
      (loadingArray.includes('getPluginList') || !businessApplicationDetailsAdmin)
        ? <InlineLoader />
        : (
          <>
            <DataRoom referenceFrom="BUSINESS_APPLICATION" documentUpload="AGREEMENTS" />
            <BusinessApplicationMapping {...this.props} />
          </>
        )
    );
  }
}
