import React from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import { Form, Button, Icon, Header } from 'semantic-ui-react';
import formHOC from '../../../../../../theme/form/formHOC';

const metaInfo = {
    store: 'manageOfferingStore',
    form: 'TOMBSTONE_META_FRM',
  };

function TombstoneMeta(props) {
  const { smartElement, manageOfferingStore, offeringsStore } = props;
  const { offer } = offeringsStore;
  const { TOMBSTONE_META_FRM, removeOne, addMore } = manageOfferingStore;
  return (
    <>
      <Header as="h4">
        Tombstone Meta
        {TOMBSTONE_META_FRM.fields.meta.length < 5
        && <Button size="small" color="blue" className="ml-10 link-button mt-20" onClick={() => addMore('TOMBSTONE_META_FRM', 'meta')}>+ Add another section</Button>
        }
      </Header>
      {TOMBSTONE_META_FRM.fields.meta.map((field, i) => (
        <Form.Group widths={TOMBSTONE_META_FRM.fields.meta[i].keyType.value === '' ? 3 : TOMBSTONE_META_FRM.fields.meta[i].keyType.value === 'custom' ? 4 : 6}>
        {smartElement.Input('keyLabel', { multiForm: [metaInfo.form, 'meta', i] })}
        {smartElement.FormSelect('keyType', { multiForm: [metaInfo.form, 'meta', i], containerwidth: TOMBSTONE_META_FRM.fields.meta[i].keyType.value === 'mapped' ? 3 : 4 })}
        {TOMBSTONE_META_FRM.fields.meta[i].keyType.value === 'custom' && smartElement.Input('keyValue', { label: 'Custom Value', multiForm: [metaInfo.form, 'meta', i] })}
        {TOMBSTONE_META_FRM.fields.meta[i].keyType.value === 'mapped' && smartElement.FormSelect('keyValue', { label: 'Key List', multiForm: [metaInfo.form, 'meta', i], containerwidth: TOMBSTONE_META_FRM.fields.meta[i].keyType.value === 'mapped' ? 3 : 4 })}
        {TOMBSTONE_META_FRM.fields.meta[i].keyType.value === 'mapped' && smartElement.Input('keyFormat', { multiForm: [metaInfo.form, 'meta', i] })}
        {TOMBSTONE_META_FRM.fields.meta[i].keyType.value === 'mapped' && <div className="field">{TOMBSTONE_META_FRM.fields.meta[i].keyLabel.value}  :  {get(offer, `keyTerms.${TOMBSTONE_META_FRM.fields.meta[i].keyValue.value}`) || 'N/A'}</div>}
        <div className="field">
        <Button disabled={TOMBSTONE_META_FRM.fields.meta.length === 1} icon circular floated="right" className="link-button">
          <Icon className="ns-trash" onClick={e => removeOne(metaInfo.form, 'meta', i, e)} />
        </Button>
        </div>
        </Form.Group>
      ))}
      <Header as="h4">
        Tombstone Toggle Meta
        {TOMBSTONE_META_FRM.fields.toggleMeta.length < 5
        && <Button size="small" color="blue" className="ml-10 link-button mt-20" onClick={() => addMore('TOMBSTONE_META_FRM', 'toggleMeta')}>+ Add another section</Button>
        }
      </Header>
      {TOMBSTONE_META_FRM.fields.toggleMeta.map((field, i) => (
        <Form.Group widths={3}>
        {smartElement.Input('label', { multiForm: [metaInfo.form, 'toggleMeta', i] })}
        {smartElement.FormCheckBox('isVisible', { multiForm: [metaInfo.form, 'toggleMeta', i], defaults: true, toggle: true })}
        <div className="field">
        <Button disabled={TOMBSTONE_META_FRM.fields.toggleMeta.length === 1} icon circular floated="right" className="link-button">
          <Icon className="ns-trash" onClick={e => removeOne(metaInfo.form, 'toggleMeta', i, e)} />
        </Button>
        </div>
        </Form.Group>
      ))}
    </>
  );
}

export default inject('offeringsStore')(withRouter(formHOC(observer(TombstoneMeta), metaInfo)));
