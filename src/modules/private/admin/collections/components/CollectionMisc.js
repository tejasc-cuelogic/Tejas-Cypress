import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { capitalize } from 'lodash';
import { Form, Header } from 'semantic-ui-react';
import OfferingButtonGroup from '../../../shared/offerings/components/OfferingButtonGroup';
import formHOC from '../../../../../theme/form/formHOC';

const metaInfo = {
  store: 'collectionStore',
  form: 'COLLECTION_MISC_FRM',
};

@inject('manageOfferingStore', 'offeringCreationStore')
@withRouter
@observer
class Misc extends Component {
  removeMedia = (form, name) => {
    window.logger(form, name);
  }

  handleFormSubmit = () => {
    const params = {
      keyName: 'social',
      forms: ['COLLECTION_MISC_FRM'],
    };
    this.props.collectionStore.upsertCollection(params);
  }

  render() {
    const { smartElement, collectionStore } = this.props;
    const { COLLECTION_MISC_FRM, collectionId } = collectionStore;
    const isReadOnly = false;
    return (
      <div className="inner-content-spacer">
        <Form>
          <Header as="h4">Social Sharing Previews
            <Header.Subheader>
              Share links that go on the user’s social media to share the offering
            </Header.Subheader>
          </Header>
          {
            ['facebook', 'twitter'].map(field => (
              <>
                <Header as="h6">{capitalize(field)}</Header>
                <Form.Group>
                  {smartElement.Input(`${field}_shareLink`, { displayMode: isReadOnly, key: field, containerwidth: '10' })}
                  {smartElement.DropZone(`${field}_featuredImageUpload`, { S3Upload: true, uploadPath: `collection/${collectionId}`, displayMode: isReadOnly, key: field, uploadtitle: 'Choose a file or drag it here', containerclassname: 'field six wide' })}
                </Form.Group>
                {smartElement.FormTextarea(`${field}_blurb`, { readOnly: isReadOnly, containerclassname: 'secondary' })}
              </>
            ))
          }
          <OfferingButtonGroup
            isDisable={!(COLLECTION_MISC_FRM.meta.isValid)}
            updateOffer={this.handleFormSubmit}
          />
        </Form>
      </div>
    );
  }
}

export default formHOC(Misc, metaInfo);
