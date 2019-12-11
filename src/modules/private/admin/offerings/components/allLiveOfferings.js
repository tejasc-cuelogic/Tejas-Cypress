/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Accordion, Icon, Confirm } from 'semantic-ui-react';
import { InlineLoader } from '../../../../../theme/shared';
import Listing from './Listing';
import DraggableListing from './DraggableListing';

@inject('uiStore', 'offeringsStore', 'offeringCreationStore')
@withRouter
@observer
export default class AllLiveOfferings extends Component {
  state = { activeIndex: 0, isPublic: false }

  toggleAccordianContent = (categoryIndex = null) => {
    const index = categoryIndex;
    if (categoryIndex === null) {
      this.state.activeIndex = index === 0 ? -1 : this.state.activeIndex;
    }
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  }

  render() {
    const { activeIndex } = this.state;
    const {
      uiStore, offeringsStore, stage,
    } = this.props;
    const { orderedActiveLiveList, loading } = offeringsStore;
    const { confirmBox, inProgress } = uiStore;
    if (loading || inProgress) {
      return <InlineLoader />;
    }
    if (orderedActiveLiveList.length === 0) {
      return <InlineLoader text="No data found." />;
    }
    return (
      <>
        {orderedActiveLiveList && orderedActiveLiveList.length && orderedActiveLiveList.map((offering, index) => (
          <Accordion fluid styled className="card-style">
            <Accordion.Title onClick={() => this.toggleAccordianContent(index)} className="text-capitalize">
              <Icon className={activeIndex === index ? 'ns-chevron-up' : 'ns-chevron-down'} />
              {offering.title} <small>{offering.offerings.length} elements</small>
            </Accordion.Title>
            <Accordion.Content active={activeIndex === index} className="categories-acc">
              {['other'].includes(offering.category)
                ? <DraggableListing stage={stage} allLiveOfferingsList={offering.offerings} />
                : <Listing stage={stage} noPagination allLiveOfferingsList={offering.offerings} />
              }
            </Accordion.Content>
          </Accordion>
        ))}
        <Confirm
          header="Confirm"
          content={confirmBox.entity === 'Publish' ? `Are you sure you want to make this offering ${this.state.isPublic ? 'Public' : 'Non-Public'}?` : 'Are you sure you want to delete this offering?'}
          open={confirmBox.entity === 'Delete' || confirmBox.entity === 'Publish'}
          onCancel={this.handleDeleteCancel}
          onConfirm={confirmBox.entity === 'Publish' ? this.handlePublishOffering : this.handleDeleteOffering}
          size="mini"
          className="deletion"
        />
      </>
    );
  }
}
