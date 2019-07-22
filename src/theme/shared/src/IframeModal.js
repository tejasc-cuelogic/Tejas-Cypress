import React from 'react';
import { Modal } from 'semantic-ui-react';
import { InlineLoader } from '../index';

class IframeModal extends React.Component {
  render() {
    const {
      srcUrl, open, close, loading, trigger, isPdf,
    } = this.props;
    if (isPdf) {
      return (
<Modal open={open} size="large" closeIcon trigger={trigger} onClose={close}>
      <Modal.Content>
        <div className="pdf-viewer">
          {(loading || !srcUrl) ? <InlineLoader />
            : <embed width="100%" height="100%" title="agreement" src={srcUrl} />
          }
        </div>
      </Modal.Content>
    </Modal>
      );
    }
    return (
      <Modal open={open} size="large" closeIcon trigger={trigger} onClose={close}>
        <Modal.Content>
          <div className="pdf-viewer">
            {(loading || !srcUrl) ? <InlineLoader />
              : <iframe width="100%" height="100%" title="agreement" src={srcUrl} />
            }
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

export default IframeModal;
