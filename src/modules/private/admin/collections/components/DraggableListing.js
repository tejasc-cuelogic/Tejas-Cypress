

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Confirm } from 'semantic-ui-react';
import { SortableContainer, arrayMove } from 'react-sortable-hoc';
import { InlineLoader } from '../../../../../theme/shared';

const SortableList = SortableContainer(({
  allRecords, handleAction, stage, listIndex, sortableItem, smartElement,
}) => {
  const SortableItem = sortableItem;
  return (
    <div className="tbody">
      {allRecords.map((record, index) => (
        <SortableItem
          // eslint-disable-next-line react/no-array-index-key
          key={`item-${index}`}
          docIndx={index}
          record={record}
          handleAction={handleAction}
          index={index}
          stage={stage}
          smartElement={smartElement}
          listIndex={listIndex}
        />
      ))}
    </div>
);
});
@inject('uiStore', 'offeringsStore', 'collectionStore')
@withRouter
@observer
export default class DraggableListing extends Component {
  state = { isPublic: false, loading: false };

  onSortEnd = async ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      this.setState({ loading: true });
      await this.props.collectionStore.setOrderForCollectionsMapping(arrayMove(this.props.insightsList, oldIndex, newIndex));
      this.setState({ loading: false });
      this.props.collectionStore.setFieldValue('collectionIndex', null);
      this.props.history.push(`${this.props.match.url}`);
    }
  }

  handleAction = (action, offering, isPublished = false) => {
    if (action === 'Delete') {
      this.props.uiStore.setConfirmBox(action, offering.id);
    } else if (action === 'Publish') {
      this.setState({ isPublic: isPublished });
      this.props.uiStore.setConfirmBox(action, offering.id, isPublished);
    }
  }

  handleDeleteCancel = () => {
    this.props.uiStore.setConfirmBox('');
  }

  handlePublishOffering = async () => {
    const { collectionStore, uiStore } = this.props;
    const params = {
      type: 'INSIGHT',
      collectionId: collectionStore.collectionId,
      referenceId: uiStore.confirmBox.refId,
      scope: this.state.isPublic ? 'PUBLIC' : 'HIDDEN',
    };
    await collectionStore.collectionMappingMutation('adminCollectionMappingUpsert', params);
    collectionStore.setFieldValue('collectionIndex', null);
    this.props.history.push(`${this.props.match.url}`);
    this.props.uiStore.setConfirmBox('');
  }

  handleDeleteCollection = async () => {
    const { collectionStore, uiStore } = this.props;
    const params = {
      type: 'INSIGHT',
      collectionId: collectionStore.collectionId,
      referenceId: uiStore.confirmBox.refId,
    };
    await collectionStore.collectionMappingMutation('adminDeleteCollectionMapping', params);
    collectionStore.setFieldValue('collectionIndex', null);
    this.props.history.push(`${this.props.match.url}`);
    this.props.uiStore.setConfirmBox('');
  }

  render() {
    const {
      uiStore, stage, records, isLoading, sortableItem, smartElement,
    } = this.props;

    const { confirmBox } = uiStore;
    if (isLoading || this.state.loading) {
      return <InlineLoader />;
    }
    return (
      <>
        <SortableList
          allRecords={records}
          pressDelay={100}
          handleAction={this.handleAction}
          onSortEnd={e => this.onSortEnd(e)}
          stage={stage}
          lockAxis="y"
          useDragHandle
          smartElement={smartElement}
          sortableItem={sortableItem}
        />
        <Confirm
          header="Confirm"
          content={confirmBox.entity === 'Publish' ? `Are you sure you want to make this offering ${this.state.isPublic ? 'Public' : 'Non-Public'}?` : 'Are you sure you want to delete this offering?'}
          open={confirmBox.entity === 'Delete' || confirmBox.entity === 'Publish'}
          onCancel={this.handleDeleteCancel}
          onConfirm={confirmBox.entity === 'Publish' ? this.handlePublishOffering : this.handleDeleteCollection}
          size="mini"
          className="deletion"
        />
      </>
    );
  }
}
