import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Form } from 'semantic-ui-react';
import OfferingButtonGroup from '../../../shared/offerings/components/OfferingButtonGroup';
import formHOC from '../../../../../theme/form/formHOC';
import SocialLinks from '../../../shared/marketing/SocialLinks';

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
    const { collectionStore } = this.props;
    const { COLLECTION_MISC_FRM, collectionId, isLocked } = collectionStore;
    return (
      <div className="inner-content-spacer">
        <Form>
          <SocialLinks {...this.props} isReadOnly={isLocked} store={metaInfo.store} form={metaInfo.form} uploadPath={`collections/${collectionId}`} />
          <OfferingButtonGroup
            isDisable={!(COLLECTION_MISC_FRM.meta.isValid) || isLocked}
            updateOffer={this.handleFormSubmit}
          />
        </Form>
      </div>
    );
  }
}

export default formHOC(Misc, metaInfo);
