import React, { Component } from 'react';
import { Embed, Modal } from 'semantic-ui-react';
import { InlineLoader } from '../../../../theme/shared';

class VideoModal extends Component {
  handleClose = () => this.props.history.goBack();
  render() {
    const { videoDetails, isTabletLand } = this.props;
    const videoUrl = videoDetails && videoDetails.embed ? videoDetails.embed : null;
    return (
      <Modal open onClose={this.handleClose} size="large" closeIcon className="video-modal">
        <div className={isTabletLand && 'mt-30'}>
          {videoUrl ?
            <Embed active id={videoUrl} source="vimeo" /> : <InlineLoader text="No video is uploaded." />
          }
        </div>
      </Modal>
    );
  }
}

export default VideoModal;
