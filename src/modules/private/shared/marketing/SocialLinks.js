import React from 'react';
import { capitalize } from 'lodash';
import { Divider, Header, Form, Button } from 'semantic-ui-react';

function SocialLinks(props) {
  const { smartElement, store, isReadOnly, form, uploadPath, handleFormSubmit, loading } = props;
  const commonProps = field => ({
    fielddata: props[store][form].fields[field],
    changed: (e, result) => props[store].formChange(e, result, form),
  });
  return (
    <>
      <Header as="h4">Social Sharing Previews
        <Header.Subheader>
          Share links that go on the user’s social media to share the offering
        </Header.Subheader>
      </Header>      {
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
      {handleFormSubmit
        && (
          <div className="sticky-actions">
            <Button.Group>
              <Button disabled={loading} loading={loading} primary onClick={handleFormSubmit} color="green" className="relaxed">Save</Button>
            </Button.Group>
          </div>
        )
      }
      <Divider section />
    </>
  );
}

export default SocialLinks;
