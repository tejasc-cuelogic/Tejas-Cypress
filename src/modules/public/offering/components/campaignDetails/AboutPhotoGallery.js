import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Image, Container } from 'semantic-ui-react';
import { NsCarousel, Image64 } from '../../../../../theme/shared';
import { ASSETS_URL } from '../../../../../constants/aws';

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
    const { campaign, gallarySelectedImageIndex } = this.props.campaignStore;
    const settings = {
      dots: false,
      infinite: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      adaptiveHeight: true,
    };
    const galleryArray = campaign && campaign.media && campaign.media.gallery &&
      campaign.media.gallery.length ? campaign.media.gallery : [];
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
                    <Image64 srcUrl={data.url} />
                  </div>
                  )) :
                <Image src={`${ASSETS_URL}images/gallery-placeholder-16-9.jpg`} />
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
