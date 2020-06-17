import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import { Modal, Container } from 'semantic-ui-react';
import { NsCarousel, Image64 } from '../../../../theme/shared';
import NSImage from '../../../shared/NSImage';

const isTablet = document.documentElement.clientWidth < 1024;
@inject('collectionStore')
@observer
class AboutPhotoGallery extends Component {
  state = {
    activeSlide: 0,
  };

  handleClose = () => {
    this.props.collectionStore.setFieldValue('gallarySelectedImageIndex', null);
    this.props.history.goBack();
  }

  handlePagination = (newIndex) => {
    if (this.props.collectionStore.gallarySelectedImageIndex !== null) {
      this.props.collectionStore.setFieldValue('gallarySelectedImageIndex', null);
    }
    this.setState({ activeSlide: newIndex });
  }

  render() {
    const { gallarySelectedImageIndex, getGalleryImages } = this.props.collectionStore;
    const settings = {
      dots: false,
      infinite: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      adaptiveHeight: true,
    };
    const galleryArray = getGalleryImages || [];
    return (
      <Modal
        open
        onClose={this.handleClose}
        size="fullscreen"
        closeIcon
        className="about-modal-2' about-modal"
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
                  <div className="about-carousel-2' about-carousel">
                    <div className="carousel-details counter template2">{gallarySelectedImageIndex !== null ? (gallarySelectedImageIndex + 1) : (this.state.activeSlide + 1)}/{galleryArray.length}</div>
                    <Image64 srcUrl={get(data, 'image.url')} />
                    {get(data, 'caption') && <div className="carousel-details caption template2">{get(data, 'caption')}</div>}
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
