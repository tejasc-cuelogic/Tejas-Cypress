import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { InlineLoader } from '../../../../../theme/shared';

@inject('agreementsStore')
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
  render() {
    const { embedUrl, docLoading } = this.props.agreementsStore;
    return (
      <div>
        <Grid>
          <Grid.Row>
            <Grid.Column className="welcome-packet">
              <div className="pdf-viewer">
                {(docLoading || !embedUrl) ? <InlineLoader /> :
                <iframe width="100%" height="100%" title="agreement" src={embedUrl} />}
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
