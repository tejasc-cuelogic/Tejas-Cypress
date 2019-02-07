import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Embed, Modal } from 'semantic-ui-react';
import { InlineLoader } from '../../../../../../theme/shared';

@inject('campaignStore')
@observer
class VideoModal extends Component {
  handleClose = () => this.props.history.goBack();
  render() {
    const { campaign } = this.props.campaignStore;
    const { isTabletLand } = this.props;
    const videoUrl = (campaign && campaign.media &&
     campaign.media.heroVideo && campaign.media.heroVideo.url) || null;
    return (
      <Modal open onClose={this.handleClose} size="large" closeIcon className="video-modal">
        <div className={isTabletLand && 'mt-30'}>
          {videoUrl ?
            <Embed active id={videoUrl} source="vimeo" /> : <InlineLoader text="No video is uploaded." className="bg-offwhite" />
          }
        </div>
      </Modal>
    );
  }
}

export default VideoModal;
