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
      <div className="bg-offwhite pt-30 pb-30">
        <section className="pt-30 pb-30">
          {get(collection, 'bgImage.value')
            && <Image64 bg reRender originalImg className="collection-bg-image ui-container" srcUrl={get(collection, 'bgImage.preSignedUrl')} />
          }
          <Container>
            <Grid style={{ backgroundColor: get(collection, 'bgColor.value') }} className="p-64 collection-box">
              <Grid.Column widescreen={4} computer={4} tablet={16} mobile={16}>
                {/* {get(collection, 'text.value')}
                {get(collection, 'color.value')} */}
                <Image64 reRender srcUrl={get(collection, 'image.preSignedUrl')} />
              </Grid.Column>
              <Grid.Column widescreen={11} computer={11} tablet={16} mobile={16}>
                <Header as="h3">{get(collection, 'title.value')}</Header>
                <HtmlEditor readOnly content={get(collection, 'description.value')} />
                <Button inverted color="white" className="mt-30 mb-30">Explore</Button>
              </Grid.Column>
            </Grid>
          </Container>
        </section>
      </div>
    );
  }
}
