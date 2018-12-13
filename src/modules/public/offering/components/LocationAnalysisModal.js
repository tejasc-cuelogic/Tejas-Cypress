import React, { Component } from 'react';
import Parser from 'html-react-parser';
import { inject, observer } from 'mobx-react';
import { Header, Modal } from 'semantic-ui-react';
import { InlineLoader } from '../../../../theme/shared';
// import { ASSETS_URL } from '../../../../constants/aws';

// const isMobile = document.documentElement.clientWidth < 768;

@inject('campaignStore')
@observer
class LocationAnalysisModal extends Component {
  handleClose = () => this.props.history.goBack();

  render() {
    const { campaign } = this.props.campaignStore;
    // const emptyStatement = 'Detail not found';
    // const settings = {
    //   dots: false,
    //   infinite: false,
    //   slidesToShow: 1,
    //   slidesToScroll: 1,
    //   arrows: true,
    //   adaptiveHeight: true,
    // };
    // const galleryArray = campaign && campaign.media && campaign.media.location &&
    //   campaign.media.location.length ? campaign.media.location : [];
    return (
      <Modal
        open
        onClose={this.handleClose}
        closeIcon
        size="large"
      >
        <Header as="h3">
          Location Analysis
        </Header>
        <Modal.Content scrolling>
          {
            campaign && campaign.offering
              && campaign.offering.about
              && campaign.offering.about.locationAnalysis ?
                <p>
                  {Parser(campaign.offering.about.locationAnalysis)}
                </p>
                : <InlineLoader text="No data found." />
          }
        </Modal.Content>
      </Modal>
    );
  }
}

export default LocationAnalysisModal;
