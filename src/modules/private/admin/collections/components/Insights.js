
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

const DragHandle = sortableHandle(() => <Icon className="ml-10 ns-drag-holder-large mr-10" />);
const SortableItem = SortableElement(({
  insight, handleAction, smartElement, removeMedia, fieldIndex,
}) => (
    <Table.Row className={(insight.scope === 'PUBLIC') ? '' : 'row-highlight'} collapsing>
      <Table.Cell collapsing>
        <DragHandle />
        {insight.title}
      </Table.Cell>
      <Table.Cell>
        {smartElement.ImageCropper('image', { style: { height: '125px' }, multiForm: [metaInfo.form, 'mappingContent', fieldIndex], uploadPath: `collections/${fieldIndex}`, removeMedia })}
      </Table.Cell>
      <Table.Cell collapsing>
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
      </Table.Cell>
    </Table.Row>
  ));
const SortableList = SortableContainer(({ toggleVisible, allInsightsList, handleAction, isReadOnly, smartElement, removeMedia, removeOne }) => (
  <div className="tbody">
    <div className="row-wrap">
      <Form.Group className="mlr-0 plr-0 pt-0 pb-0">
        <Table basic compact className="form-table bg-white striped">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Image</Table.HeaderCell>
              <Table.HeaderCell textAlign="right">Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {allInsightsList.map((insight, index) => (
              <SortableItem
                // eslint-disable-next-line react/no-array-index-key
                key={`item-${index}`}
                insight={insight}
                fieldIndex={index}
                index={index}
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
const InsightsList = ({ toggleVisible, allInsightsList, handleAction, isReadOnly, onSortEnd, smartElement, removeMedia, removeOne }) => (
  <div className="ui card fluid">
    <SortableList
      allInsightsList={allInsightsList}
      pressDelay={100}
      onSortEnd={onSortEnd}
      lockAxis="y"
      useDragHandle
      isReadOnly={isReadOnly}
      handleAction={handleAction}
      smartElement={smartElement}
      removeMedia={removeMedia}
      removeOne={removeOne}
      toggleVisible={toggleVisible}
    />
  </div>
);

function Offerings(props) {
  const [loading, setLoading] = useState(false);
  const [isPublic, setisPublic] = useState(false);

  const { smartElement, insightsList, isLoading } = props;
  const { confirmBox } = props.uiStore;
  const removeMedia = (form, name) => {
    window.logger(form, name);
  };

  const onSortEnd = async ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      setLoading(true);
      await props.collectionStore.setOrderForCollectionsMapping(arrayMove(props.insightsList, oldIndex, newIndex));
      setLoading(false);
      props.collectionStore.setFieldValue('collectionIndex', null);
      props.history.push(`${props.match.url}`);
    }
  };

  const handleAction = (action, offering, isPublished = false) => {
    if (action === 'Delete') {
      props.uiStore.setConfirmBox(action, offering.id);
    } else if (action === 'Publish') {
      setisPublic(isPublished === 'PUBLIC' ? 'PUBLIC' : 'HIDDEN');
      props.uiStore.setConfirmBox(action, offering.id, isPublished);
    }
  };

  const handlePublishOffering = async () => {
    const { collectionStore, uiStore } = props;
    const params = {
      type: 'INSIGHT',
      collectionId: collectionStore.collectionId,
      referenceId: uiStore.confirmBox.refId,
      scope: isPublic === 'PUBLIC' ? 'PUBLIC' : 'HIDDEN',
    };
    await collectionStore.collectionMappingMutation('adminCollectionMappingUpsert', params);
    collectionStore.setFieldValue('collectionIndex', null);
    props.history.push(`${props.match.url}`);
    props.uiStore.setConfirmBox('');
  };

  const handleDeleteCancel = () => {
    props.uiStore.setConfirmBox('');
  };

  const handleDeleteCollection = async () => {
    const { collectionStore, uiStore } = props;
    const params = {
      type: 'INSIGHT',
      collectionId: collectionStore.collectionId,
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
      <InsightsList
        allInsightsList={insightsList}
        removeMedia={removeMedia}
        smartElement={smartElement}
        handleAction={handleAction}
        onSortEnd={onSortEnd}
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

export default inject('collectionStore', 'uiStore')(withRouter(formHOC(observer(Offerings), metaInfo)));
