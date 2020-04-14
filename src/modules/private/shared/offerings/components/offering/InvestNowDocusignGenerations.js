import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Card } from 'semantic-ui-react';
// import { get } from 'lodash';
import GenerateDocuments from './investNowDocusign/generateDocuments';
import { InlineLoader } from '../../../../../../theme/shared';
import DataRoom from '../legal/DataRoom';


@inject('businessAppReviewStore', 'businessAppStore', 'nsUiStore', 'offeringCreationStore', 'factoryStore')
@withRouter
@observer
class InvestNowDocusignGenerations extends Component {
  constructor(props) {
    super(props);
    this.props.factoryStore.fetchPluginsForFileFactory();
  }

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
            <GenerateDocuments />
            <Card fluid className="elastic-search">
              <Card.Content header="Upload Documents" />
              <Card.Content>
                <Card.Description>
                  <DataRoom
                    header="Documents"
                    isHeaderVisible={false}
                    referenceFrom="BUSINESS_APPLICATION"
                    documentUpload="AGREEMENTS"
                    isReadOnlyFlag={businessAppReadOnly}
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
