import React from 'react';
import { Modal, Button, Divider } from 'semantic-ui-react';

export default class DocSign extends React.Component {
  handleCloseModal = () => {
    this.props.history.push('overview');
  }
  submit = () => {
    this.props.history.push('congratulation');
  }
  render() {
    return (
      <Modal size="large" open closeIcon closeOnRootNodeClick={false} onClose={() => this.handleCloseModal()}>
        <Modal.Content className="signup-content center-align">
          <div className="pdf-viewer">
            <object width="100%" height="100%" data="https://s3.amazonaws.com/dev-cdn.nextseed.qa/investor-statements-mock/offeringpageignited.pdf" type="application/pdf">failed to load..</object>
          </div>
          <Divider hidden />
          <Button primary onClick={this.submit} >Submit</Button>
        </Modal.Content>
      </Modal>
    );
  }
}
