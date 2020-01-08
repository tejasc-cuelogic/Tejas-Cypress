import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import { Grid } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { InlineLoader } from '../../../../../../theme/shared';
@inject('agreementsStore', 'userDetailsStore')
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
    this.setInlineLoader(false);
    if (!alreadySet) {
      getLegalDocsFileIds().then(() => {
        getBoxEmbedLink(doc.to, doc.id).then(() => {
          this.setInlineLoader(true);
        });
      });
    } else if (!this.props.isNewTab) {
      getBoxEmbedLink(doc.to, doc.id).then(() => {
        this.setInlineLoader(true);
      });
    }
  }

  setInlineLoader = (val) => {
    if (this.props.isNewTab) {
      this.props.userDetailsStore.setFieldValue('userFirstLoad', val);
    }
  }

  closeModal = () => {
    this.props.history.push(this.props.refLink);
  }

  render() {
    const { embedUrl, docLoading } = this.props.agreementsStore;
    return (
      this.props.isNewTab ? (
        <>
          {(docLoading || !embedUrl) ? <InlineLoader styledAs={{ marginTop: '100px' }} />
            : (
              window.open(embedUrl, '_self')
            )
          }
        </>
      ) : (
          <div>
            <Grid>
              <Grid.Row>
                <Grid.Column className="welcome-packet">
                  <div className="pdf-viewer">
                    {(docLoading || !embedUrl) ? <InlineLoader styledAs={{ marginTop: '100px' }} />
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
