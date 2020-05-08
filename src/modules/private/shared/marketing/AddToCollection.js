import React from 'react';
import { inject, observer } from 'mobx-react';
import { intersection } from 'lodash';
import { FormDropDown } from '../../../../theme/form';

@inject('collectionStore', 'nsUiStore')
@observer
export default class AddToCollection extends React.Component {
  getCollectionId = (arr) => {
    const { selectedCollectionArray } = this.props.collectionStore;
    const absentItem = selectedCollectionArray.filter(e => !arr.includes(e));
    const poppedItem = absentItem.pop();
    return poppedItem;
  }

  handleCollectionChange = (e, res) => {
    const { collectionMappingMutation, setFieldValue } = this.props.collectionStore;
    const { referenceId, isOffering, isContentMapping, collectionId } = this.props;
    const { value } = this.props.collectionStore.COLLECTION_MAPPING_FRM.fields.mappingMeta;
    const mutation = res.value.length > value.length ? 'adminCollectionMappingUpsert' : 'adminDeleteCollectionMapping';
    const dropdownItem = mutation === 'adminCollectionMappingUpsert' ? res.value[res.value.length - 1] : this.getCollectionId(res.value);
    const groupIds = isContentMapping ? { collectionId, referenceId: dropdownItem } : { collectionId: dropdownItem, referenceId };
    const params = {
      ...groupIds,
      type: isOffering ? 'OFFERING' : 'INSIGHT',
      order: res.value.length - 1,
      scope: 'PUBLIC',
    };
    collectionMappingMutation(mutation, params, isContentMapping)
      .then(() => {
        if (mutation === 'adminCollectionMappingUpsert') {
          setFieldValue('selectedCollectionArray', res.value);
        }
        setFieldValue('COLLECTION_MAPPING_FRM', res.value, 'fields.mappingMeta.value');
        setFieldValue('collectionIndex', null);
        this.props.history.push(`${this.props.match.url}`);
      })
      .catch(() => {
        setFieldValue('COLLECTION_MAPPING_FRM', value, 'fields.collection.value');
      });
  }

  render() {
    const { collectionMappingList, COLLECTION_MAPPING_FRM } = this.props.collectionStore;
    const { loadingArray } = this.props.nsUiStore;
    return (
      <FormDropDown
        name="collection"
        fielddata={COLLECTION_MAPPING_FRM.fields.mappingMeta}
        options={collectionMappingList}
        disabled={intersection(loadingArray, ['adminCollectionMappingUpsert', 'adminDeleteCollectionMapping']).length > 0 || this.props.isdisabled}
        multiple
        selection
        fluid
        containerclassname="dropdown-field"
        onChange={(e, res) => this.handleCollectionChange(e, res)}
      />
    );
  }
}
