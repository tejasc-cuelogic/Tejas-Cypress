import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import BusinessApplicationMapping from './applicationMapping/businessApplicationMapping';
// import LegalDocumentUpload from './applicationMapping/legalDocumentUpload';
import { InlineLoader } from '../../../../../../../theme/shared';


@inject('businessAppReviewStore', 'businessAppStore', 'nsUiStore')
@withRouter
@observer
export default class Offerings extends Component {
  render() {
    const { loadingArray } = this.props.nsUiStore;
    const {
      businessApplicationDetailsAdmin,
    } = this.props.businessAppStore;
    return (
      (loadingArray.includes('getPluginList') || !businessApplicationDetailsAdmin)
        ? <InlineLoader />
        : (
          <>
            {/* <LegalDocumentUpload /> */}
            <BusinessApplicationMapping {...this.props} />
          </>
        )
    );
  }
}
