import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { InlineLoader } from '../../../../../theme/shared';

@inject('agreementsStore', 'uiStore')
@observer
export default class WelcomePacket extends Component {
  constructor(props) {
    super(props);
    const {
      getLegalDocsFileIds, getBoxEmbedLink, legalDocsList, readPdfFile,
    } = this.props.agreementsStore;
    if (!legalDocsList.length) {
      getLegalDocsFileIds().then(() => {
        getBoxEmbedLink('welcomeKit').then(() => {
          if (sessionStorage.getItem('isBoxFirewalled') === 'true') {
            getLegalDocsFileIds().then(() => {
              readPdfFile('welcomeKit').then((url) => {
                this.props.agreementsStore.setField('S3DownloadLink', url);
              });
            });
          }
        });
      });
    }
  }

  render() {
    const { embedUrl, docLoading, S3DownloadLink } = this.props.agreementsStore;
    return (
      <div>
        <Grid>
          <Grid.Row>
            <Grid.Column className="welcome-packet">
              <div className="pdf-viewer">
                {(docLoading || !embedUrl) ? <InlineLoader />
                  : <iframe width="100%" height="100%" id="agreement-frame" title="agreement" allowFullScreen="true" src={S3DownloadLink || embedUrl} />}
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
