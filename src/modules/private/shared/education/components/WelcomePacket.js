import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { InlineLoader } from '../../../../../theme/shared';

@inject('agreementsStore', 'uiStore')
@observer
export default class WelcomePacket extends Component {
  componentWillMount() {
    const {
      getLegalDocsFileIds, getBoxEmbedLink, legalDocsList,
    } = this.props.agreementsStore;
    if (!legalDocsList.length) {
      getLegalDocsFileIds().then(() => {
        getBoxEmbedLink('welcomeKit');
      });
    }
  }

  onIframeLoad = (e) => {
    if (e.timeStamp > 10000) {
      // this url works
      const { readPdfFile, getLegalDocsFileIds } = this.props.agreementsStore;
      getLegalDocsFileIds().then(() => {
        readPdfFile('welcomeKit').then((url) => {
          this.props.agreementsStore.setField('embedUrl', url);
        });
      });
    }
    return null;
  };

  render() {
    const { embedUrl, docLoading } = this.props.agreementsStore;
    return (
      <div>
        <Grid>
          <Grid.Row>
            <Grid.Column className="welcome-packet">
              <div className="pdf-viewer">
                {(docLoading || !embedUrl) ? <InlineLoader />
                  : <iframe width="100%" height="100%" id="agreement-frame" title="agreement" onLoad={this.onIframeLoad} allowFullScreen="true" src={embedUrl} />}
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
