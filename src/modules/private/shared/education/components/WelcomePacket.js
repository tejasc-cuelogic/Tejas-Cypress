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
      // readPdfFile('welcomeKit').then((url) => {
      //   this.props.agreementsStore.setField('embedUrl', url);
      // });
      getLegalDocsFileIds().then(() => {
        getBoxEmbedLink('welcomeKit');
      });
    }
  }

  onIframeLoad = (e) => {
    if (!e.nativeEvent.loading) {
      try {
        // this url works
        const iframe = document.getElementById('agreement-frame');
        console.log('iframeError', iframe.contentWindow.document);
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (!iframeDoc) {
          this.props.agreementsStore.setField('embedUrl', 'http://1952-ira-acccount-is-displaying-error.s3-website-us-east-1.amazonaws.com/');
        }
      } catch (ex) {
        console.log('onIframeLoad::exception:: ', ex);
      }
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
