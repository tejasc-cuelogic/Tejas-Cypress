import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import CollectionHeader from '../components/CollectionHeader';

@inject('collectionStore')
@withRouter
@observer
class CollectionDetails extends Component {
  componentDidMount() {
    const slug = 'dell-collection';
    // const { slug } = this.props.match.params;
    this.props.collectionStore.getCollection(slug);
  }

  render() {
    const { collectionStore } = this.props;
    const { collectionDetails } = collectionStore;
    console.log(collectionDetails);
    return (
      <>
        <CollectionHeader />
      </>
    );
  }
}

export default CollectionDetails;
