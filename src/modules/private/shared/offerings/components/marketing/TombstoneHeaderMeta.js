import React from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import { Form, Button, Icon, Header, Table } from 'semantic-ui-react';
import formHOC from '../../../../../../theme/form/formHOC';
import Helper from '../../../../../../helper/utility';

const metaInfo = {
    store: 'manageOfferingStore',
    form: 'TOMBSTONE_HEADER_META_FRM',
  };

function TombstoneHeaderMeta(props) {
  const { smartElement, manageOfferingStore, offeringsStore, title, noAddMore } = props;
  const { offer } = offeringsStore;
  const { TOMBSTONE_HEADER_META_FRM, removeOne, addMore } = manageOfferingStore;
  return (
    <>
      <Header as="h4">
        {title || 'Tombstone Meta'}
        {!noAddMore && TOMBSTONE_HEADER_META_FRM.fields.meta.length < 5
        && <Button size="small" color="blue" className="ml-10 link-button mt-20" onClick={() => addMore('TOMBSTONE_HEADER_META_FRM', 'meta')}>+ Add another section</Button>
        }
      </Header>
      {TOMBSTONE_HEADER_META_FRM.fields.meta.map((field, i) => (
        <Form.Group>
            <Table basic compact className="form-table">
              <Table.Body>
                <Table.Cell collapsing>
                  {smartElement.FormCheckBox('isHighlight', { containerwidth: 2, multiForm: [metaInfo.form, 'meta', i], defaults: true, toggle: true })}
                </Table.Cell>
                <Table.Cell>
                  {smartElement.Input('keyLabel', { multiForm: [metaInfo.form, 'meta', i] })}
                </Table.Cell>
                <Table.Cell>
                  {smartElement.FormSelect('keyType', { multiForm: [metaInfo.form, 'meta', i] })}
                </Table.Cell>
                {TOMBSTONE_HEADER_META_FRM.fields.meta[i].keyType.value === 'custom' && (
                  <Table.Cell>
                    {smartElement.Input('keyValue', { label: 'Custom Value', multiForm: [metaInfo.form, 'meta', i] })}
                  </Table.Cell>
                )}
                {TOMBSTONE_HEADER_META_FRM.fields.meta[i].keyType.value === 'mapped' && (
                  <Table.Cell>
                    {smartElement.FormSelect('keyValue', { label: 'Key List', multiForm: [metaInfo.form, 'meta', i] })}
                  </Table.Cell>
                )}
                {TOMBSTONE_HEADER_META_FRM.fields.meta[i].keyType.value === 'mapped' && (
                  <Table.Cell>
                    {smartElement.Input('keyFormat', { multiForm: [metaInfo.form, 'meta', i] })}
                  </Table.Cell>
                )}
                {TOMBSTONE_HEADER_META_FRM.fields.meta[i].keyType.value === 'mapped' && (
                  <Table.Cell>
                    {<div className="field">{TOMBSTONE_HEADER_META_FRM.fields.meta[i].keyLabel.value ? TOMBSTONE_HEADER_META_FRM.fields.meta[i].keyLabel.value : 'N/A'}:  {get(offer, TOMBSTONE_HEADER_META_FRM.fields.meta[i].keyValue.value) ? Helper.formatValue(TOMBSTONE_HEADER_META_FRM.fields.meta[i].keyFormat.value, Helper.enumToText(TOMBSTONE_HEADER_META_FRM.fields.meta[i].keyValue.value, get(offer, TOMBSTONE_HEADER_META_FRM.fields.meta[i].keyValue.value))) : 'N/A'}</div>}
                  </Table.Cell>
                )}
                {TOMBSTONE_HEADER_META_FRM.fields.meta.length > 1 && (
                  <Table.Cell collapsing>
                    <Button icon circular floated="right" className="link-button">
                      <Icon className="ns-trash" onClick={e => removeOne(metaInfo.form, 'meta', i, e)} />
                    </Button>
                  </Table.Cell>
                )}
              </Table.Body>
            </Table>
        </Form.Group>
      ))}
    </>
  );
}

export default inject('offeringsStore')(withRouter(formHOC(observer(TombstoneHeaderMeta), metaInfo)));
