/* eslint-disable */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { SortableContainer, SortableElement, sortableHandle, arrayMove } from 'react-sortable-hoc';
import { Form, Header, Button, Icon, Table } from 'semantic-ui-react';
import ButtonGroupType2 from '../../ButtonGroupType2';
import formHOC from '../../../../../../../theme/form/formHOC';

const metaInfo = {
  store: 'manageOfferingStore',
  form: 'DOCUMENT_MAPPING_FRM',
};

// const DragHandleOld = sortableHandle(() => <Icon className="ns-drag-holder mr-10" />);
// const SortableItemOld = SortableElement(({ offeringClose, document, isReadonly = false, removeOne, docIndx, formName, length, smartElement }) => {
//   return (
//     <>
//       <div className="row-wrap">
//         <div className="width-70">
//           {!offeringClose
//             && <DragHandle />
//           }
//         </div>
//         <div className="balance-half">
//           {smartElement.Input('key', { displayMode: isReadonly, multiForm: [metaInfo.form, 'mapping', docIndx], ishidelabel: true })}
//         </div>
//         <div className="balance-half">
//           {smartElement.FormDropDown('type', { displayMode: isReadonly, multiForm: [metaInfo.form, 'mapping', docIndx], containerwidth: 8 })}
//         </div>
//         <div className="action">
//           <Button disabled={isReadonly || length === 1} icon circular className="link-button">
//             <Icon className="ns-trash" onClick={e => removeOne(formName, 'mapping', docIndx, e)} />
//           </Button>
//         </div>
//       </div>
//     </>
//   );
// });

// const SortableListOld = SortableContainer(({ smartElement, removeOne, offeringClose, docs, isReadonly, formName }) => {
//   return (
//     <div>
//       {docs.map((doc, index) => (
//         <SortableItem
//           smartElement={smartElement}
//           offeringClose={offeringClose}
//           key={`item-${index}`}
//           docIndx={index}
//           document={doc}
//           isReadonly={isReadonly}
//           removeOne={removeOne}
//           formName={formName}
//           length={docs.length}
//           index={index}
//         />
//       ))}
//     </div>
//   );
// });

const DragHandle = sortableHandle(() => <Icon className="ml-10 ns-drag-holder-large mr-10" />);
const SortableItem = SortableElement(({ offer, DOCUMENT_MAPPING_FRM, isReadOnly, fieldIndex, smartElement, removeOne, hideHighlight }) => (
  <div className="row-wrap">
    <Form.Group className="mlr-0 plr-0 pt-0 pb-0">
      <Table basic compact className="form-table">
        <Table.Body>
          <Table.Row>
            <Table.Cell collapsing>
              {!isReadOnly && <DragHandle />}
            </Table.Cell>
            <Table.Cell>
              {smartElement.Input('key', { displayMode: isReadOnly, multiForm: [metaInfo.form, 'mapping', fieldIndex] })}
            </Table.Cell>
            <Table.Cell>
              {smartElement.FormSelect('type', { displayMode: isReadOnly, multiForm: [metaInfo.form, 'mapping', fieldIndex] })}
            </Table.Cell>
            {/* {DOCUMENT_MAPPING_FRM.fields.mapping[fieldIndex].keyType.value === 'custom' && (
              <Table.Cell>
                {smartElement.Input('keyValue', { label: 'Custom Value', displayMode: isReadOnly, multiForm: [metaInfo.form, 'mapping', fieldIndex] })}
              </Table.Cell>
            )}
            {DOCUMENT_MAPPING_FRM.fields.mapping[fieldIndex].keyType.value === 'mapped' && (
              <Table.Cell>
                {smartElement.FormSelect('keyValue', { label: 'Key List', displayMode: isReadOnly, multiForm: [metaInfo.form, 'mapping', fieldIndex] })}
              </Table.Cell>
            )}
            {DOCUMENT_MAPPING_FRM.fields.mapping[fieldIndex].keyType.value === 'mapped' && (
              <Table.Cell>
                {smartElement.Input('keyFormat', { displayMode: isReadOnly, multiForm: [metaInfo.form, 'mapping', fieldIndex] })}
              </Table.Cell>
            )}
            {DOCUMENT_MAPPING_FRM.fields.mapping[fieldIndex].keyType.value === 'mapped' && (
              <Table.Cell>
                {<div className="field">{DOCUMENT_MAPPING_FRM.fields.mapping[fieldIndex].keyLabel.value ? DOCUMENT_MAPPING_FRM.fields.mapping[fieldIndex].keyLabel.value : 'N/A'}:  {get(offer, DOCUMENT_MAPPING_FRM.fields.mapping[fieldIndex].keyValue.value) ? Helper.formatValue(DOCUMENT_MAPPING_FRM.fields.mapping[fieldIndex].keyFormat.value, Helper.enumToText(DOCUMENT_MAPPING_FRM.fields.mapping[fieldIndex].keyValue.value, get(offer, DOCUMENT_MAPPING_FRM.fields.mapping[fieldIndex].keyValue.value), true)) : 'N/A'}</div>}
              </Table.Cell>
            )} */}
            {!isReadOnly && DOCUMENT_MAPPING_FRM.fields.mapping.length > 1 && (
              <Table.Cell collapsing>
                <Button icon circular floated="right" className="link-button">
                  <Icon className="ns-trash" onClick={e => removeOne(metaInfo.form, 'mapping', fieldIndex, e)} />
                </Button>
              </Table.Cell>
            )}
          </Table.Row>
        </Table.Body>
      </Table>
    </Form.Group>
  </div>
));


const SortableList = SortableContainer(({ hideHighlight, offer, DOCUMENT_MAPPING_FRM, isReadOnly, smartElement, removeOne }) => (
  <div className="tbody">
    {DOCUMENT_MAPPING_FRM.fields.mapping.map((field, index) => (
      <SortableItem
        // eslint-disable-next-line react/no-array-index-key
        key={`item-${index}`}
        field={field}
        fieldIndex={index}
        index={index}
        isReadOnly={isReadOnly}
        smartElement={smartElement}
        DOCUMENT_MAPPING_FRM={DOCUMENT_MAPPING_FRM}
        removeOne={removeOne}
        offer={offer}
        hideHighlight={hideHighlight}
      />
    ))}
  </div>
));


const MetaList = ({ hideHighlight, offer, DOCUMENT_MAPPING_FRM, isReadOnly, onSortEnd, smartElement, removeOne }) => (
  <div className="ui card fluid">
    <SortableList
      DOCUMENT_MAPPING_FRM={DOCUMENT_MAPPING_FRM}
      pressDelay={100}
      onSortEnd={onSortEnd}
      lockAxis="y"
      useDragHandle
      isReadOnly={isReadOnly}
      smartElement={smartElement}
      removeOne={removeOne}
      offer={offer}
      hideHighlight={hideHighlight}
    />
  </div>
);

function DocumentMapping(props) {
  const handleFormSubmitForBusinessApplication = () => {
    console.log('test submit handle');
  }

  const onSortEnd = ({ oldIndex, newIndex }, isReadonly) => {
    if (!isReadonly) {
      const { metaInfo } = props;
      const docs = [...props[metaInfo.store][metaInfo.form].fields.documents];
      props.offeringCreationStore.setUploadDocsOrder(arrayMove(docs, oldIndex, newIndex), metaInfo.form);
    }
  };

  const {
    hideHighlight,
    manageOfferingStore,
    smartElement,
    title,
  } = props;
  const { removeOne, addMore, DOCUMENT_MAPPING_FRM } = manageOfferingStore;  
  // const isReadonly = false;
  // const formName = metaInfo.form;
  const docs = [...(props[metaInfo.store][metaInfo.form].fields.mapping)];
  return (
    <>
      <Header as="h4">
        {title || 'Additional Fields'}
        <Button size="small" color="blue" className="ml-10 link-button mt-20" onClick={() => addMore('DOCUMENT_MAPPING_FRM', 'mapping')}>+ Add another field</Button>
      </Header>
      <MetaList
        smartElement={smartElement}
        isReadOnly={false}
        offer={docs}
        hideHighlight={hideHighlight}
        removeOne={removeOne}
        DOCUMENT_MAPPING_FRM={DOCUMENT_MAPPING_FRM}
        onSortEnd={onSortEnd}
      />
    </>


    // <div className={isIssuer || (isIssuer && !match.url.includes('offering-creation')) ? 'ui card fluid form-card' : ''}>
    //   <Form>
    //     <Header as="h4" className={offeringClose ? 'offering-close-header' : ''}>
    //       {header || ''}
    //       {!isReadonly &&
    //         <Button.Group size="mini" floated="right">
    //           <Button onClick={e => addMore(formName, uploadFormKey)} primary compact content="Add" />
    //         </Button.Group>
    //       }
    //     </Header>
    //     <Divider hidden />
    //     <div className="ui basic compact table form-table">
    //       <div className="row-wrap thead">
    //         <div className="width-70" />
    //         <div className="balance-half">Key</div>
    //         <div className="balance-half">Vaue</div>
    //         <div className="action">Actions</div>
    //       </div>
    //       <SortableList
    //         smartElement={smartElement}
    //         offeringClose={offeringClose}
    //         docs={docs}
    //         pressDelay={100}
    //         onSortEnd={onSortEnd}
    //         isReadonly={isReadonly}
    //         removeOne={removeOne}
    //         formName={formName}
    //         lockAxis="y"
    //         useDragHandle
    //       />
    //     </div>
    //     <Divider hidden />
    //     {!offeringClose && isButtonGroup
    //       &&
    //       (
    //         <ButtonGroupType2
    //           submitted={submitted}
    //           isManager={isManager}
    //           approved={approved}
    //           updateOffer={handleFormSubmit}
    //         />
    //       )
    //     }
    //     {!isReadonly && isSaveOnly
    //       &&
    //       (
    //         <div className="right-align mt-20">
    //           <Button disabled={!props[metaInfo.store][metaInfo.form].mapping.isValid || inProgress === 'save'} loading={inProgress === 'save'} primary className="relaxed" onClick={handleFormSubmitForBusinessApplication} >Save</Button>
    //         </div>
    //       )
    //     }
    //   </Form>
    // </div>
  );

}

export default inject('userStore', 'uiStore')(withRouter(formHOC(observer(DocumentMapping), metaInfo)));
