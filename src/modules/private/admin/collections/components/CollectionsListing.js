import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Button, Icon, Confirm } from 'semantic-ui-react';
import { SortableContainer, SortableElement, arrayMove, sortableHandle } from 'react-sortable-hoc';
import { InlineLoader } from '../../../../../theme/shared';

const actions = {
  publish: { label: 'Publish', icon: 'view', icon1: 'no-view' },
};
const DragHandle = sortableHandle(() => <Icon className="ns-drag-holder-large mr-10" />);
const SortableItem = SortableElement(({
  item, handleAction,
}) => (
    <div className="row-wrap row-highlight striped-table">
      <div className="balance first-column">
        <DragHandle />
        {get(item, 'name') || 'N/A'}
      </div>
      <div className="balance width-250">
        {get(item, 'slug') || 'N/A'}
      </div>
      <div className="action right-align width-70">
        <Button.Group>
          {Object.keys(actions).map(action => (
            <Button icon className="link-button">
              <Icon className={`ns-${get(item, 'status') === 'ACTIVE' ? actions[action].icon : actions[action].icon1}`} onClick={() => handleAction(actions[action].label, item, get(item, 'status') !== 'ACTIVE')} />
            </Button>
          ))}

          <Button icon className="link-button">
            <Icon className="ns-trash" onClick={() => handleAction('Delete', item, !item.status)} />
          </Button>
        </Button.Group>
      </div>
    </div>
  ));
const SortableList = SortableContainer(({
  allCollectionList, handleAction, listIndex,
}) => (
    <div className="tbody">
      {allCollectionList.map((item, index) => (
        <SortableItem
          // eslint-disable-next-line react/no-array-index-key
          key={`item-${index}`}
          docIndx={index}
          item={item}
          handleAction={handleAction}
          index={index}
          listIndex={listIndex}
        />
      ))}
    </div>
  ));
@inject('uiStore', 'offeringsStore', 'collectionStore', 'nsUiStore')
@withRouter
@observer
export default class CollectionsListing extends Component {
  state = { isACTIVE: false };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { allOfferingsSorted, setOrderForOfferings } = this.props.offeringsStore;
    const { allLiveInsightsList, stage } = this.props;
    const offeringList = stage === 'live' && allLiveInsightsList ? allLiveInsightsList : allOfferingsSorted;
    const isArrayNeedToMerge = !!(stage === 'live' && allLiveInsightsList);
    if (oldIndex !== newIndex) {
      setOrderForOfferings(arrayMove(offeringList, oldIndex, newIndex), this.props.stage, isArrayNeedToMerge, this.props.offeringListIndex);
    }
  }

  handleAction = (action, offering, isPublished = false) => {
    if (action === 'Delete') {
      this.props.uiStore.setConfirmBox(action, offering.id);
    } else if (action === 'Publish') {
      this.setState({ isACTIVE: isPublished });
      this.props.uiStore.setConfirmBox(action, offering.id, isPublished);
    }
  }

  handleDeleteCancel = () => {
    this.props.uiStore.setConfirmBox('');
  }

  handlePublishCollection = async () => {
    const { collectionStore, uiStore } = this.props;
    const params = {
      id: uiStore.confirmBox.refId,
      collectionDetails: {
        status: this.state.isACTIVE ? 'ACTIVE' : 'HIDDEN',
      },
    };
    await collectionStore.adminPublishCollection(params);
    this.props.history.push(`${this.props.match.url}`);
    this.props.uiStore.setConfirmBox('');
  }

  handleDeleteCollection = async () => {
    const { collectionStore, uiStore } = this.props;
    const { refId } = uiStore.confirmBox;
    await collectionStore.adminDeleteCollection(refId);
    this.props.history.push(`${this.props.match.url}`);
    this.props.uiStore.setConfirmBox('');
  }

  render() {
    const { loadingArray } = this.props.nsUiStore;
    const { confirmBox } = this.props.uiStore;
    const { collections } = this.props.collectionStore;
    if (loadingArray.includes('getCollections')) {
      return <InlineLoader />;
    }
    return (
      <>
        <div className="ui card fluid">
          <div className="ui basic table">
            <div className="row-wrap striped-table thead">
              <div className="balance first-column">Name</div>
              <div className="balance width-250">Slug</div>
            </div>
            <div className="action right-align width-70" />
          </div>
          <SortableList
            allCollectionList={collections}
            pressDelay={100}
            handleAction={this.handleAction}
            onSortEnd={e => this.onSortEnd(e)}
            lockAxis="y"
            useDragHandle
          />
        </div>
      <Confirm
        header="Confirm"
        content={confirmBox.entity === 'Publish' ? `Are you sure you want to make this Collection ${this.state.isACTIVE ? 'ACTIVE' : 'Non-ACTIVE'}?` : 'Are you sure you want to delete this Collection?'}
        open={confirmBox.entity === 'Delete' || confirmBox.entity === 'Publish'}
        onCancel={this.handleDeleteCancel}
        onConfirm={confirmBox.entity === 'Publish' ? this.handlePublishCollection : this.handleDeleteCollection}
        size="mini"
        className="deletion"
      />
      </>
    );
  }
}
