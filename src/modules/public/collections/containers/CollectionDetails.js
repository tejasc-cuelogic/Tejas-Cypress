import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { find, get, filter } from 'lodash';
import { withRouter } from 'react-router-dom';
import CollectionHeader from '../components/CollectionHeader';
import CustomContent from '../../offering/components/campaignDetails/CustomContent';

@inject('collectionStore', 'uiStore')
@withRouter
@observer
class CollectionDetails extends Component {
  componentDidMount() {
    // const slug = 'dell-collection';
    const { slug } = this.props.match.params;
    this.props.collectionStore.getCollection(slug);
  }

  render() {
    const { collectionStore, uiStore } = this.props;
    const { collectionDetails } = collectionStore;
    const { responsiveVars } = uiStore;
    const { isTablet } = responsiveVars;
    const collectionHeader = find((get(collectionDetails, 'marketing.content') || []), c => c.contentType === 'HEADER');
    const customContent = filter((get(collectionDetails, 'marketing.content') || []), c => c.contentType === 'CUSTOM');
    return (
      <>
        <CollectionHeader data={collectionHeader} />
        <div className="ui container">
          {customContent.map(c => <CustomContent title={c.title} content={c.customValue} isTablet={isTablet} />)}
        </div>
      </>
    );
  }
}

export default CollectionDetails;
