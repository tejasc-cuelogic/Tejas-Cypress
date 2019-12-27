import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Form, Header, Divider, Button } from 'semantic-ui-react';
import ButtonGroupType2 from '../ButtonGroupType2';
import formHOC from '../../../../../../theme/form/formHOC';
import TombstoneMeta from './TombstoneMeta';

const metaInfo = {
  store: 'manageOfferingStore',
  form: 'TOMBSTONE_BASIC_FRM',
};

@inject('manageOfferingStore')
@withRouter
@observer
class Tombstone extends Component {
  uploadMedia = (name) => {
    this.props.manageOfferingStore.uploadMedia(name);
  }

  render() {
    const { manageOfferingStore, smartElement } = this.props;
    const { TOMBSTONE_BASIC_FRM, TOMBSTONE_META_FRM, addMore } = manageOfferingStore;
    const isReadonly = false;
    return (
      <div className="inner-content-spacer">
        <Form>
          <Header as="h4">{TOMBSTONE_BASIC_FRM.fields.tombstoneImage.label}</Header>
          {smartElement.ImageCropper('tombstoneImage', { disabled: isReadonly, uploadMedia: this.uploadMedia })}
          <Divider hidden />
          <Header as="h4">{TOMBSTONE_BASIC_FRM.fields.tombstoneDescription.label}</Header>
          {smartElement.FormTextarea('tombstoneDescription', { readOnly: isReadonly, containerclassname: 'secondary', hidelabel: true })}
          <Header as="h4">
            Tombstone Meta
            {TOMBSTONE_META_FRM.fields.tombstoneMeta.length < 10
            && <Button size="small" color="blue" className="ml-10 link-button mt-20" onClick={() => addMore('TOMBSTONE_META_FRM', 'tombstoneMeta')}>+ Add another section</Button>
            }
          </Header>
          <TombstoneMeta />
          <Divider section />
          <ButtonGroupType2
            submitted={false}
            isManager={false}
            approved={false}
            updateOffer={this.handleFormSubmit}
          />
        </Form>
      </div>
    );
  }
}

export default formHOC(Tombstone, metaInfo);
