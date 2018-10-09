/* eslint-disable react/no-did-mount-set-state, no-return-assign */
import React, { Component } from 'react';
import Aux from 'react-aux';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default class NsCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nav1: null,
      nav2: null,
    };
  }

  componentDidMount() {
    this.setState({
      nav1: this.slider1,
      nav2: this.slider2,
    });
  }
  render() {
    const settings = {
      infinite: true,
      speed: 500,
      slidesToShow: this.props.slidesToShow,
      slidesToScroll: this.props.slidesToScroll,
      arrows: this.props.arrows,
      dots: this.props.dots,
      beforeChange: (current, next) => {
        this.props.handlePaginationFun(next);
      },
    };

    if (this.props.thumbs) {
      let thumbnailClassToApply = '';
      if (this.props.isTablet) {
        thumbnailClassToApply = this.props.imageCount >= 4 ? 'slider-thumbnails' : 'slider-thumbnails custom-count';
      } else {
        thumbnailClassToApply = this.props.imageCount >= 8 ? 'slider-thumbnails' : 'slider-thumbnails custom-count';
      }
      return (
        <Aux>
          <Slider
            {...settings}
            asNavFor={this.state.nav2}
            ref={slider => (this.slider1 = slider)}
          >
            {this.props.children}
          </Slider>
          <Slider
            {...settings}
            asNavFor={this.state.nav1}
            ref={slider => (this.slider2 = slider)}
            slidesToShow={this.props.thumbs}
            swipeToSlide
            focusOnSelect
            className={thumbnailClassToApply}
          >
            {this.props.children}
          </Slider>
        </Aux>
      );
    }

    return (
      <Slider {...settings}>
        {this.props.children}
      </Slider >
    );
  }
}
