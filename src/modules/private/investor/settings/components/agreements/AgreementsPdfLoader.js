import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import { Grid } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { InlineLoader } from '../../../../../../theme/shared';
import IframeModal from '../../../../../../theme/shared/src/IframeModal';
@inject('agreementsStore')
@observer
export default class AgreementsPdfLoader extends Component {
  constructor(props) {
    super(props);
    const {
      getLegalDocsFileIds, alreadySet,
      getNavItems, getBoxEmbedLink,
    } = this.props.agreementsStore;
    const { agreementKey } = this.props.match.params;
    const doc = agreementKey ? getNavItems.find(ele => ele.to.toString() === agreementKey)
      : getNavItems[0];
    if (!alreadySet) {
      getLegalDocsFileIds().then(() => {
        getBoxEmbedLink(doc.to, doc.id);
      });
    } else {
      getBoxEmbedLink(doc.to, doc.id);
    }
  }

  closeModal = () => {
    this.props.history.push(this.props.refLink);
  }

  render() {
    const { embedUrl, docLoading } = this.props.agreementsStore;
    return (
      this.props.iframeModal ? (
        <IframeModal
          open
          close={this.closeModal}
          srcUrl={embedUrl}
          loading={docLoading}
        />
      ) : (
          <div>
            <Grid>
              <Grid.Row>
                <Grid.Column className="welcome-packet">
                  <div className="pdf-viewer">
                    {(docLoading || !embedUrl) ? <InlineLoader />
                      : (
                        <iframe
                          width="100%"
                          height="100%"
                          title="agreement"
                          src={embedUrl}
                          ref={(c) => { this.iframeComponent = c; }}
                        />
                      )
                    }
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
      )
    );
  }
}
