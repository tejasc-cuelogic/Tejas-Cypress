import React from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import { arrayMove, SortableContainer, SortableElement, sortableHandle } from 'react-sortable-hoc';
import { Form, Button, Icon, Header, Table } from 'semantic-ui-react';
import formHOC from '../../../../../../theme/form/formHOC';
import Helper from '../../../../../../helper/utility';

const metaInfo = {
  store: 'manageOfferingStore',
  form: 'TOMBSTONE_HEADER_META_FRM',
};

const DragHandle = sortableHandle(() => <Icon className="ml-10 ns-drag-holder-large mr-10" />);
const SortableItem = SortableElement(({ offer, TOMBSTONE_HEADER_META_FRM, isReadOnly, fieldIndex, smartElement, removeOne, hideHighlight }) => (
  <div className="row-wrap">
    <Form.Group className="mlr-0 plr-0 pt-0 pb-0">
      <Table basic compact className="form-table">
        <Table.Body>
          <Table.Row>
            <Table.Cell collapsing>
              {!isReadOnly && <DragHandle />}
            </Table.Cell>
            {!hideHighlight
            && (
            <Table.Cell collapsing>
              {smartElement.FormCheckBox('isHighlight', { customClass: 'custom-toggle', displayMode: isReadOnly, multiForm: [metaInfo.form, 'meta', fieldIndex], toggle: true, defaults: true })}
            </Table.Cell>
            )}
            <Table.Cell>
              {smartElement.Input('keyLabel', { displayMode: isReadOnly, multiForm: [metaInfo.form, 'meta', fieldIndex] })}
            </Table.Cell>
            <Table.Cell>
              {smartElement.FormSelect('keyType', { displayMode: isReadOnly, multiForm: [metaInfo.form, 'meta', fieldIndex] })}
            </Table.Cell>
            {TOMBSTONE_HEADER_META_FRM.fields.meta[fieldIndex].keyType.value === 'custom' && (
              <Table.Cell>
                {smartElement.Input('keyValue', { label: 'Custom Value', displayMode: isReadOnly, multiForm: [metaInfo.form, 'meta', fieldIndex] })}
              </Table.Cell>
            )}
            {TOMBSTONE_HEADER_META_FRM.fields.meta[fieldIndex].keyType.value === 'mapped' && (
              <Table.Cell>
                {smartElement.FormSelect('keyValue', { label: 'Key List', displayMode: isReadOnly, multiForm: [metaInfo.form, 'meta', fieldIndex] })}
              </Table.Cell>
            )}
            {TOMBSTONE_HEADER_META_FRM.fields.meta[fieldIndex].keyType.value === 'mapped' && (
              <Table.Cell>
                {smartElement.Input('keyFormat', { displayMode: isReadOnly, multiForm: [metaInfo.form, 'meta', fieldIndex] })}
              </Table.Cell>
            )}
            {TOMBSTONE_HEADER_META_FRM.fields.meta[fieldIndex].keyType.value === 'mapped' && (
              <Table.Cell>
                {<div className="field">{TOMBSTONE_HEADER_META_FRM.fields.meta[fieldIndex].keyLabel.value ? TOMBSTONE_HEADER_META_FRM.fields.meta[fieldIndex].keyLabel.value : 'N/A'}:  {get(offer, TOMBSTONE_HEADER_META_FRM.fields.meta[fieldIndex].keyValue.value) ? Helper.formatValue(TOMBSTONE_HEADER_META_FRM.fields.meta[fieldIndex].keyFormat.value, Helper.enumToText(TOMBSTONE_HEADER_META_FRM.fields.meta[fieldIndex].keyValue.value, get(offer, TOMBSTONE_HEADER_META_FRM.fields.meta[fieldIndex].keyValue.value), true)) : 'N/A'}</div>}
              </Table.Cell>
            )}
            {!isReadOnly && TOMBSTONE_HEADER_META_FRM.fields.meta.length > 1 && (
              <Table.Cell collapsing>
                <Button icon circular floated="right" className="link-button">
                  <Icon className="ns-trash" onClick={e => removeOne(metaInfo.form, 'meta', fieldIndex, e)} />
                </Button>
              </Table.Cell>
            )}
          </Table.Row>
        </Table.Body>
      </Table>
    </Form.Group>
  </div>
));
const SortableList = SortableContainer(({ hideHighlight, offer, TOMBSTONE_HEADER_META_FRM, isReadOnly, smartElement, removeOne }) => (
  <div className="tbody">
    {TOMBSTONE_HEADER_META_FRM.fields.meta.map((field, index) => (
      <SortableItem
        // eslint-disable-next-line react/no-array-index-key
        key={`item-${index}`}
        field={field}
        fieldIndex={index}
        index={index}
        isReadOnly={isReadOnly}
        smartElement={smartElement}
        TOMBSTONE_HEADER_META_FRM={TOMBSTONE_HEADER_META_FRM}
        removeOne={removeOne}
        offer={offer}
        hideHighlight={hideHighlight}
      />
    ))}
  </div>
));

const MetaList = ({ hideHighlight, offer, TOMBSTONE_HEADER_META_FRM, isReadOnly, onSortEnd, smartElement, removeOne }) => (
  <div className="ui card fluid">
    <SortableList
      TOMBSTONE_HEADER_META_FRM={TOMBSTONE_HEADER_META_FRM}
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

function TombstoneHeaderMeta(props) {
  const { smartElement, manageOfferingStore, offeringsStore, title, noAddMore, hideHighlight } = props;
  const { offer } = offeringsStore;
  const { TOMBSTONE_HEADER_META_FRM, removeOne, addMore, campaignStatus } = manageOfferingStore;
  const isReadOnly = campaignStatus.lock;

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const meta = [...props.manageOfferingStore.TOMBSTONE_HEADER_META_FRM.fields.meta];
    props.manageOfferingStore.reOrderHandle(arrayMove(meta, oldIndex, newIndex), 'TOMBSTONE_HEADER_META_FRM', 'meta');
    props.manageOfferingStore.setFieldValue('onDragSaveEnable', true);
  };
  return (
    <>
      <Header as="h4">
        {title || 'Tombstone Meta'}
        {(!isReadOnly && !noAddMore && TOMBSTONE_HEADER_META_FRM.fields.meta.length < 5)
        && <Button size="small" color="blue" className="ml-10 link-button mt-20" onClick={() => addMore('TOMBSTONE_HEADER_META_FRM', 'meta')}>+ Add another section</Button>
        }
      </Header>
      <MetaList
        smartElement={smartElement}
        isReadOnly={isReadOnly}
        offer={offer}
        hideHighlight={hideHighlight}
        removeOne={removeOne}
        TOMBSTONE_HEADER_META_FRM={TOMBSTONE_HEADER_META_FRM}
        onSortEnd={onSortEnd}
      />
      {/* {TOMBSTONE_HEADER_META_FRM.fields.meta.map((field, i) => (
        <Form.Group>
          <Table basic compact className="form-table">
            <Table.Body>
              {!hideHighlight
              && (
              <Table.Cell collapsing>
                {smartElement.FormCheckBox('isHighlight', { customClass: 'customToggle', displayMode: isReadOnly, multiForm: [metaInfo.form, 'meta', i], toggle: true, defaults: true })}
              </Table.Cell>
              )}
              <Table.Cell>
                {smartElement.Input('keyLabel', { displayMode: isReadOnly, multiForm: [metaInfo.form, 'meta', i] })}
              </Table.Cell>
              <Table.Cell>
                {smartElement.FormSelect('keyType', { displayMode: isReadOnly, multiForm: [metaInfo.form, 'meta', i] })}
              </Table.Cell>
              {TOMBSTONE_HEADER_META_FRM.fields.meta[i].keyType.value === 'custom' && (
                <Table.Cell>
                  {smartElement.Input('keyValue', { label: 'Custom Value', displayMode: isReadOnly, multiForm: [metaInfo.form, 'meta', i] })}
                </Table.Cell>
              )}
              {TOMBSTONE_HEADER_META_FRM.fields.meta[i].keyType.value === 'mapped' && (
                <Table.Cell>
                  {smartElement.FormSelect('keyValue', { label: 'Key List', displayMode: isReadOnly, multiForm: [metaInfo.form, 'meta', i] })}
                </Table.Cell>
              )}
              {TOMBSTONE_HEADER_META_FRM.fields.meta[i].keyType.value === 'mapped' && (
                <Table.Cell>
                  {smartElement.Input('keyFormat', { displayMode: isReadOnly, multiForm: [metaInfo.form, 'meta', i] })}
                </Table.Cell>
              )}
              {TOMBSTONE_HEADER_META_FRM.fields.meta[i].keyType.value === 'mapped' && (
                <Table.Cell>
                  {<div className="field">{TOMBSTONE_HEADER_META_FRM.fields.meta[i].keyLabel.value ? TOMBSTONE_HEADER_META_FRM.fields.meta[i].keyLabel.value : 'N/A'}:  {get(offer, TOMBSTONE_HEADER_META_FRM.fields.meta[i].keyValue.value) ? Helper.formatValue(TOMBSTONE_HEADER_META_FRM.fields.meta[i].keyFormat.value, Helper.enumToText(TOMBSTONE_HEADER_META_FRM.fields.meta[i].keyValue.value, get(offer, TOMBSTONE_HEADER_META_FRM.fields.meta[i].keyValue.value), true)) : 'N/A'}</div>}
                </Table.Cell>
              )}
              {!isReadOnly && TOMBSTONE_HEADER_META_FRM.fields.meta.length > 1 && (
                <Table.Cell collapsing>
                  <Button icon circular floated="right" className="link-button">
                    <Icon className="ns-trash" onClick={e => removeOne(metaInfo.form, 'meta', i, e)} />
                  </Button>
                </Table.Cell>
              )}
            </Table.Body>
          </Table>
        </Form.Group>
      ))} */}
    </>
  );
}

export default inject('offeringsStore')(withRouter(formHOC(observer(TombstoneHeaderMeta), metaInfo)));
