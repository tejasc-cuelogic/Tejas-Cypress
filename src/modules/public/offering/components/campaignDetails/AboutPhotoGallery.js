import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Image, Container } from 'semantic-ui-react';
import { NsCarousel } from '../../../../../theme/shared';
// import videoPoster from '../../../../../assets/images/636206632.jpg';

const isTablet = document.documentElement.clientWidth < 1024;
@inject('campaignStore')
@observer
class AboutPhotoGallery extends Component {
  state = {
    activeSlide: 0,
  };
  handleClose = () => this.props.history.goBack();
  render() {
    const { campaign } = this.props.campaignStore;
    const settings = {
      dots: false,
      infinite: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
    };
    return (
      <Modal
        open
        onClose={this.handleClose}
        size="large"
        closeIcon
        className="about-modal"
      >
        <div className="carousel-counter">{this.state.activeSlide}/{campaign.media.gallery.length}</div>
        <div className="carousel">
          <Container fluid>
            <NsCarousel {...settings} thumbs={isTablet ? 4 : campaign.media.gallery.length}>
              {campaign.media.gallery.map(data => (
                <Image src={data.url} />
              ))}
            </NsCarousel>
          </Container>
        </div>
      </Modal>
    );
  }
}

export default AboutPhotoGallery;
