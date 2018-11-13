import React, { Component } from 'react';
import { Modal, Grid, Button, Confirm } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { DataFormatter } from '../../../../../helper';
import { InlineLoader } from '../../../../../theme/shared';

@inject('businessAppReviewStore', 'uiStore')
@withRouter
@observer
export default class OfferSigning extends Component {
  state = {
    showConfirmModal: false,
  }
  getPortalAgreementStatus = (funType = '') => {
    const { match, businessAppReviewStore } = this.props;
    businessAppReviewStore.getPortalAgreementStatus().then((data) => {
      if (data.getPortalAgreementStatus === 'completed') {
        this.props.history.push(`/app/dashboard/${match.params.applicationId}/gettingStarted`);
      } else if (funType === 'Button') {
        this.setState({ showConfirmModal: true });
      } else {
        this.props.history.push('/app/dashboard');
      }
    }).finally(() => this.props.uiStore.setProgress(false));
  }
  hideConfirm = () => {
    this.setState({ showConfirmModal: false });
  }
  doItLater = () => {
    this.setState({ showConfirmModal: false });
    this.props.history.push('/app/dashboard');
  }
  module = name => DataFormatter.upperCamelCase(name);
  render() {
    const { signPortalAgreementURL } = this.props.businessAppReviewStore;
    return (
      <Modal open closeIcon onClose={this.getPortalAgreementStatus} size="large" closeOnDimmerClick={false}>
        <Modal.Content>
          <Grid>
            <Grid.Row>
              <Grid.Column className="welcome-packet">
                <div className="pdf-viewer">
                  {this.props.uiStore.inProgress ? <InlineLoader /> :
                  <iframe id="docuSignIframe" onLoad={this.iframeLoading} width="100%" height="100%" title="pdf" src={signPortalAgreementURL} />
                  }
                </div>
                <div className="mt-20 center-align">
                  <Button primary loading={this.props.uiStore.inProgress} className="relaxed" content="Finish" onClick={() => this.getPortalAgreementStatus('Button')} />
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
        <Confirm
          header="Confirm"
          content="Your document is still unsigned, do you want continue reading document or do it later?"
          open={this.state.showConfirmModal}
          onCancel={this.hideConfirm}
          onConfirm={this.doItLater}
          cancelButton="Continue"
          confirmButton="Do it later"
          size="mini"
          className="deletion"
        />
      </Modal>
    );
  }
}
