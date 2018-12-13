import React, { Component } from 'react';
import { Grid, Segment, Embed, Modal } from 'semantic-ui-react';
import { InlineLoader } from '../../../../theme/shared';

class VideoModal extends Component {
  handleClose = () => this.props.history.goBack();
  render() {
    const { videoDetails, isTabletLand } = this.props;
    const videoUrl = videoDetails && videoDetails.embed ? videoDetails.embed : null;
    return (
      <Modal open onClose={this.handleClose} size="large" closeIcon >
        <Grid.Column widescreen={9} largeScreen={8} computer={16} tablet={16} className={isTabletLand && 'mt-30'}>
          <Segment padded>
            {videoUrl ?
              <Embed
                active
                id={videoUrl}
                source="vimeo"
              /> : <InlineLoader text="No video is uploaded." />
            }
          </Segment>
        </Grid.Column>
      </Modal>
    );
  }
}

export default VideoModal;
