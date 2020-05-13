

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Button, Icon, Confirm } from 'semantic-ui-react';
import { SortableContainer, SortableElement, arrayMove, sortableHandle } from 'react-sortable-hoc';
import { InlineLoader } from '../../../../../theme/shared';
// import { formHOC } from '../../../../../theme/form/formHOC';


const actions = {
  publish: { label: 'Publish', icon: 'view', icon1: 'no-view' },
};
const DragHandle = sortableHandle(() => <Icon className="ns-drag-holder-large mr-10" />);
const SortableItem = SortableElement(({
  offering, handleAction,
}) => (
    <div className={`row-wrap striped-table ${offering.scope === 'PUBLIC' ? '' : 'row-highlight'}`}>
      <div className="balance first-column">
        <DragHandle />
          <b>
            {((offering.keyTerms && offering.keyTerms.shorthandBusinessName)
              ? offering.keyTerms.shorthandBusinessName : (
                (offering.keyTerms && offering.keyTerms.legalBusinessName) ? offering.keyTerms.legalBusinessName : 'N/A'
              ))}
          </b>
          <br />
      </div>
      <div className="action right-align width-70">
        <Button.Group>
          {Object.keys(actions).map(action => (
            <Button icon className="link-button">
              <Icon className={`ns-${offering.scope === 'PUBLIC' ? actions[action].icon : actions[action].icon1}`} onClick={() => handleAction(actions[action].label, offering, offering.scope !== 'PUBLIC')} />
            </Button>
          ))}

          <Button icon className="link-button">
            <Icon className="ns-trash" onClick={() => handleAction('Delete', offering, !offering.scope)} />
          </Button>
        </Button.Group>
      </div>
    </div>
  ));
const SortableList = SortableContainer(({
  allofferingsList, handleAction, stage, listIndex,
}) => (
    <div className="tbody">
      {allofferingsList.map((offering, index) => (
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

function Offerings(props) {
  const [isPublic, setisPublic] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSortEnd = async ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      setLoading(true);
      await props.collectionStore.setOrderForCollectionsMapping(arrayMove(props.offeringsList, oldIndex, newIndex));
      setLoading(false);
      props.collectionStore.setFieldValue('collectionIndex', null);
      props.history.push(`${props.match.url}`);
    }
  };

  const handleAction = (action, offering, isPublished = false) => {
    if (action === 'Delete') {
      props.uiStore.setConfirmBox(action, offering.id);
    } else if (action === 'Publish') {
      setisPublic(isPublished ? 'PUBLIC' : 'HIDDEN');
      props.uiStore.setConfirmBox(action, offering.id, isPublished);
    }
  };

  const handleDeleteCancel = () => {
    props.uiStore.setConfirmBox('');
  };

  const handlePublishOffering = async () => {
    const { collectionStore, uiStore } = props;
    const params = {
      type: 'OFFERING',
      collectionId: collectionStore.collectionId,
      referenceId: uiStore.confirmBox.refId,
      scope: isPublic ? 'PUBLIC' : 'HIDDEN',
    };
    await collectionStore.collectionMappingMutation('adminCollectionMappingUpsert', params);
    collectionStore.setFieldValue('collectionIndex', null);
    props.history.push(`${props.match.url}`);
    props.uiStore.setConfirmBox('');
  };

  const handleDeleteCollection = async () => {
    const { collectionStore, uiStore } = props;
    const params = {
      type: 'OFFERING',
      collectionId: collectionStore.collectionId,
      referenceId: uiStore.confirmBox.refId,
    };
    await collectionStore.collectionMappingMutation('adminDeleteCollectionMapping', params);
    collectionStore.setFieldValue('collectionIndex', null);
    props.history.push(`${props.match.url}`);
    props.uiStore.setConfirmBox('');
  };

  const {
    uiStore, stage, offeringsList, isLoading,
  } = props;

  const { confirmBox } = uiStore;
  if (isLoading || loading) {
    return <InlineLoader />;
  }

  return (
    <>
      <div className="ui card fluid">
        <div className="ui basic table">
          <div className="row-wrap striped-table thead">
            <div className="balance first-column">Offering</div>
          </div>
          <div className="action right-align width-70" />
        </div>
        <SortableList
          allofferingsList={offeringsList}
          pressDelay={100}
          handleAction={handleAction}
          onSortEnd={e => onSortEnd(e)}
          stage={stage}
          lockAxis="y"
          useDragHandle
        />
      </div>
      <Confirm
        header="Confirm"
        content={confirmBox.entity === 'Publish' ? `Are you sure you want to make this offering ${isPublic ? 'Public' : 'Non-Public'}?` : 'Are you sure you want to delete this offering?'}
        open={confirmBox.entity === 'Delete' || confirmBox.entity === 'Publish'}
        onCancel={handleDeleteCancel}
        onConfirm={confirmBox.entity === 'Publish' ? handlePublishOffering : handleDeleteCollection}
        size="mini"
        className="deletion"
      />
    </>
  );
}
export default inject('uiStore', 'collectionStore')(withRouter(observer(Offerings)));
