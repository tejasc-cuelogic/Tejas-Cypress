
import React, { useState } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { arrayMove, SortableContainer, SortableElement, sortableHandle } from 'react-sortable-hoc';
import { Icon, Divider, Button, Confirm, Table, Form } from 'semantic-ui-react';
import formHOC from '../../../../../theme/form/formHOC';
import { InlineLoader } from '../../../../../theme/shared';

const metaInfo = {
  store: 'collectionStore',
  form: 'COLLECTION_MAPPING_CONTENT_FRM',
};
const actions = {
  publish: { label: 'Publish', icon: 'view', icon1: 'no-view' },
};

const offeringTitle = record => (
  <b>
    {((record.keyTerms && record.keyTerms.shorthandBusinessName)
      ? record.keyTerms.shorthandBusinessName : (
        (record.keyTerms && record.keyTerms.legalBusinessName) ? record.keyTerms.legalBusinessName : 'N/A'
      ))}
  </b>
);

const DragHandle = sortableHandle(() => <Icon className="ml-10 ns-drag-holder-large mr-10" />);
const SortableItem = SortableElement(({
  record, handleAction, smartElement, removeMedia, isOffering, fieldIndex, collectionId, isReadOnly,
}) => (
    <Table.Row className={(record.scope === 'PUBLIC') ? '' : 'row-highlight'} collapsing>
      <Table.Cell collapsing>
        <DragHandle />
        {isOffering ? offeringTitle(record).length > 50 ? (`${offeringTitle(record).substring(0, 55)}...`) : offeringTitle(record) : record.title.length > 60 ? (`${record.title.substring(0, 55)}...`) : record.title}
      </Table.Cell>
      <Table.Cell>
        {smartElement.ImageCropper('image', { style: { height: '125px' }, multiForm: [metaInfo.form, 'mappingContent', fieldIndex], uploadPath: `collections/${collectionId}`, disabled: isReadOnly, removeMedia })}
      </Table.Cell>
      {!isReadOnly
        && (
          <Table.Cell collapsing>
            <Button.Group>
              {Object.keys(actions).map(action => (
                <Button icon className="link-button">
                  <Icon className={`ns-${record.scope === 'PUBLIC' ? actions[action].icon : actions[action].icon1}`} onClick={() => handleAction(actions[action].label, record, record.scope !== 'PUBLIC')} />
                </Button>
              ))}
              <Button icon className="link-button">
                <Icon className="ns-trash" onClick={() => handleAction('Delete', record, !record.scope)} />
              </Button>
            </Button.Group>
          </Table.Cell>
        )
      }
    </Table.Row>
  ));
const SortableList = SortableContainer(({ toggleVisible, isOffering, collectionId, allRecordsList, handleAction, isReadOnly, smartElement, removeMedia, removeOne }) => (
  <div className="tbody">
    <div className="row-wrap">
      <Form.Group className="mlr-0 plr-0 pt-0 pb-0">
        <Table basic compact className="form-table bg-white striped">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>{isOffering ? 'Offering' : 'Title'}</Table.HeaderCell>
              <Table.HeaderCell>Image</Table.HeaderCell>
              {!isReadOnly && <Table.HeaderCell textAlign="right">Action</Table.HeaderCell>
              }
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {allRecordsList.map((record, index) => (
              <SortableItem
                // eslint-disable-next-line react/no-array-index-key
                key={`item-${index}`}
                record={record}
                fieldIndex={index}
                isOffering={isOffering}
                index={index}
                collectionId={collectionId}
                isReadOnly={isReadOnly}
                smartElement={smartElement}
                handleAction={handleAction}
                removeMedia={removeMedia}
                removeOne={removeOne}
                toggleVisible={toggleVisible}
              />
            ))}
          </Table.Body>
        </Table>
      </Form.Group>
    </div>
  </div>
));
const ContainerList = ({ toggleVisible, collectionId, isOffering, allRecordsList, handleAction, isReadOnly, onSortEnd, smartElement, removeMedia, removeOne }) => (
  <div className="ui card fluid">
    <SortableList
      allRecordsList={allRecordsList}
      pressDelay={100}
      onSortEnd={onSortEnd}
      lockAxis="y"
      useDragHandle
      isReadOnly={isReadOnly}
      isOffering={isOffering}
      handleAction={handleAction}
      smartElement={smartElement}
      removeMedia={removeMedia}
      removeOne={removeOne}
      collectionId={collectionId}
      toggleVisible={toggleVisible}
    />
  </div>
);

function DraggableListing(props) {
  const [loading, setLoading] = useState(false);
  const [isPublic, setisPublic] = useState(false);

  const { smartElement, allRecords, isLoading, isOffering } = props;
  const { isLocked } = props.collectionStore;
  const { confirmBox } = props.uiStore;
  const removeMedia = (form, name) => {
    window.logger(form, name);
  };

  const onSortEnd = async ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      setLoading(true);
      await props.collectionStore.setOrderForCollectionsMapping(arrayMove(props.allRecords, oldIndex, newIndex));
      setLoading(false);
      props.collectionStore.setFieldValue('collectionIndex', null);
      props.history.push(`${props.match.url}`);
    }
  };

  const handleAction = (action, record, isPublished = false) => {
    if (action === 'Delete') {
      props.uiStore.setConfirmBox(action, record.id);
    } else if (action === 'Publish') {
      setisPublic(isPublished ? 'PUBLIC' : 'HIDDEN');
      props.uiStore.setConfirmBox(action, record.id, isPublished);
    }
  };

  const handlePublishOffering = async () => {
    const { collectionStore, uiStore, index } = props;
    const { customValue } = collectionStore.COLLECTION_CONTENT_FRM.fields.content[index];
    const params = {
      type: isOffering ? 'OFFERING' : 'INSIGHT',
      collectionId: collectionStore.collectionId,
      referenceId: uiStore.confirmBox.refId,
      customValue: customValue.value,
      scope: isPublic === 'PUBLIC' ? 'PUBLIC' : 'HIDDEN',
    };
    await collectionStore.collectionMappingMutation('adminCollectionMappingUpsert', params, index);
    collectionStore.setFieldValue('collectionIndex', null);
    props.uiStore.setConfirmBox('');
    props.history.push(`${props.match.url}`);
  };

  const handleDeleteCancel = () => {
    props.uiStore.setConfirmBox('');
  };

  const handleDeleteCollection = async () => {
    const { collectionStore, uiStore, index } = props;
    const { customValue } = collectionStore.COLLECTION_CONTENT_FRM.fields.content[index];
    const params = {
      type: isOffering ? 'OFFERING' : 'INSIGHT',
      collectionId: collectionStore.collectionId,
      customValue: customValue.value,
      referenceId: uiStore.confirmBox.refId,
    };
    await collectionStore.collectionMappingMutation('adminDeleteCollectionMapping', params);
    collectionStore.setFieldValue('collectionIndex', null);
    props.history.push(`${props.match.url}`);
    props.uiStore.setConfirmBox('');
  };
  if (isLoading || loading) {
    return <InlineLoader />;
  }

  return (
    <>
      <ContainerList
        allRecordsList={allRecords}
        removeMedia={removeMedia}
        smartElement={smartElement}
        handleAction={handleAction}
        onSortEnd={onSortEnd}
        isOffering={isOffering}
        isReadOnly={isLocked}
        collectionId={props.collectionStore.collectionId}
      />
      <Confirm
        header="Confirm"
        content={confirmBox.entity === 'Publish' ? `Are you sure you want to make this offering ${isPublic ? 'Public' : 'Non-Public'}?` : 'Are you sure you want to delete this offering?'}
        open={confirmBox.entity === 'Delete' || confirmBox.entity === 'Publish'}
        onCancel={handleDeleteCancel}
        onConfirm={confirmBox.entity === 'Publish' ? handlePublishOffering : handleDeleteCollection}
        size="mini"
        className="deletion"
      />
      <Divider section />
    </>
  );
}

export default inject('collectionStore', 'uiStore')(withRouter(formHOC(observer(DraggableListing), metaInfo)));
