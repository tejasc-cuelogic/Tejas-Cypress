import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { InlineLoader } from '../../../../../theme/shared';

@inject('agreementsStore', 'uiStore')
@observer
export default class WelcomePacket extends Component {
  componentWillMount() {
    const {
      getLegalDocsFileIds, getBoxEmbedLink, legalDocsList, readPdfFile,
    } = this.props.agreementsStore;
    if (!legalDocsList.length) {
      getLegalDocsFileIds().then(() => {
        getBoxEmbedLink('welcomeKit').then((res) => {
          this.IsallowdUrl(res).catch(() => {
            getLegalDocsFileIds().then(() => {
              readPdfFile('welcomeKit').then((url) => {
                this.props.agreementsStore.setField('S3DownloadLink', url);
              });
            });
          });
        });
      });
    }
  }

  IsallowdUrl = () => new Promise((resolve, reject) => {
    const testURL = this.props.agreementsStore.embedUrl;

    const myInit = {
      method: 'HEAD',
      mode: 'no-cors',
    };
    const myRequest = new Request(testURL, myInit);
    fetch(myRequest).catch((e) => {
      console.log('failed', e);
      reject();
    });
  });


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
