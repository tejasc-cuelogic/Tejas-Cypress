import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import { Modal, Container } from 'semantic-ui-react';
import { NsCarousel, Image64 } from '../../../../../theme/shared';
import NSImage from '../../../../shared/NSImage';

const isTablet = document.documentElement.clientWidth < 1024;
@inject('campaignStore')
@observer
class AboutPhotoGallery extends Component {
  state = {
    activeSlide: 0,
  };

  handleClose = () => {
    this.props.campaignStore.setFieldValue('gallarySelectedImageIndex', null);
    this.props.history.goBack();
  }

  handlePagination = (newIndex) => {
    if (this.props.campaignStore.gallarySelectedImageIndex !== null) {
      this.props.campaignStore.setFieldValue('gallarySelectedImageIndex', null);
    }
    this.setState({ activeSlide: newIndex });
  }

  render() {
    const { campaignStatus, gallarySelectedImageIndex } = this.props.campaignStore;
    const settings = {
      dots: false,
      infinite: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      adaptiveHeight: true,
    };
    const isTemplate2 = campaignStatus.campaignTemplate === 2;
    const galleryArray = campaignStatus.galleryImages || [];
    return (
      <Modal
        open
        onClose={this.handleClose}
        size="fullscreen"
        closeIcon
        className="about-modal"
      >
        <Modal.Content>
          <div className="carousel">
            <Container fluid>
              <NsCarousel
                {...settings}
                initialSlide={gallarySelectedImageIndex || 0}
                imageCount={galleryArray.length}
                isTablet={isTablet}
                refItems={galleryArray}
                handlePaginationFun={this.handlePagination}
                fade={!isTablet}
              >
                {galleryArray.length ? galleryArray.map(data => (
                  <div className="about-carousel">
                    <div className="carousel-counter">{gallarySelectedImageIndex !== null ? (gallarySelectedImageIndex + 1) : (this.state.activeSlide + 1)}/{galleryArray.length}</div>
                    <Image64 srcUrl={isTemplate2 ? get(data, 'image.url') : data.url} />
                  </div>
                ))
                  : <NSImage path="gallery-placeholder-16-9.jpg" />
                }
              </NsCarousel>
            </Container>
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

export default AboutPhotoGallery;
