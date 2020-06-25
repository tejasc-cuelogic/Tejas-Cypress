import React from 'react';
import { observer } from 'mobx-react';
import { capitalize } from 'lodash';
import { withRouter } from 'react-router-dom';
import { Divider, Header, Form, Button } from 'semantic-ui-react';
import formHOC from '../../../../theme/form/formHOC';

const metaInfo = {
  store: ['articleStore'],
  form: '',
};
function SocialLinks(props) {
  const { smartElement, store, isReadOnly, form, uploadPath, handleFormSubmit, loading } = props;
  metaInfo.form = form;
  const commonProps = field => ({
    fielddata: props[store][form].fields[field],
    changed: (e, result) => props[store].formChange(e, result, form),
  });
  return (
    <>
      <Header as="h4">Social Sharing Previews</Header>
      {
        ['facebook', 'twitter'].map(field => (
          <>
            <Header as="h6">{capitalize(field)}</Header>
            <Form.Group>
              {smartElement.Input(`${field}_shareLink`, { displayMode: isReadOnly, key: field, containerwidth: '10', ...commonProps(`${field}_shareLink`) })}
              {smartElement.DropZone(`${field}_featuredImageUpload`, { S3Upload: true, uploadPath, displayMode: isReadOnly, key: field, uploadtitle: 'Choose a file or drag it here', containerclassname: 'field six wide', ...commonProps(`${field}_featuredImageUpload`) })}
            </Form.Group>
            {smartElement.FormTextarea(`${field}_blurb`, { readOnly: isReadOnly, containerclassname: 'secondary', ...commonProps(`${field}_blurb`) })}
          </>
        ))
      }
      <div className="sticky-actions">
        <Button.Group>
          <Button disabled={loading} loading={loading} primary onClick={handleFormSubmit} color="green" className="relaxed">Save</Button>
        </Button.Group>
      </div>
      <Divider section />
    </>
  );
}

export default (withRouter(formHOC(observer(SocialLinks), metaInfo)));
