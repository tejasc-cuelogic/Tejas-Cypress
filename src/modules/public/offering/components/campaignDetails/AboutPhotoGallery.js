import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Image, Container } from 'semantic-ui-react';
import { NsCarousel } from '../../../../../theme/shared';
import emptyHeroImagePlaceholder from '../../../../../assets/images/gallery-placeholder.jpg';

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
    };
    const galleryImage = [
      'https://nsupdates.s3.amazonaws.com/uploads/heart-700141_960_720.jpg',
      'https://nsupdates.s3.amazonaws.com/uploads/heart-700141_960_720.jpg',
    ];
    const galleryLength = campaign.media.gallery.length < 8 ? campaign.media.gallery.length : 8;
    const tabGalleryLength = campaign.media.gallery.length < 4 ? campaign.media.gallery.length : 4;
    return (
      <Modal
        open
        onClose={this.handleClose}
        size="large"
        closeIcon
        className="about-modal"
      >
        <div className="carousel-counter">{this.state.activeSlide + 1}/{campaign.media.gallery.length}</div>
        <div className="carousel">
          <Container fluid>
            <NsCarousel
              {...settings}
              thumbs={isTablet ? tabGalleryLength : galleryLength}
              imageCount={campaign.media.gallery.length}
              isTablet={isTablet}
              handlePaginationFun={this.handlePagination}
            >
              {
                galleryImage.length ?
                  galleryImage.map(data => (
                    <Image src={data} />
                  ))
                  :
                  <Image src={emptyHeroImagePlaceholder} />
              }
            </NsCarousel>
          </Container>
        </div>
      </Modal>
    );
  }
}

export default AboutPhotoGallery;
