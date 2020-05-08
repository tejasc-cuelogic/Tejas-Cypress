

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Button, Icon, Confirm } from 'semantic-ui-react';
import { SortableContainer, SortableElement, arrayMove, sortableHandle } from 'react-sortable-hoc';
import { InlineLoader } from '../../../../../theme/shared';

const actions = {
  publish: { label: 'Publish', icon: 'view', icon1: 'no-view' },
};
const DragHandle = sortableHandle(() => <Icon className="ns-drag-holder-large mr-10" />);
const SortableItem = SortableElement(({
  insight, handleAction,
}) => (
    <div className="row-wrap row-highlight striped-table">
      <div className="balance first-column">
        <DragHandle />
        {insight.title}
      </div>
      <div className="balance width-130">
        {insight.category}
      </div>
      <div className="balance width-130">
        {insight.tags ? insight.tags.join(', ') : '-'}
      </div>
      <div className="balance width-130">
        {insight.author}
      </div>
      <div className="balance width-130">
        {insight.author || 'N/A'}
      </div>
      <div className="action right-align width-70">
        <Button.Group>
          {Object.keys(actions).map(action => (
            <Button icon className="link-button">
              <Icon className={`ns-${insight.scope === 'PUBLIC' ? actions[action].icon : actions[action].icon1}`} onClick={() => handleAction(actions[action].label, insight, insight.scope !== 'PUBLIC')} />
            </Button>
          ))}

          <Button icon className="link-button">
            <Icon className="ns-trash" onClick={() => handleAction('Delete', insight, !insight.scope)} />
          </Button>
        </Button.Group>
      </div>
    </div>
  ));
const SortableList = SortableContainer(({
  allOfferingsList, handleAction, stage, listIndex,
}) => (
    <div className="tbody">
      {allOfferingsList.map((offering, index) => (
        <SortableItem
          // eslint-disable-next-line react/no-array-index-key
          key={`item-${index}`}
          docIndx={index}
          offering={offering}
          handleAction={handleAction}
          index={index}
          stage={stage}
          listIndex={listIndex}
        />
      ))}
    </div>
  ));
@inject('uiStore', 'offeringsStore', 'collectionStore')
@withRouter
@observer
export default class Insights extends Component {
  state = { isPublic: false };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { allOfferingsSorted, setOrderForOfferings } = this.props.offeringsStore;
    const { allLiveOfferingsList, stage } = this.props;
    const offeringList = stage === 'live' && allLiveOfferingsList ? allLiveOfferingsList : allOfferingsSorted;
    const isArrayNeedToMerge = !!(stage === 'live' && allLiveOfferingsList);
    if (oldIndex !== newIndex) {
      setOrderForOfferings(arrayMove(offeringList, oldIndex, newIndex), this.props.stage, isArrayNeedToMerge, this.props.offeringListIndex);
    }
  }

  handleAction = (action, offering, isPublished = false) => {
    if (action === 'Delete') {
      this.props.uiStore.setConfirmBox(action, offering.id);
    } else if (action === 'Publish') {
      console.log('isPublished', isPublished);
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
      type: 'OFFERING',
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
      type: 'OFFERING',
      collectionId: collectionStore.collectionId,
      referenceId: uiStore.confirmBox.refId,
    };
    await collectionStore.collectionMappingMutation('adminDeleteCollectionMapping', params, { isContentMapping: true, id: uiStore.confirmBox.refId });
    collectionStore.setFieldValue('collectionIndex', null);
    this.props.history.push(`${this.props.match.url}`);
    this.props.uiStore.setConfirmBox('');
  }

  render() {
    const {
      uiStore, stage, offeringsList, isLoading,
    } = this.props;

    const { confirmBox } = uiStore;
    if (isLoading) {
      return <InlineLoader />;
    }
    return (
      <>
        <div className="ui card fluid">
          <div className="ui basic table">
            <div className="row-wrap striped-table thead">
              <div className="balance first-column">Name</div>
              <div className="balance width-130">Category</div>
              <div className="balance width-130" /> Tags</div>
            <div className="balance width-130">Author</div>
            <div className="balance">POC</div>
            <div className="action right-align width-70" />
          </div>
          <SortableList
            allOfferingsList={offeringsList}
            pressDelay={100}
            handleAction={this.handleAction}
            onSortEnd={e => this.onSortEnd(e)}
            stage={stage}
            lockAxis="y"
            useDragHandle
          />
        </div>
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
