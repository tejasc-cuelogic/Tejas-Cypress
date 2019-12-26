import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Form, Header, Divider, Grid } from 'semantic-ui-react';
import ButtonGroupType2 from '../ButtonGroupType2';
import formHOC from '../../../../../../theme/form/formHOC';

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
    const { TOMBSTONE_BASIC_FRM } = manageOfferingStore;
    const isReadonly = false;
    console.log(TOMBSTONE_BASIC_FRM.fields.tombstoneImage.preSignedUrl);
    return (
      <div className="inner-content-spacer">
        <Form>
          <Header as="h4">General</Header>
            <Grid columns={2} stackable>
              <Grid.Column>
                <Header as="h5">{TOMBSTONE_BASIC_FRM.fields.tombstoneImage.label}</Header>
                {smartElement.ImageCropper('tombstoneImage', { disabled: isReadonly, uploadMedia: this.uploadMedia })}
              </Grid.Column>
            </Grid>
          <Divider hidden />
          <Header as="h5">{TOMBSTONE_BASIC_FRM.fields.tombstoneDescription.label}</Header>
          {smartElement.FormTextarea('tombstoneDescription', { readOnly: isReadonly, containerclassname: 'secondary', hidelabel: true })}
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

export default formHOC(observer(Tombstone), metaInfo);
