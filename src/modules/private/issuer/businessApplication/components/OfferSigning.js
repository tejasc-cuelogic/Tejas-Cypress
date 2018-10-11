import React, { Component } from 'react';
import { Modal, Grid } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { DataFormatter } from '../../../../../helper';
import { InlineLoader } from '../../../../../theme/shared';

@inject('businessAppReviewStore', 'uiStore')
@withRouter
@observer
export default class OfferSigning extends Component {
  handleCloseModal = () => {
    const { match, businessAppReviewStore } = this.props;
    businessAppReviewStore.getPortalAgreementStatus().then((data) => {
      if (data.getPortalAgreementStatus === 'completed') {
        this.props.history.push(`/app/dashboard/${match.params.applicationId}/offers/gettingStarted`);
      } else {
        this.props.history.push('/app/dashboard');
      }
    }).finally(() => this.props.uiStore.setProgress(false));
  }
  module = name => DataFormatter.upperCamelCase(name);
  render() {
    const { signPortalAgreementURL } = this.props.businessAppReviewStore;
    return (
      <Modal open closeIcon onClose={this.handleCloseModal} size="large" closeOnDimmerClick={false}>
        <Modal.Content>
          <Grid>
            <Grid.Row>
              <Grid.Column className="welcome-packet">
                <div className="pdf-viewer">
                  {this.props.uiStore.inProgress ? <InlineLoader /> :
                  <iframe onLoad={this.iframeLoading} width="100%" height="100%" title="pdf" src={signPortalAgreementURL} />
                  }
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}
