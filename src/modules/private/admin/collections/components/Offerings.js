

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import { withRouter, Link } from 'react-router-dom';
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
    <div className="row-wrap striped-table">
      <div className="balance first-column">
        <DragHandle />
        <Link to={`/dashboard/offering/${offering.offeringSlug}`}>
          <b>
            {((offering.keyTerms && offering.keyTerms.shorthandBusinessName)
              ? offering.keyTerms.shorthandBusinessName : (
                (offering.keyTerms && offering.keyTerms.legalBusinessName) ? offering.keyTerms.legalBusinessName : 'N/A'
              ))}
          </b>
          <br />
        </Link>
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
      setisPublic(isPublished);
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

// import React from 'react';
// import { observer, inject } from 'mobx-react';
// import { withRouter } from 'react-router-dom';
// import { arrayMove, SortableContainer, SortableElement, sortableHandle } from 'react-sortable-hoc';
// import { Form, Button, Icon, Header, Table, Divider } from 'semantic-ui-react';
// import { formHOC } from '../../../../../theme/form/formHOC';

// const metaInfo = {
//   store: 'manageOfferingStore',
//   form: 'GALLERY_FRM',
// };

// const DragHandle = sortableHandle(() => <Icon className="ml-10 ns-drag-holder-large mr-10" />);
// const SortableItem = SortableElement(({ toggleVisible, GALLERY_FRM, isReadOnly, fieldIndex, smartElement, removeOne, currentOfferingId, removeMedia }) => (
//   <div className="row-wrap">
//     <Form.Group className="mlr-0 plr-0 pt-0 pb-0">
//       <Table basic compact className="form-table bg-white">
//         <Table.Body>
//           <Table.Row className={GALLERY_FRM.fields.gallery[fieldIndex].isVisible.value ? '' : 'bg-offwhite'}>
//             <Table.Cell collapsing>
//               {!isReadOnly && <DragHandle />}
//             </Table.Cell>
//             <Table.Cell>
//               {smartElement.Input('caption', { displayMode: isReadOnly, multiForm: [metaInfo.form, 'gallery', fieldIndex] })}
//             </Table.Cell>
//             <Table.Cell>
//               <Header as="h4">{GALLERY_FRM.fields.gallery[fieldIndex].image.label}</Header>
//               {smartElement.ImageCropper('image', { style: { height: '125px' }, disabled: isReadOnly, multiForm: [metaInfo.form, 'gallery', fieldIndex], uploadPath: `offerings/${currentOfferingId}`, removeMedia })}
//             </Table.Cell>
//             <Table.Cell collapsing>
//               <Button className="link-button">
//                 <Icon onClick={() => toggleVisible(fieldIndex)} color="blue" name={GALLERY_FRM.fields.gallery[fieldIndex].isVisible.value ? 'ns-view' : 'ns-no-view'} />
//               </Button>
//               {/* {smartElement.FormCheckBox('isVisible', { customClass: 'customToggle', displayMode: isReadOnly, multiForm: [metaInfo.form, 'gallery', fieldIndex], toggle: true, defaults: true })} */}
//             </Table.Cell>
//             {!isReadOnly && GALLERY_FRM.fields.gallery.length > 1 && (
//               <Table.Cell collapsing>
//                 <Button icon circular floated="right" className="link-button">
//                   <Icon className="ns-trash" onClick={e => removeOne(metaInfo.form, 'gallery', fieldIndex, e)} />
//                 </Button>
//               </Table.Cell>
//             )}
//           </Table.Row>
//         </Table.Body>
//       </Table>
//     </Form.Group>
//   </div>
// ));
// const SortableList = SortableContainer(({ toggleVisible, allOfferingsList, COLLECTION_MAPPING_CONTENT_FRM,  isReadOnly, smartElement, currentOfferingId, removeMedia, removeOne }) => (
//   <div className="tbody">
//     {allOfferingsList.map((field, index) => (
//       <SortableItem
//         // eslint-disable-next-line react/no-array-index-key
//         key={`item-${index}`}
//         field={field}
//         fieldIndex={index}
//         index={index}
//         isReadOnly={isReadOnly}
//         smartElement={smartElement}
//         COLLECTION_MAPPING_CONTENT_FRM={COLLECTION_MAPPING_CONTENT_FRM}
//         currentOfferingId={currentOfferingId}
//         removeMedia={removeMedia}
//         removeOne={removeOne}
//         toggleVisible={toggleVisible}
//       />
//     ))}
//   </div>
// ));

// const OfferingList = ({ handleAction, offeringsList, onSortEnd, smartElement, removeMedia, collectionId, COLLECTION_MAPPING_CONTENT_FRM }) => (
//   <div className="ui card fluid">
//     <SortableList
//       allOfferingsList={offeringsList}
//       pressDelay={100}
//       handleAction={handleAction}
//       onSortEnd={onSortEnd}
//       removeMedia={removeMedia}
//       smartElement={smartElement}
//       lockAxis="y"
//       useDragHandle
//       COLLECTION_MAPPING_CONTENT_FRM={COLLECTION_MAPPING_CONTENT_FRM}
//       collectionId={collectionId}
//     />
//   </div>
// );

// function Offerings(props) {
//   const { smartElement, offeringsList } = props;
//   const { COLLECTION_MAPPING_CONTENT_FRM, collectionId } = props.collectionStore;
//   const removeMedia = (form, name) => {
//     window.logger(form, name);
//   };

//   const onSortEnd = async ({ oldIndex, newIndex }) => {
//     const { setOrderForCollectionsMapping, setFieldValue } = this.props.collectionStore;
//     if (oldIndex !== newIndex) {
//       this.setState({ loading: true });
//       await setOrderForCollectionsMapping(arrayMove(this.props.offeringsList, oldIndex, newIndex));
//       this.setState({ loading: false });
//       setFieldValue('collectionIndex', null);
//       this.props.history.push(`${this.props.match.url}`);
//     }
//   };
//   return (
//     <>
//       <OfferingList
//         allOfferingsList={offeringsList}
//         pressDelay={100}
//         handleAction={this.handleAction}
//         onSortEnd={e => onSortEnd(e)}
//         removeMedia={removeMedia}
//         smartElement={smartElement}
//         lockAxis="y"
//         useDragHandle
//         collectionId={collectionId}
//         COLLECTION_MAPPING_CONTENT_FRM={COLLECTION_MAPPING_CONTENT_FRM}
//       />
//       {/* {GALLERY_FRM.fields.gallery.map((field, i) => (
//         <Form.Group>
//           <Table basic compact className="form-table">
//           <Table.Body>
//             <Table.Cell collapsing>
//             {smartElement.FormCheckBox('isVisible', { customClass: 'customToggle', displayMode: isReadOnly, multiForm: [metaInfo.form, 'gallery', i], toggle: true, defaults: true })}
//             </Table.Cell>
//             <Table.Cell>
//             {smartElement.Input('caption', { displayMode: isReadOnly, multiForm: [metaInfo.form, 'gallery', i] })}
//             </Table.Cell>
//             <Table.Cell>
//             <Header as="h4">{GALLERY_FRM.fields.gallery[i].image.label}</Header>
//             {smartElement.ImageCropper('image', { style: { height: '125px' }, disabled: isReadOnly, multiForm: [metaInfo.form, 'gallery', i], uploadPath: `offerings/${currentOfferingId}`, removeMedia })}
//             </Table.Cell>
//             {!isReadOnly && GALLERY_FRM.fields.gallery.length > 1 && (
//             <Table.Cell collapsing>
//               <Button icon circular floated="right" className="link-button">
//               <Icon className="ns-trash" onClick={e => removeOne(metaInfo.form, 'gallery', i, e)} />
//               </Button>
//             </Table.Cell>
//             )}
//           </Table.Body>
//           </Table>
//         </Form.Group>
//       ))} */}
//       <Divider section />
//     </>
//   );
// }

// export default inject('collectionStore')(withRouter(formHOC(observer(Offerings), metaInfo)));
