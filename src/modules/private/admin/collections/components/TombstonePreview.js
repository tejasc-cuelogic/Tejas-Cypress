import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import { Grid, Header, Container, Button } from 'semantic-ui-react';
import { Image64 } from '../../../../../theme/shared';
import HtmlEditor from '../../../../shared/HtmlEditor';

@inject('collectionStore')
@withRouter
@observer
export default class TombstonePreview extends Component {
  render() {
    const { collectionStore } = this.props;
    const { TOMBSTONE_FRM } = collectionStore;
    const collection = TOMBSTONE_FRM.fields;
    return (
      <div className="bg-offwhite pt-30 pb-30 mb-20">
        <Container className="offerings-container">
          <Grid style={{ backgroundColor: get(collection, 'bgColor.value') }} className="p-60 collection-box">
            <Grid.Column widescreen={5} computer={5} tablet={16} mobile={16} className="zi-9 collection-thumbnail-img">
              <Image64 reRender originalImg srcUrl={get(collection, 'image.preSignedUrl')} />
                {get(collection, 'text.value')
                && (
              <div style={{ backgroundColor: get(collection, 'color.value') }} className="ns_flgs_box">
                <p style={{ color: get(collection, 'textColor.value') }}>{get(collection, 'text.value')}</p>
              </div>
              )}
            </Grid.Column>
            <Grid.Column widescreen={12} computer={12} tablet={16} mobile={16} className="zi-9">
              <Header as="h3">{get(collection, 'title.value')}</Header>
              <p style={{ color: get(collection, 'descriptionColor.value') }}><HtmlEditor readOnly content={get(collection, 'description.value')} /></p>
              <Button inverted color="white" className="mt-20 mb-30">Explore</Button>
            </Grid.Column>
            {get(collection, 'bgImage.preSignedUrl')
              && <Image64 bg reRender originalImg className="collection-bg-image" srcUrl={get(collection, 'bgImage.preSignedUrl')} />
            }
          </Grid>
        </Container>
      </div>
    );
  }
}
