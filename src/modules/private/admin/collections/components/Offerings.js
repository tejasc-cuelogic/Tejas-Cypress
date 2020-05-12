

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Button, Icon, Confirm } from 'semantic-ui-react';
import { SortableContainer, SortableElement, arrayMove, sortableHandle } from 'react-sortable-hoc';
import { InlineLoader } from '../../../../../theme/shared';
import formHOC from '../../../../../theme/form/formHOC';

const metaInfo = {
  store: 'collectionStore',
  form: 'COLLECTION_MAPPING_CONTENT_FRM',
};

const actions = {
  publish: { label: 'Publish', icon: 'view', icon1: 'no-view' },
};
const DragHandle = sortableHandle(() => <Icon className="ns-drag-holder-large mr-10" />);
const SortableItem = SortableElement(({
  offering, handleAction, smartElement, removeMedia, itemIndex,
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
      <div className="balance">
        {smartElement.ImageCropper('image', { style: { height: '125px' }, multiForm: [metaInfo.form, 'mappingContent', itemIndex], uploadPath: `collections/${itemIndex}`, removeMedia })}
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
  allofferingsList, handleAction, stage, listIndex, smartElement,
}) => (
    <div className="tbody">
      {allofferingsList.map((offering, index) => (
        <SortableItem
          // eslint-disable-next-line react/no-array-index-key
          key={`item-${index}`}
          docIndx={index}
          offering={offering}
          handleAction={handleAction}
          smartElement={smartElement}
          itemIndex={index}
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

  const removeMedia = (form, name) => {
    window.logger(form, name);
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
    uiStore, stage, offeringsList, isLoading, smartElement,
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
          removeMedia={removeMedia}
          smartElement={smartElement}
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
export default inject('collectionStore', 'uiStore')(withRouter(formHOC(observer(Offerings), metaInfo)));

// import React, { useState } from 'react';
// import { observer, inject } from 'mobx-react';
// import { withRouter } from 'react-router-dom';
// import { arrayMove, SortableContainer, SortableElement, sortableHandle } from 'react-sortable-hoc';
// import { Icon, Table, Confirm, Header } from 'semantic-ui-react';
// import { InlineLoader } from '../../../../../theme/shared';
// import formHOC from '../../../../../theme/form/formHOC';
// import { ImageCropper } from '../../../../../theme/form';
// import Helper from '../../../../../helper/utility';

// const metaInfo = {
//   store: 'collectionStore',
//   form: 'COLLECTION_MAPPING_CONTENT_FRM',
// };

// const DragHandle = sortableHandle(() => <Icon className="ml-10 ns-drag-holder-large mr-10" />);
// const SortableItem = SortableElement(({ offering, COLLECTION_MAPPING_CONTENT_FRM, collectionStore, fieldIndex, key, setData, handelReset, handelImageDimension, handleVerifyFileExtension }) => (
//   <div className="row-wrap">
//     <Table basic compact className="form-table bg-white">
//       <Table.Body>
//         <Table.Row className="bg-offwhite">
//           <Table.Cell>
//             <DragHandle />
//             <b>{((offering.keyTerms && offering.keyTerms.shorthandBusinessName)
//               ? offering.keyTerms.shorthandBusinessName : (
//                 (offering.keyTerms && offering.keyTerms.legalBusinessName) ? offering.keyTerms.legalBusinessName : 'N/A'
//               ))}
//             </b>
//           </Table.Cell>
//           <Table.Cell>
//             <div>
//               <Header as="h4">Image</Header>
//               <ImageCropper
//                 keyName={key || 'image'}
//                 fieldData={COLLECTION_MAPPING_CONTENT_FRM.fields.mappingContent[fieldIndex].image}
//                 setData={(attr, value, itemIndex) => setData(attr, value, itemIndex)}
//                 verifyExtension={(fileExt, fieldName, itemIndex) => handleVerifyFileExtension(fileExt, fieldName, itemIndex)}
//                 handelReset={handelReset}
//                 verifyImageDimension={handelImageDimension}
//                 field={COLLECTION_MAPPING_CONTENT_FRM.fields.mappingContent[fieldIndex].image}
//                 modalUploadAction={fieldname => collectionStore.uploadMedia(fieldname, metaInfo.form, `collections${fieldIndex}`)}
//                 name="image"
//                 cropInModal
//                 index={fieldIndex}
//                 aspect={3 / 2}
//                 size="small"
//               />              </div>
//           </Table.Cell>
//         </Table.Row>
//       </Table.Body>
//     </Table>
//   </div>
// ));
// const SortableList = SortableContainer(({ toggleVisible, handelReset, handelImageDimension, setData, handleVerifyFileExtension, allOfferingsList, collectionStore, COLLECTION_MAPPING_CONTENT_FRM, smartElement, currentOfferingId, removeMedia, removeOne }) => (
//   <div className="tbody">
//     {allOfferingsList.map((offering, index) => (
//       <SortableItem
//         // eslint-disable-next-line react/no-array-index-key
//         key={`item-${index}`}
//         offering={offering}
//         fieldIndex={index}
//         index={index}
//         smartElement={smartElement}
//         COLLECTION_MAPPING_CONTENT_FRM={COLLECTION_MAPPING_CONTENT_FRM}
//         currentOfferingId={currentOfferingId}
//         removeMedia={removeMedia}
//         collectionStore={collectionStore}
//         handelImageDimension={handelImageDimension}
//         handleVerifyFileExtension={handleVerifyFileExtension}
//         setData={setData}
//         handelReset={handelReset}
//         removeOne={removeOne}
//         toggleVisible={toggleVisible}
//       />
//     ))}
//   </div>
// ));

// const OfferingList = ({ handleAction, allofferingsList, handelReset, handelImageDimension, setData, handleVerifyFileExtension, onSortEnd, smartElement, removeMedia, collectionId, COLLECTION_MAPPING_CONTENT_FRM }) => (
//   <div className="ui card fluid">
//     <SortableList
//       allOfferingsList={allofferingsList}
//       pressDelay={100}
//       handleAction={handleAction}
//       onSortEnd={onSortEnd}
//       removeMedia={removeMedia}
//       smartElement={smartElement}
//       handelReset={handelReset}
//       lockAxis="y"
//       handelImageDimension={handelImageDimension}
//       setData={setData}
//       handleVerifyFileExtension={handleVerifyFileExtension}
//       useDragHandle
//       COLLECTION_MAPPING_CONTENT_FRM={COLLECTION_MAPPING_CONTENT_FRM}
//       collectionId={collectionId}
//     />
//   </div>
// );

// function Offerings(props) {
//   const [isPublic, setisPublic] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [index, setIndex] = useState(null);


//   const onSortEnd = async ({ oldIndex, newIndex }) => {
//     if (oldIndex !== newIndex) {
//       setLoading(true);
//       await props.collectionStore.setOrderForCollectionsMapping(arrayMove(props.offeringsList, oldIndex, newIndex));
//       setLoading(false);
//       props.collectionStore.setFieldValue('collectionIndex', null);
//       props.history.push(`${props.match.url}`);
//     }
//   };

//   const handleVerifyFileExtension = (fileExt, field, fieldIndex) => {
//     const validate = Helper.validateImageExtension(fileExt);
//     console.log('fieldIndex', fieldIndex);
//     setIndex(fieldIndex);
//     console.log('index', index);
//     console.log('field', field);
//     if (validate.isInvalid) {
//       const attr = 'error';
//       const { errorMsg } = validate;
//       props.collectionStore.setMediaAttribute(metaInfo.form, attr, errorMsg, field, index, 'mappingContent');
//       props.collectionStore.setMediaAttribute(metaInfo.form, 'value', '', field, index, 'mappingContent');
//       return false;
//     }
//     return true;
//   };
//   const handelImageDimension = (width, height, field) => {
//     if (width < 200 || height < 200) {
//       console.log('index', index);
//       const attr = 'error';
//       const errorMsg = 'Image size should not be less than 200 x 200.';
//       props.collectionStore.setMediaAttribute(metaInfo.form, attr, errorMsg, field, index, 'mappingContent');
//       props.collectionStore.setMediaAttribute(metaInfo.form, 'value', '', field, index, 'mappingContent');
//       return false;
//     }
//     return true;
//   };
//   const setData = (attr, value, fieldIndex) => {
//     props.collectionStore.setMediaAttribute(metaInfo.form, attr, value, 'image', fieldIndex, 'mappingContent');
//   };

//   const handleAction = (action, offering, isPublished = false) => {
//     if (action === 'Delete') {
//       props.uiStore.setConfirmBox(action, offering.id);
//     } else if (action === 'Publish') {
//       setisPublic(isPublished ? 'PUBLIC' : 'HIDDEN');
//       props.uiStore.setConfirmBox(action, offering.id, isPublished);
//     }
//   };

//   const handleDeleteCancel = () => {
//     props.uiStore.setConfirmBox('');
//   };

//   const removeMedia = (form, name) => {
//     window.logger(form, name);
//   };

//   const handlePublishOffering = async () => {
//     const { collectionStore, uiStore } = props;
//     const params = {
//       type: 'OFFERING',
//       collectionId: collectionStore.collectionId,
//       referenceId: uiStore.confirmBox.refId,
//       scope: isPublic ? 'PUBLIC' : 'HIDDEN',
//     };
//     await collectionStore.collectionMappingMutation('adminCollectionMappingUpsert', params);
//     collectionStore.setFieldValue('collectionIndex', null);
//     props.history.push(`${props.match.url}`);
//     props.uiStore.setConfirmBox('');
//   };

//   const handleResetImageCropper = (fieldIndex) => {
//     props.collectionStore.resetImageCropper(metaInfo.form, 'image', fieldIndex, 'mappingContent');
//   };

//   const handleDeleteCollection = async () => {
//     const { collectionStore, uiStore } = props;
//     const params = {
//       type: 'OFFERING',
//       collectionId: collectionStore.collectionId,
//       referenceId: uiStore.confirmBox.refId,
//     };
//     await collectionStore.collectionMappingMutation('adminDeleteCollectionMapping', params);
//     collectionStore.setFieldValue('collectionIndex', null);
//     props.history.push(`${props.match.url}`);
//     props.uiStore.setConfirmBox('');
//   };

//   const {
//     uiStore, stage, offeringsList, isLoading, smartElement, collectionStore,
//   } = props;
//   const { COLLECTION_MAPPING_CONTENT_FRM } = collectionStore;
//   const { confirmBox } = uiStore;
//   if (isLoading || loading) {
//     return <InlineLoader />;
//   }

//   return (
//     <>
//       {/* <div className="ui card fluid">
//         <div className="ui basic table">
//           <div className="row-wrap striped-table thead">
//             <div className="balance first-column">Offering</div>
//           </div>
//           <div className="action right-align width-70" />
//         </div> */}
//       <OfferingList
//         allofferingsList={offeringsList}
//         pressDelay={100}
//         handleAction={handleAction}
//         onSortEnd={e => onSortEnd(e)}
//         removeMedia={removeMedia}
//         smartElement={smartElement}
//         setData={setData}
//         collectionStore={collectionStore}
//         COLLECTION_MAPPING_CONTENT_FRM={COLLECTION_MAPPING_CONTENT_FRM}
//         handelReset={handleResetImageCropper}
//         handelImageDimension={handelImageDimension}
//         handleVerifyFileExtension={handleVerifyFileExtension}
//         stage={stage}
//         lockAxis="y"
//         useDragHandle
//       />
//       {/* </div> */}
//       <Confirm
//         header="Confirm"
//         content={confirmBox.entity === 'Publish' ? `Are you sure you want to make this offering ${isPublic ? 'Public' : 'Non-Public'}?` : 'Are you sure you want to delete this offering?'}
//         open={confirmBox.entity === 'Delete' || confirmBox.entity === 'Publish'}
//         onCancel={handleDeleteCancel}
//         onConfirm={confirmBox.entity === 'Publish' ? handlePublishOffering : handleDeleteCollection}
//         size="mini"
//         className="deletion"
//       />
//     </>
//   );
// }

// export default inject('collectionStore', 'uiStore')(withRouter(formHOC(observer(Offerings), metaInfo)));
