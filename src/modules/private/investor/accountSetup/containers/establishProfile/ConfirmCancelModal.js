import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

@inject('uiStore', 'offeringsStore', 'offeringCreationStore')
@observer
export default class ConfirmCancelModal extends React.Component {
    handleCloseModal = () => {
      this.props.history.push(this.props.refLink);
    }
    render() {
      return (
        <Modal size="small" open closeIcon onClose={this.handleCloseModal}>
          <p className="center-align mb-50">
            In order to make new investments on the platform, you will need to complete
            your Investor Profile.
          </p>
          <p>
          Visit your Investor Dashboard to complete your profile.
          </p>
          <div className="center-align mt-30">
            <Button as={Link} to="/" primary size="large" className="very relaxed" content="Go Back" />
          </div>
          <div className="signup-actions">
            <p><Link to="/app/summary">I’ll do it later</Link></p>
          </div>
        </Modal>
      );
    }
}

