import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

const isMobile = document.documentElement.clientWidth < 768;

@inject('investorProfileStore')
@observer
@withRouter
export default class ConfirmCancelModal extends React.Component {
    handleCloseModal = () => {
      this.props.history.push('/app/setup/establish-profile');
    }

    handleFinishLater = () => {
      this.props.investorProfileStore.setFinishInvestorProfileLater(true);
    }

    render() {
      return (
        <Modal size="mini" open className="finish-later">
          <Modal.Content>
            <p className={`${isMobile ? '' : 'center-align'} mt-30 mb-30`}>
              In order to participate in new investments, you will need to complete
              your investor profile.
            </p>
            <p className={`${isMobile ? '' : 'center-align'} mb-30`}>Visit your Investor Dashboard anytime to complete your profile.</p>
            <div className="center-align mt-30">
              <Button fluid={isMobile} primary size="large" onClick={this.handleCloseModal} className="very relaxed" content="Go Back" />
            </div>
            <div className={`${isMobile ? 'mb-30' : ''} center-align mt-14`}>
              <p><Link to="/app/setup" onClick={this.handleFinishLater}>Finish later</Link></p>
            </div>
          </Modal.Content>
        </Modal>
      );
    }
}
