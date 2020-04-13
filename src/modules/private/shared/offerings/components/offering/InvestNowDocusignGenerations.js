import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
// import { get } from 'lodash';
// import BusinessApplicationMapping from './applicationMapping/businessApplicationMapping';
import { InlineLoader } from '../../../../../../theme/shared';
import DataRoom from '../legal/DataRoom';


@inject('businessAppReviewStore', 'businessAppStore', 'nsUiStore', 'offeringCreationStore')
@withRouter
@observer
class InvestNowDocusignGenerations extends Component {
  render() {
    const { loadingArray } = this.props.nsUiStore;
    const { setFormDataForBusinessUploadDocuments } = this.props.offeringCreationStore;
    setFormDataForBusinessUploadDocuments('DATA_ROOM_FRM', '');
    const businessAppReadOnly = false;
    return (
      (loadingArray.includes('getPluginList'))
        ? <InlineLoader />
        : (
          <>
            <DataRoom
              header="Documents"
              referenceFrom="BUSINESS_APPLICATION"
              documentUpload="AGREEMENTS"
              isReadOnlyFlag={businessAppReadOnly}
            />
          </>
        )
    );
  }
}

export default InvestNowDocusignGenerations;
