import React from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Form } from 'semantic-ui-react';
import formHOC from '../../../../../../theme/form/formHOC';

const metaInfo = {
    store: 'manageOfferingStore',
    form: 'TOMBSTONE_META_FRM',
    arrayName: 'tombstoneMeta',
  };

function TombstoneMeta(props) {
//   useEffect(() => {
//     props.factoryStore.resetForm('FILEFACTORY_FRM');
//     props.factoryStore.setFieldValue('inProgress', false, 'fileFactory');
//     props.factoryStore.setFieldValue('DYNAMCI_PAYLOAD_FRM', {}, 'FILEFACTORY');
//   }, []);
  const { smartElement, manageOfferingStore } = props;
  const { TOMBSTONE_META_FRM } = manageOfferingStore;
  return (
    <>
      {TOMBSTONE_META_FRM.fields[metaInfo.arrayName].map((field, i) => (
        <Form.Group widths={5}>
        {smartElement.Input('rowKey', { multiForm: [metaInfo.form, metaInfo.arrayName, i] })}
        {smartElement.FormSelect('rowType', { multiForm: [metaInfo.form, metaInfo.arrayName, i], containerwidth: 4 })}
        {TOMBSTONE_META_FRM.fields.tombstoneMeta[i].rowType.value === 'custom' && smartElement.Input('custom', { multiForm: [metaInfo.form, metaInfo.arrayName, i] })}
        {TOMBSTONE_META_FRM.fields.tombstoneMeta[i].rowType.value === 'mapped' && smartElement.FormSelect('mapped', { multiForm: [metaInfo.form, metaInfo.arrayName, i], containerwidth: 4 })}
        {TOMBSTONE_META_FRM.fields.tombstoneMeta[i].rowType.value === 'mapped' && smartElement.FormCheckBox('readOnly', { multiForm: [metaInfo.form, metaInfo.arrayName, i], defaults: true, toggle: true })}
        {smartElement.FormCheckBox('isVisible', { multiForm: [metaInfo.form, metaInfo.arrayName, i], defaults: true, toggle: true })}
        </Form.Group>
      ))}
    </>
  );
}

export default (withRouter(formHOC(observer(TombstoneMeta), metaInfo)));
