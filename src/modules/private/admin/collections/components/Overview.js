/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer } from 'mobx-react';
import { Form, Header } from 'semantic-ui-react';
import formHOC from '../../../../../theme/form/formHOC';

const metaInfo = {
  store: 'collectionStore',
  form: 'COLLECTION_OVERVIEW_FRM',
};
function Overview(props) {
  const { smartElement } = props;
  const { COLLECTION_OVERVIEW_FRM } = props.collectionStore;
  return (
    <div className="inner-content-spacer">
      <Form>
        <Header as="h4">Offering Details</Header>
        <Form.Group widths={3}>
          {Object.keys(COLLECTION_OVERVIEW_FRM.fields).map(field => smartElement.Input(field))}
        </Form.Group>
      </Form>
    </div>
  );
}

export default formHOC(observer(Overview), metaInfo);
