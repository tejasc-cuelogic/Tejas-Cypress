import React, { Component } from 'react';
import { inject } from 'mobx-react';
import { get } from 'lodash';
import { withRouter, Link } from 'react-router-dom';
import { Button, Header } from 'semantic-ui-react';
import { InlineLoader } from '../../../../../../theme/shared';

@inject('campaignStore', 'accreditationStore', 'userDetailsStore', 'userStore', 'navStore')
@withRouter
class Disclosure extends Component {
  state = {
    loading: false,
    boxUrl: '',
  };

  componentWillMount() {
    if (this.props.fileId) {
      const { campaign } = this.props.campaignStore;
      const regulation = get(campaign, 'regulation');
      const offeringRegulationArr = (regulation && regulation.split('_')) || '';
      const regulationType = get(offeringRegulationArr, '[0]');
      const accountType = regulationType === 'BD' ? 'SECURITIES' : 'SERVICES';
      this.setState({ loading: true });
      this.props.campaignStore.getBoxLink(this.props.fileId, accountType).then((res) => {
        this.setState({ boxUrl: res, loading: false });
      });
    }
  }
  render() {
    const { doc, campaignCreatedBy } = this.props;
    if (!doc || this.state.loading) {
      return <InlineLoader />;
    }
    const { isInvestorAccreditated } = this.props.userDetailsStore;
    const { stepInRoute } = this.props.navStore;
    if (doc.accreditedOnly
      && (!this.props.userStore.currentUser
      || (this.props.userStore.currentUser.roles.includes('issuer') && this.props.userStore.currentUser.sub !== campaignCreatedBy)
      || (this.props.userStore.currentUser && this.props.userStore.currentUser.roles &&
      this.props.userStore.currentUser.roles.includes('investor') && !isInvestorAccreditated &&
      !this.props.accreditationStore.isUserAccreditated))) {
      return (
        <section className="no-updates center-align bg-offwhite padded">
          <Header as="h3" className="mb-20 mt-50">
            This investment is only available to accredited investors.
          </Header>
          <p>Please confirm your accredited investor status to access the Data Room.</p>
          {
            !this.props.userStore.currentUser ?
              <Button as={Link} to={`/auth/${stepInRoute.to}`} primary content={stepInRoute.title} className="mt-20 mb-50" /> :
              <Button as={Link} to="/app/account-settings/investment-limits" primary content="Confirm Status" className="mt-20 mb-50" />
          }
        </section>
      );
    }
    return (
      <div className="pdf-viewer">
        <iframe
          width="100%"
          height="100%"
          title="agreement"
          allowFullScreen="true"
          src={doc.BoxUrl || this.state.boxUrl}
          ref={(c) => { this.iframeComponent = c; }}
        />
      </div>
    );
  }
}

export default Disclosure;
