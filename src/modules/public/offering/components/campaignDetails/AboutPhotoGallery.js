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
  handleClose = () => this.props.history.goBack();
  handlePagination = newIndex => this.setState({ activeSlide: newIndex });
  render() {
    const { campaign } = this.props.campaignStore;
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
    const galleryLength = galleryArray.length < 8 ? galleryArray.length : 8;
    const tabGalleryLength = galleryArray < 4 ? galleryArray.length : 4;
    return (
      <Modal
        open
        onClose={this.handleClose}
        size="fullscreen"
        closeIcon
        className="about-modal"
      >
        <Modal.Content image>
          <div className="carousel-counter">{this.state.activeSlide + 1}/{galleryArray.length}</div>
          <div className="carousel">
            <Container fluid>
              <NsCarousel
                {...settings}
                thumbs={isTablet ? tabGalleryLength : galleryLength}
                imageCount={galleryArray.length}
                isTablet={isTablet}
                refItems={galleryArray}
                handlePaginationFun={this.handlePagination}
              >
                {
                  galleryArray.length ?
                    galleryArray.map(data => (
                      <Image64 bg srcUrl={data.url} />
                    ))
                    :
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
