/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer, inject } from 'mobx-react';
import { Form, Header, Button, Divider } from 'semantic-ui-react';
import formHOC from '../../../../../theme/form/formHOC';
import { InlineLoader } from '../../../../../theme/shared';

const metaInfo = {
  store: 'collectionStore',
  form: 'COLLECTION_OVERVIEW_FRM',
};
function Overview(props) {
  const handleSubmit = async () => {
    const params = {
      forms: [metaInfo.form],
    };
    const { upsertCollection } = props.collectionStore;
    await upsertCollection('adminCollectionUpsert', params);
  };

  const { smartElement } = props;
  const { loadingArray } = props.nsUiStore;
  const isLoading = loadingArray.includes('adminCollectionUpsert');
  const { COLLECTION_OVERVIEW_FRM } = props.collectionStore;
  if (isLoading) {
    return <InlineLoader />;
  }
  return (
    <div className="inner-content-spacer">
      <Form>
        <Header as="h4">Collection Details</Header>
        <Form.Group widths={3}>
          {Object.keys(COLLECTION_OVERVIEW_FRM.fields).map(field => smartElement.Input(field))}
          <Divider hidden />
          <div className="sticky-actions">
            <Button.Group className="time-stamp" />
            <Button primary className="relaxed" content="Save" onClick={() => handleSubmit()} disabled={!COLLECTION_OVERVIEW_FRM.meta.isValid || isLoading} loading={isLoading} />
          </div>
        </Form.Group>
      </Form>
    </div>
  );
}

export default inject('nsUiStore', 'collectionStore')(formHOC(observer(Overview), metaInfo));
