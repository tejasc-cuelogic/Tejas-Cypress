import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import CollectionsHeader from '../components/CollectionsHeader';
import CollectionsList from '../components/CollectionsList';
import CollectionsFooter from '../components/CollectionsFooter';


@inject('campaignStore', 'uiStore', 'userStore')
@observer
class Collections extends Component {
  constructor(props) {
    super(props);
    props.campaignStore.initRequest('LIVE');
  }

  handleExploreBtn = () => {
    this.props.history.push('/offerings');
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <>
        <CollectionsHeader />
        <CollectionsList />
        <CollectionsFooter />
      </>
    );
  }
}

export default Collections;
