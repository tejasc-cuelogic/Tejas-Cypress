import React from 'react';
import { Modal } from 'semantic-ui-react';
import { InlineLoader } from '../index';

class IframeModal extends React.Component {
  render() {
    const {
      srcUrl, open, close, loading,
    } = this.props;
    return (
      <Modal open={open} size="large" closeIcon onClose={close} >
        <Modal.Content>
          <div className="pdf-viewer">
            {(loading || !srcUrl) ? <InlineLoader /> :
            <iframe width="100%" height="100%" title="agreement" src={srcUrl} />
            }
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

export default IframeModal;
