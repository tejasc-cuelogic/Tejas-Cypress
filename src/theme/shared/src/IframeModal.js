import React from 'react';
import { Button, Modal } from 'semantic-ui-react';

class IframeModal extends React.Component {
  render() {
    const { className, text, srcUrl } = this.props;
    return (
      <Modal size="large" closeIcon trigger={<Button className={className} >{text}</Button>} >
        <Modal.Content>
          <div className="pdf-viewer">
            <iframe width="100%" height="100%" title="agreement" src={srcUrl} />
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

export default IframeModal;
