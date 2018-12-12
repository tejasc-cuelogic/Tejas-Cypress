import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import Aux from 'react-aux';
import { InlineLoader } from '../../../../../../theme/shared';

@inject('campaignStore')
@withRouter
@observer
class Disclosure extends Component {
  componentWillMount() {
    const { getNavItemsForDataRoom, getBoxEmbedLink } = this.props.campaignStore;
    const { docKey } = this.props.match.params;
    const doc = docKey && docKey !== 'disclosure' ? getNavItemsForDataRoom.find(ele => ele.to === parseInt(docKey, 10)) :
      getNavItemsForDataRoom[0];
    getBoxEmbedLink(doc.to, doc.url);
  }
  render() {
    const { embedUrl, docLoading } = this.props.campaignStore;
    return (
      <Aux>
        <div className="pdf-viewer mt-30">
          <div className="pdf-viewer">
            {(docLoading || !embedUrl) ? <InlineLoader /> :
            <iframe
              width="100%"
              height="100%"
              title="agreement"
              src={embedUrl}
              ref={(c) => { this.iframeComponent = c; }}
            />
            }
          </div>
        </div>
      </Aux>
    );
  }
}

export default Disclosure;
