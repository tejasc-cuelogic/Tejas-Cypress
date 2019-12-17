/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Accordion, Icon } from 'semantic-ui-react';
import { InlineLoader } from '../../../../../theme/shared';
import Listing from './Listing';
import DraggableListing from './DraggableListing';

@inject('uiStore', 'offeringsStore', 'offeringCreationStore')
@withRouter
@observer
export default class AllLiveOfferings extends Component {
  state = { activeIndex: [] }

  toggleAccordianContent = (categoryIndex = null) => {
    const index = categoryIndex;
    const { activeIndex } = this.state;
    const newIndex = activeIndex;

    const currentIndexPosition = activeIndex.indexOf(index);
    if (currentIndexPosition > -1) {
      newIndex.splice(currentIndexPosition, 1);
    } else {
      newIndex.push(index);
    }

    this.setState({ activeIndex: newIndex });
  };

  render() {
    const { activeIndex } = this.state;
    const {
      uiStore, offeringsStore, stage,
    } = this.props;
    const { orderedActiveLiveList, loading } = offeringsStore;
    const { inProgress } = uiStore;
    if (loading || inProgress) {
      return <InlineLoader />;
    }
    if (orderedActiveLiveList.length === 0) {
      return <InlineLoader text="No data found." />;
    }
    return (
      <>
        {orderedActiveLiveList && orderedActiveLiveList.length && orderedActiveLiveList.map((offering, index) => (
          <Accordion exclusive={false} fluid styled className={`card-style ${index === 0 ? 'mt-20' : ''}`}>
            <Accordion.Title onClick={() => this.toggleAccordianContent(index)}>
              <Icon className={activeIndex.includes(index) ? 'ns-chevron-up' : 'ns-chevron-down'} />
              {offering.title} <small>{offering.offerings.length} {offering.offerings.length <= 1 ? 'Offering' : 'Offerings'}</small>
            </Accordion.Title>
            <Accordion.Content active={activeIndex.includes(index)} className="categories-acc">
              {['other'].includes(offering.category)
                ? <DraggableListing stage={stage} allLiveOfferingsList={offering.offerings} offeringListIndex={index} />
                : <Listing stage={stage} noPagination allLiveOfferingsList={offering.offerings} offeringListIndex={index} />
              }
            </Accordion.Content>
          </Accordion>
        ))}
      </>
    );
  }
}
