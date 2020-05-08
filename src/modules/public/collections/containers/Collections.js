import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import CollectionsHeader from '../components/CollectionsHeader';
import CollectionsList from '../components/CollectionsList';
import CollectionsFooter from '../components/CollectionsFooter';


@inject('collectionStore')
@observer
@withRouter
class Collections extends Component {
  // constructor(props) {
  //   super(props);
  //   props.collectionStore.getCollections();
  // }

  handleExploreBtn = () => {
    this.props.history.push('/offerings');
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <>
        <CollectionsHeader />
        <CollectionsList collectionLength={7} />
        <CollectionsFooter />
      </>
    );
  }
}

export default Collections;
