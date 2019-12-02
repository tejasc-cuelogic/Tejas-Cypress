/* eslint-disable */
import React, { Component } from 'react';
import { get } from 'lodash';
import { withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Header, Button, Modal } from 'semantic-ui-react';
import { IframeModal } from '../../../../../../theme/shared';

@inject('campaignStore', 'userStore', 'accreditationStore', 'userDetailsStore', 'navStore')
@withRouter
@observer
export default class DocumentModal extends Component {
  state = { embedUrl: null, paramsDoc: null, openModal: true };
  componentDidMount() {
    const docNo = this.props.location.hash;
    if (docNo) {
      this.setState({ paramsDoc:  this.props.campaignStore.dataRoomDocs[parseFloat(docNo.substr(1)) - 1]});
    }
    const doc = this.props.doc || this.props.campaignStore.dataRoomDocs[parseFloat(docNo.substr(1)) - 1];
    if (doc && get(doc, 'upload.fileHandle')) {
      const { boxFileId } = get(doc, 'upload.fileHandle');
      const { campaign } = this.props.campaignStore;
      const regulation = get(campaign, 'regulation');
      const offeringRegulationArr = (regulation && regulation.split('_')) || '';
      const regulationType = get(offeringRegulationArr, '[0]');
      const accountType = regulationType === 'BD' ? 'SECURITIES' : 'SERVICES';
      this.getBoxUrl(boxFileId, accountType);
    }
  }
  getBoxUrl = (boxId, accountType) => {
    this.props.campaignStore.setFieldValue('docLoading', true);
    this.props.campaignStore.getBoxLink(boxId, accountType).then((res) => {
      this.setState({
        embedUrl: res,
      });
      this.props.campaignStore.setFieldValue('docLoading', false);
    });
  }
  closeModal = () => {
    this.setState({ openModal: false });
    this.props.history.push(`/offerings/${this.props.match.path.split('/')[2]}`);
  }
  render() {
    const { docLoading } = this.props.campaignStore;
    const { isInvestorAccreditated } = this.props.userDetailsStore;
    const { stepInRoute } = this.props.navStore;
    const doc = this.props.doc || this.state.paramsDoc;
    if (!doc || !get(doc, 'upload.fileHandle')) {
      return (<Modal open={this.state.openModal} closeIcon onClose={this.props.close || this.closeModal}>
        <Modal.Content>
        <section className="no-updates center-align bg-offwhite padded">
          <Header as="h3" className="mb-20 mt-50">
            Document Not Found.
          </Header>
        </section>
        </Modal.Content>
        </Modal>)
    }
    if (doc.accreditedOnly
      && (!this.props.userStore.currentUser
      || (this.props.userStore.currentUser.roles.includes('issuer') && this.props.userStore.currentUser.sub !== campaignCreatedBy)
      || (this.props.userStore.currentUser && this.props.userStore.currentUser.roles
      && this.props.userStore.currentUser.roles.includes('investor') && !isInvestorAccreditated
      && !this.props.accreditationStore.isUserAccreditated))) {
      return (
        <Modal open={this.state.openModal} closeIcon onClose={this.props.close || this.closeModal}>
        <Modal.Content>
        <section className="no-updates center-align bg-offwhite padded">
          <Header as="h3" className="mb-20 mt-50">
            This document is only available to accredited investors.
          </Header>
          {
            !this.props.userStore.currentUser
              ? <p>Please log in to verify accredited investor status to access this Document.</p>
              : <p>Please confirm your accredited investor status to access this Document.</p>
          }
          {
            !this.props.userStore.currentUser
              ? <Button as={Link} to={`/${stepInRoute.to}`} primary content={stepInRoute.title} className="mt-20 mb-50" />
              : <Button as={Link} to="/app/account-settings/investment-limits" primary content="Confirm Status" className="mt-20 mb-50" />
          }
        </section>
        </Modal.Content>
        </Modal>
      );
    }
    return (
      <IframeModal
        srcUrl={this.state.embedUrl}
        loading={docLoading}
        open={this.state.openModal}
        close={this.props.close || this.closeModal}
      />
    );
  }
}
