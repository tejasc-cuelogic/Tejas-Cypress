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
      afterChange: (current) => {
        console.log('Current==>', current);
        // this.setState({ activeSlide: current });
      },
    };
    const galleryArr = [
      { id: '1', isPublic: 'true', url: 'https://nsupdates.s3.amazonaws.com/uploads/0266554465.jpeg' },
      { id: '2', isPublic: 'true', url: 'https://nsupdates.s3.amazonaws.com/uploads/balloon-1046658_960_720.jpg' },
      { id: '3', isPublic: 'true', url: 'https://nsupdates.s3.amazonaws.com/uploads/0266554465.jpeg' },
      { id: '4', isPublic: 'true', url: 'https://nsupdates.s3.amazonaws.com/uploads/balloon-1046658_960_720.jpg' },
    ];
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
              {galleryArr.map(data => (
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
