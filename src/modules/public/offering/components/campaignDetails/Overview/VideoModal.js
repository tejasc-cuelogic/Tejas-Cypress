import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import { Embed, Modal } from 'semantic-ui-react';
import { InlineLoader } from '../../../../../../theme/shared';

@inject('campaignStore')
@observer
class VideoModal extends Component {
  handleClose = () => this.props.history.goBack();

  render() {
    const { campaign } = this.props.campaignStore;
    const { isTabletLand } = this.props;
    const isTemplate2 = template => template === 2;
    const videoUrl = !isTemplate2(get(campaign, 'template')) ? (campaign && campaign.media
     && campaign.media.heroVideo && campaign.media.heroVideo.fileName) : (campaign && campaign.header
      && campaign.header.heroVideoURL) || null;
    const vimeoId = (videoUrl && get(videoUrl.split('/'), '[0]')) || null;
    return (
      <Modal open onClose={this.handleClose} size="large" closeIcon className="video-modal">
        <div className={isTabletLand && 'mt-30'}>
          {videoUrl
            ? <Embed autoplay active id={vimeoId} source="vimeo" /> : <InlineLoader text="No video is uploaded." className="bg-offwhite" />
          }
        </div>
      </Modal>
    );
  }
}

export default VideoModal;
