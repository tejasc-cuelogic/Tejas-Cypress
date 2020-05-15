/* eslint-disable */
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { SortableContainer, SortableElement, sortableHandle, arrayMove } from 'react-sortable-hoc';
import { Form, Header, Button, Icon, Table } from 'semantic-ui-react';
import ButtonGroupType2 from '../../ButtonGroupType2';
import formHOC from '../../../../../../../theme/form/formHOC';

const metaInfo = {
  store: 'manageOfferingStore',
  form: 'DOCUMENT_UPLOAD_MAPPING_FRM',
};

const DragHandle = sortableHandle(() => <Icon className="ml-10 ns-drag-holder-large mr-10" />);
const SortableItem = SortableElement(({ offer, currentForm, isReadOnly, fieldIndex, smartElement, removeOne, hideHighlight, mapIndex, formChangeForMultilevelArray }) => (
  <div className="row-wrap">
    <Form.Group className="mlr-0 plr-0 pt-0 pb-0">
      <Table basic compact className="form-table doc-mapfile-table">
        <Table.Body>
          <Table.Row>
            {/* <Table.Cell collapsing>
              {!isReadOnly && <DragHandle />}
            </Table.Cell> */}
            <Table.Cell>
              {/* {smartElement.Input('key', { displayMode: isReadOnly, multiForm: [metaInfo.form, 'mapping', fieldIndex] })} */}
              {smartElement.Input('key', {
                displayMode: isReadOnly,
                fielddata: currentForm.fields.mapping[fieldIndex].key,
                changed: (e, result) => formChangeForMultilevelArray(e, result, { parentForm: metaInfo.form, childForm: mapIndex }, 'mapping', fieldIndex, true),
              })}
            </Table.Cell>
            <Table.Cell>
              {smartElement.FormSelect('value', {
                displayMode: isReadOnly,
                fielddata: currentForm.fields.mapping[fieldIndex].value,
                changed: (e, result) => formChangeForMultilevelArray(e, result, { parentForm: metaInfo.form, childForm: mapIndex }, 'mapping', fieldIndex, true),
              })}
            </Table.Cell>
            {currentForm.fields.mapping[fieldIndex].value.value === 'CUSTOM' && (
              <Table.Cell>
                {smartElement.Input('customValue', {
                  displayMode: isReadOnly,
                  fielddata: currentForm.fields.mapping[fieldIndex].customValue,
                  changed: (e, result) => formChangeForMultilevelArray(e, result, { parentForm: metaInfo.form, childForm: mapIndex }, 'mapping', fieldIndex, true),
                })}
              </Table.Cell>
            )}
            {/*{DOCUMENT_MAPPING_FRM.fields.mapping[fieldIndex].keyType.value === 'mapped' && (
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
            {!isReadOnly && currentForm.fields.mapping.length > 1 && (
              <Table.Cell collapsing>
                <Button icon circular floated="right" className="link-button">
                  <Icon className="ns-trash" onClick={e => removeOne(metaInfo.form, mapIndex, 'mapping', fieldIndex, e)} />
                </Button>
              </Table.Cell>
            )}
          </Table.Row>
        </Table.Body>
      </Table>
    </Form.Group>
  </div>
));


const SortableList = SortableContainer(({ hideHighlight, offer, currentForm, isReadOnly, smartElement, removeOne, mapIndex, formChangeForMultilevelArray }) => (
  <div className="tbody">
    {currentForm.fields.mapping.map((field, index) => (
      <SortableItem
        // eslint-disable-next-line react/no-array-index-key
        key={`item-${index}`}
        field={field}
        fieldIndex={index}
        index={index}
        isReadOnly={isReadOnly}
        smartElement={smartElement}
        currentForm={currentForm}
        removeOne={removeOne}
        offer={offer}
        hideHighlight={hideHighlight}
        mapIndex={mapIndex}
        formChangeForMultilevelArray={formChangeForMultilevelArray}
      />
    ))}
  </div>
));


const MetaList = ({ hideHighlight, offer, currentForm, isReadOnly, onSortEnd, smartElement, removeOne, mapIndex, formChangeForMultilevelArray }) => (
  <div className="ui card fluid">
    <SortableList
      currentForm={currentForm}
      pressDelay={100}
      onSortEnd={onSortEnd}
      lockAxis="y"
      useDragHandle
      isReadOnly={isReadOnly}
      smartElement={smartElement}
      removeOne={removeOne}
      offer={offer}
      hideHighlight={hideHighlight}
      mapIndex={mapIndex}
      formChangeForMultilevelArray={formChangeForMultilevelArray}
    />
  </div>
);

class DocumentMapping extends Component {
  constructor(props) {
    super(props);
    const { mapIndex, mappingData } = this.props;
    this.props.manageOfferingStore.prepareDocumentMappingForm('DOCUMENT_UPLOAD_MAPPING_FRM', mapIndex);
    this.props.manageOfferingStore.setMappingFormData('DOCUMENT_UPLOAD_MAPPING_FRM', null, mapIndex);
  }

  onSortEnd = ({ oldIndex, newIndex }, isReadonly) => {
    if (!isReadonly) {
      const { metaInfo } = this.props;
      const docs = [...this.props[metaInfo.store][metaInfo.form].fields.documents];
      this.props.offeringCreationStore.setUploadDocsOrder(arrayMove(docs, oldIndex, newIndex), metaInfo.form);
    }
  };
  render() {
    const {
      hideHighlight,
      manageOfferingStore,
      smartElement,
      title,
      mapIndex
    } = this.props;
    const { removeOneForNlevelForm, addMoreForNlevelForm, DOCUMENT_UPLOAD_MAPPING_FRM, formChangeForMultilevelArray } = manageOfferingStore;
    // const isReadonly = false;
    // const formName = metaInfo.form;  
    const docs = [...(this.props[metaInfo.store][metaInfo.form][mapIndex].fields.mapping)];
    const currentForm = DOCUMENT_UPLOAD_MAPPING_FRM[mapIndex]
    return (
      <>
        <Header as="h4">
          {title || 'Mapping Fields'}
          <Button size="small" color="blue" className="ml-10 link-button mt-20" onClick={() => addMoreForNlevelForm(metaInfo.form, mapIndex, 'mapping')}>+ Add another field</Button>
        </Header>
        <MetaList
          smartElement={smartElement}
          isReadOnly={false}
          offer={docs}
          hideHighlight={hideHighlight}
          removeOne={removeOneForNlevelForm}
          currentForm={currentForm}
          onSortEnd={this.onSortEnd}
          mapIndex={mapIndex}
          formChangeForMultilevelArray={formChangeForMultilevelArray}
        />
      </>
    );
  };

}

export default (withRouter(formHOC(observer(DocumentMapping), metaInfo)));
