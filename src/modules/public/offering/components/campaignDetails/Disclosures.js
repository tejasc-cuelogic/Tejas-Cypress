import React, { Component } from 'react';
import { Header, Modal } from 'semantic-ui-react';

class Disclosures extends Component {
  render() {
    return (
      <Modal
        open
        onClose={this.props.history.goBack}
        closeIcon
        size="large"
      >
        <Header as="h3">
        Disclosures
        </Header>
        <Modal.Content>
          <div className="pdf-viewer">
            <object width="100%" height="100%" data="https://s3.amazonaws.com/dev-cdn.nextseed.qa/welcome-packet/offeringpageignited.pdf" type="application/pdf">failed to load..</object>
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

export default Disclosures;
