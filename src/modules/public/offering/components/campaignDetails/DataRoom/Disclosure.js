import React, { Component } from 'react';
import { inject } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { Button, Header } from 'semantic-ui-react';
import { InlineLoader } from '../../../../../../theme/shared';

@inject('campaignStore', 'accreditationStore', 'userDetailsStore', 'userStore', 'navStore')
@withRouter
class Disclosure extends Component {
  render() {
    const { doc } = this.props;
    if (!doc) {
      return <InlineLoader />;
    }
    const { isInvestorAccreditated } = this.props.userDetailsStore;
    const { stepInRoute } = this.props.navStore;
    if (doc.accreditedOnly
      && (!this.props.userStore.currentUser
      || (this.props.userStore.currentUser && this.props.userStore.currentUser.roles &&
      this.props.userStore.currentUser.roles.includes('investor') && !isInvestorAccreditated &&
      !this.props.accreditationStore.isUserAccreditated))) {
      return (
        <div className="updates-modal">
          <div className="no-updates">
            <Header as="h3" className="mb-20">
              This document is only available to accredited investors.
            </Header>
            <p>Please confirm your accredited investor status to view this document.</p>
            {
              !this.props.userStore.currentUser ?
                <Button as={Link} to={`/auth/${stepInRoute.to}`} primary content={stepInRoute.title} className="mt-20" /> :
                <Button as={Link} to="/app/profile-settings/investment-limits" primary content="Confirm Status" className="mt-20" />
            }
          </div>
        </div>
      );
    }
    return (
      <div className="pdf-viewer">
        <iframe
          width="100%"
          height="100%"
          title="agreement"
          src={doc.BoxUrl}
          ref={(c) => { this.iframeComponent = c; }}
        />
      </div>
    );
  }
}

export default Disclosure;
