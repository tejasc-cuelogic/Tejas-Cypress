import React, { Component } from 'react';
import { inject } from 'mobx-react';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
import { InlineLoader } from '../../../../../../theme/shared';
import ModalSection from './ModalSection';

@inject('campaignStore', 'userDetailsStore', 'userStore')
@withRouter
class Disclosure extends Component {
  state = {
    loading: false,
    boxUrl: '',
  };

  componentDidMount() {
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
    const { isDataRoomDocsViewStatus } = this.props.userDetailsStore;
    if (doc.accreditedOnly
      && (!this.props.userStore.currentUser
      || (this.props.userStore.currentUser.roles.includes('issuer') && this.props.userStore.currentUser.sub !== campaignCreatedBy)
      || (this.props.userStore.currentUser && this.props.userStore.currentUser.roles
      && this.props.userStore.currentUser.roles.includes('investor') && !isDataRoomDocsViewStatus))) {
      return (
        <ModalSection doc={doc} currentUser={this.props.userStore.currentUser} />
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
