import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default class NsCarousel extends React.Component {
  render() {
    const settings = {
      infinite: true,
      speed: 500,
      slidesToShow: this.props.slidesToShow,
      slidesToScroll: this.props.slidesToScroll,
      arrows: this.props.arrows,
      dots: this.props.dots,
    };
    return (
      <Slider {...settings}>
        {this.props.children}
      </Slider>
    );
  }
}
