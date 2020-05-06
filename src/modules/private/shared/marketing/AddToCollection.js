import React from 'react';
import { inject, observer } from 'mobx-react';
import { FormDropDown } from '../../../../theme/form';
import { InlineLoader } from '../../../../theme/shared';

@inject('collectionStore', 'nsUiStore')
@observer
export default class AddToCollection extends React.Component {
  handleCollectionChange = (e, res) => {
    const { adminCollectionMappingUpsert, setCollectionMapping } = this.props.collectionStore;
    const { referenceId, isOffering } = this.props;
    const collectionId = res.value[res.value.length - 1];
    const params = {
      collectionId,
      referenceId,
      type: isOffering ? 'OFFERING' : 'INSIGHT',
      scope: 'PUBLIC',
    };
    const { value } = this.props.collectionStore.COLLECTION_MAPPING_FRM.fields.collections;
    if (value.length > res.value.length) {
      adminCollectionMappingUpsert(params)
      .then(() => {
        setCollectionMapping(collectionId);
      })
      .catch(() => {
        setCollectionMapping();
      });
    }
  }

  render() {
    const { collections, COLLECTION_MAPPING_FRM } = this.props.collectionStore;
    const { loadingArray } = this.props.nsUiStore;
    if (loadingArray.includes('getCollections')) {
      return <InlineLoader />;
    }
    return (
      <FormDropDown
        name="collection"
        fielddata={COLLECTION_MAPPING_FRM.fields.collection}
        options={collections.map(c => ({ key: c.name, text: c.name, value: c.id }))}
        multiple
        selection
        fluid
        containerclassname="dropdown-field"
        onChange={(e, res) => this.handleCollectionChange(e, res)}
      />
    );
  }
}
