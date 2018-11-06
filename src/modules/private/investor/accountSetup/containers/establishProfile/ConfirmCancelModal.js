import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

@inject('uiStore', 'offeringsStore', 'offeringCreationStore')
@observer
export default class ConfirmCancelModal extends React.Component {
    handleCloseModal = () => {
      this.props.history.push('/app/summary/establish-profile');
    }
    render() {
      return (
        <Modal size="small" open >
          <Modal.Content>
            <p className="center-align mb-50">
                In order to make new investments on the platform, you will need to complete
                your Investor Profile.
            </p>
            <p className="center-align mb-50">
            Visit your Investor Dashboard to complete your profile.
            </p>
            <div className="center-align mt-30">
              <Button primary size="large" onClick={this.handleCloseModal} className="very relaxed" content="Go Back" />
            </div>
            <div className="center-align mt-30">
              <p><Link to="/app/summary">Finish later</Link></p>
            </div>
          </Modal.Content>
        </Modal>
      );
    }
}

