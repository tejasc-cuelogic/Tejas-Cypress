import React, { Component } from 'react';
import { Modal, Grid } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { DataFormatter } from '../../../../../helper';

@inject('businessAppReviewStore')
@withRouter
@observer
export default class OfferSigning extends Component {
  handleCloseModal = () => {
    const { match, businessAppReviewStore } = this.props;
    businessAppReviewStore.getPortalAgreementStatus().then((data) => {
      if (data.getPortalAgreementStatus === 'completed') {
        this.props.history.push(`/app/dashboard/${match.params.applicationId}/offers/gettingStarted`);
      }
    });
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
                  <iframe width="100%" height="100%" title="pdf" src={signPortalAgreementURL} />
                  {/* <object width="100%" height="100%" data="https://s3.amazonaws.com/dev-cdn.nextseed.qa/welcome-packet/offeringpageignited.pdf" type="application/pdf">failed to load..</object> */}
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}
