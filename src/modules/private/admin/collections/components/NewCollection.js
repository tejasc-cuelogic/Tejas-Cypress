import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Form, Button } from 'semantic-ui-react';
import formHOC from '../../../../../theme/form/formHOC';
import { InlineLoader } from '../../../../../theme/shared';

const metaInfo = {
  store: 'collectionStore',
  form: 'COLLECTION_FRM',
};

function NewCollection(props) {
  useEffect(() => {
    const { resetForm, setFieldValue } = props.collectionStore;
    resetForm('COLLECTION_FRM');
    setFieldValue('contentId', null);
  }, []);

  const handleCloseModal = () => {
    props.history.push(props.refLink);
  };

  const handleSubmit = async () => {
    const params = {
      forms: [metaInfo.form],
    };
    const { upsertCollection } = props.collectionStore;
    await upsertCollection(params);
    handleCloseModal();
  };

  const { COLLECTION_FRM } = props.collectionStore;
  const { smartElement } = props;
  const { loadingArray } = props.nsUiStore;

  if (loadingArray.includes('adminCollectionUpsert')) {
    return <InlineLoader />;
  }
  return (
    <Modal open closeIcon onClose={handleCloseModal} size="mini" closeOnDimmerClick={false}>
      <Modal.Header className="center-align signup-header">
        <Header as="h3">Create New Collection</Header>
      </Modal.Header>
      <Modal.Content className="signup-content">
        <Form onSubmit={handleSubmit}>
          {
            ['name', 'slug'].map(field => (
              smartElement.Input(field)
            ))
          }
            <div className="center-align">
            <Button primary content="Create Collection" disabled={!COLLECTION_FRM.meta.isValid} />
          </div>
        </Form>
      </Modal.Content>
    </Modal>
  );
}
export default inject('collectionStore', 'nsUiStore')(formHOC(observer(NewCollection), metaInfo));
