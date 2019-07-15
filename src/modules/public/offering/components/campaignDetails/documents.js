/* eslint-disable */
import React, { Component } from 'react';
import { get, isEmpty } from 'lodash';
import { withRouter, Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Header, Grid, Segment, Button, Divider, Modal } from 'semantic-ui-react';
import { IframeModal } from '../../../../../theme/shared';


@inject('campaignStore', 'userStore', 'accreditationStore', 'userDetailsStore', 'navStore')
@withRouter
@observer
class LegalDoc extends Component {
  state = { embedUrl: null };
  componentWillMount() {
    const { boxFileId } = get(this.props.doc, 'upload.fileHandle');
    const { campaign } = this.props.campaignStore;
    const regulation = get(campaign, 'regulation');
    const offeringRegulationArr = (regulation && regulation.split('_')) || '';
    const regulationType = get(offeringRegulationArr, '[0]');
    const accountType = regulationType === 'BD' ? 'SECURITIES' : 'SERVICES';
    this.getBoxUrl(boxFileId, accountType);
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
  render() {
    const { docLoading } = this.props.campaignStore;
    const { isInvestorAccreditated } = this.props.userDetailsStore;
    const { stepInRoute } = this.props.navStore;
    const { doc } = this.props;
    if (doc.accreditedOnly
      && (!this.props.userStore.currentUser
      || (this.props.userStore.currentUser.roles.includes('issuer') && this.props.userStore.currentUser.sub !== campaignCreatedBy)
      || (this.props.userStore.currentUser && this.props.userStore.currentUser.roles
      && this.props.userStore.currentUser.roles.includes('investor') && !isInvestorAccreditated
      && !this.props.accreditationStore.isUserAccreditated))) {
      return (
        <Modal open closeIcon onClose={this.props.close}>
        <Modal.Content>
        <section className="no-updates center-align bg-offwhite padded">
          <Header as="h3" className="mb-20 mt-50">
            This investment is only available to accredited investors.
          </Header>
          <p>Please confirm your accredited investor status to access this Document.</p>
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
        open
        close={this.props.close}
      />
    );
  }
}
@inject('campaignStore', 'uiStore', 'accreditationStore', 'authStore')
@withRouter
@observer
export default class Documents extends Component {
  state = {
    doc: null,
  }
  componentWillMount() {
    if (this.props.authStore.isUserLoggedIn
      && isEmpty(this.props.accreditationStore.userData)) {
      this.props.accreditationStore.getUserAccreditation();
    }
  }
  openDocument = (doc) => {
    this.setState({ doc });
  }

  close = () => this.setState({ doc: null });

  render() {
    const { dataRoomDocs } = this.props.campaignStore;
    return (
      <>
        <Header as="h3" className="mt-20 mb-30 anchor-wrap">
            Documents
            <span className="anchor" />
            </Header>
        <Divider hidden />
        <Grid columns={3} stackable doubling>
          {
            dataRoomDocs.length && dataRoomDocs.map(l => (
              <Grid.Column>
                <Segment padded textAlign="center" className="legal-documents">
                  <p>{l.name}</p>
                  <Button
                    onClick={() => this.openDocument(l)}
                    className="relaxed"
                    primary
                    compact
                  >
                    View
                  </Button>
                </Segment>
              </Grid.Column>
            ))
          }
        </Grid>
        {this.state.doc
        &&
        <LegalDoc doc={this.state.doc} close={this.close} />
        }
      </>
    );
  }
}
