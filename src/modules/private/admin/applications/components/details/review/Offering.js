import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import BusinessApplicationMapping from './applicationMapping/businessApplicationMapping';
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
    const businessAppReadOnly = !!get(businessApplicationDetailsAdmin, 'offeringId');
    return (
      (loadingArray.includes('getPluginList') || !businessApplicationDetailsAdmin)
        ? <InlineLoader />
        : (
          <>
            <DataRoom referenceFrom="BUSINESS_APPLICATION" documentUpload="AGREEMENTS" isReadOnlyFlag={businessAppReadOnly} />
            <BusinessApplicationMapping {...this.props} isReadOnlyFlag={businessAppReadOnly} />
          </>
        )
    );
  }
}
