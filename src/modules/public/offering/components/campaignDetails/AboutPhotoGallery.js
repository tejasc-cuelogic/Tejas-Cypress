import React, { Component } from 'react';
import { Modal, Image, Container } from 'semantic-ui-react';
import { NsCarousel } from '../../../../../theme/shared';
import videoPoster from '../../../../../assets/images/636206632.jpg';

const settings = {
  dots: false,
  infinite: false,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
};

const isTablet = document.documentElement.clientWidth < 1024;
class AboutPhotoGallery extends Component {
  handleClose = () => this.props.history.goBack();

  render() {
    return (
      <Modal
        open
        onClose={this.handleClose}
        size="large"
        closeIcon
        className="about-modal"
      >
        <div className="carousel-counter">1/10</div>
        <div className="carousel">
          <Container fluid>
            <NsCarousel {...settings} thumbs={isTablet ? 4 : 8}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(() => (
                <Image src={videoPoster} />
              ))}
            </NsCarousel>
          </Container>
        </div>
      </Modal>
    );
  }
}

export default AboutPhotoGallery;
