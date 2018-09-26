import React, { Component } from 'react';
import { Modal, Image, Container } from 'semantic-ui-react';
import { NsCarousel } from '../../../../../theme/shared';
import videoPoster from '../../../../../assets/images/636206632.jpg';

const settings = {
  dots: false,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
};


class AboutPhotoGallery extends Component {
  handleClose = () => this.props.history.goBack();

  render() {
    return (
      <Modal
        open
        onClose={this.handleClose}
        size="large"
        closeIcon
      >
        <Modal.Header>1/2</Modal.Header>
        <Modal.Content>
          <div className="carousel mt-10 mb-30">
            <Container>
              <NsCarousel {...settings}>
                {[1, 2, 3].map(() => (
                  <Image src={videoPoster} />
                ))}
              </NsCarousel>
            </Container>
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

export default AboutPhotoGallery;
