/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import ContentHOC from '../../../shared/marketing/Content';
// import NewContentModal from './NewContentModal';
// import CollectionContent from './CollectionContent';
// import { InlineLoader } from '../../../../../theme/shared';


const metaInfo = {
  store: 'collectionStore',
  form: 'COLLECTION_FRM',
};

@withRouter
@observer
class ContentNew extends React.Component {
  render() {
  return <>{this.props.children}</>;
  }
}

export default ContentHOC(ContentNew, metaInfo);
