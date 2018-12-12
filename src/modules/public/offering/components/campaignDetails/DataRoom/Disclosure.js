import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import Aux from 'react-aux';
import { Button } from 'semantic-ui-react';
import { InlineLoader } from '../../../../../../theme/shared';

@inject('campaignStore', 'accreditationStore', 'userStore')
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
    if (!this.props.userStore.currentUser ||
      (this.props.userStore.currentUser && this.props.userStore.currentUser.roles &&
      this.props.userStore.currentUser.roles.includes('investor') &&
      !this.props.accreditationStore.isUserAccreditated)) {
      return (
        <div className="pdf-viewer disclosure-pdf">
          <p>
            This document is only available to accredited investors.
          </p>
          <span>Please confirm your accredited investor status to view this document.</span>
          <Button as={Link} to="/app/profile-settings/investment-limits" primary content="Confirm Status" />
        </div>
      );
    }
    return (
      <Aux>
        <div className="pdf-viewer disclosure-pdf">
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
      </Aux>
    );
  }
}

export default Disclosure;
