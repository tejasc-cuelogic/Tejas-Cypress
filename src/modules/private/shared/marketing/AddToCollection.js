import React from 'react';
import { inject, observer } from 'mobx-react';
import { FormDropDown } from '../../../../theme/form';
import { InlineLoader } from '../../../../theme/shared';

@inject('collectionStore', 'nsUiStore')
@observer
export default class AddToCollection extends React.Component {
  handleCollectionChange = (e, res) => {
    const { collectionMappingMutation, setFieldValue } = this.props.collectionStore;
    const { referenceId, isOffering, isContentMapping, collectionId } = this.props;

    const { value } = this.props.collectionStore.COLLECTION_MAPPING_FRM.fields.mappingMeta;
    const mutation = res.value.length > value.length ? 'adminCollectionMappingUpsert' : 'adminDeleteCollectionMapping';
    const dropdownItem = mutation === 'adminCollectionMappingUpsert' ? res.value[res.value.length - 1] : value[value.length - 1];
    console.log('dropdownItem', dropdownItem);
    const groupIds = isContentMapping ? { collectionId, referenceId: dropdownItem } : { collectionId: dropdownItem, referenceId };
    const params = {
      ...groupIds,
      type: isOffering ? 'OFFERING' : 'INSIGHT',
      scope: 'PUBLIC',
    };
    console.log('params', params);
    collectionMappingMutation(mutation, params)
      .then(() => {
        setFieldValue('COLLECTION_MAPPING_FRM', res.value, 'fields.mappingMeta.value');
      })
      .catch(() => {
        setFieldValue('mappingMeta_MAPPING_FRM', value, 'fields.collection.value');
      });
  }

  render() {
    const { collectionMappingList, COLLECTION_MAPPING_FRM } = this.props.collectionStore;
    const { loadingArray } = this.props.nsUiStore;
    if (loadingArray.includes('getCollections')) {
      return <InlineLoader />;
    }
    return (
      <FormDropDown
        name="collection"
        fielddata={COLLECTION_MAPPING_FRM.fields.mappingMeta}
        options={collectionMappingList}
        multiple
        selection
        fluid
        containerclassname="dropdown-field"
        onChange={(e, res) => this.handleCollectionChange(e, res)}
      />
    );
  }
}
