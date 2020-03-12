import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { get, isEmpty } from 'lodash';
import { Embed, Modal } from 'semantic-ui-react';
import { InlineLoader } from '../../../../../../theme/shared';

@inject('campaignStore')
@observer
class VideoModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      videoUrl: null,
      vimeoId: null,
    };
  }

  componentDidMount() {
    const { campaign } = this.props.campaignStore;
    if (isEmpty(campaign)) {
      this.getOfferingMedia();
    } else {
      const videoUrl = (campaign && campaign.media && campaign.media.heroVideo && campaign.media.heroVideo.fileName) || null;
      const vimeoId = (videoUrl && get(videoUrl.split('/'), '[0]')) || null;
      this.setState({ loading: false, videoUrl, vimeoId });
    }
  }

  handleClose = () => this.props.history.goBack();

  getOfferingMedia = async () => {
    const { getOfferingMediaMeta } = this.props.campaignStore;
    const res = await getOfferingMediaMeta(this.props.match.params.id);
    const videoUrl = (res && res.heroVideo && res.heroVideo.fileName) || null;
    const vimeoId = (videoUrl && get(videoUrl.split('/'), '[0]')) || null;
    this.setState({ loading: false, videoUrl, vimeoId });
    return res;
  }

  render() {
    const isTabletLand = (this.props.isTabletLand || (document.documentElement.clientWidth >= 992 && document.documentElement.clientWidth < 1200));
    return (
      <Modal open onClose={this.handleClose} size="large" closeIcon={!this.state.loading} className="video-modal">
        <div className={isTabletLand && 'mt-30'}>
          {this.state.videoUrl
              ? <Embed autoplay active id={this.state.vimeoId} source="vimeo" /> : !this.state.loading && <InlineLoader text="No video is uploaded." className="bg-offwhite" />
          }
        </div>
      </Modal>
    );
  }
}

export default VideoModal;
