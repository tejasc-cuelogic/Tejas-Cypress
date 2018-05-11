import React, { Component } from 'react';
// import Loadable from 'react-loadable';
import { Image } from 'semantic-ui-react';

// const LoadImg = () => Loadable({
//   /* eslint-disable */
//   loader: () => <Image centered size="mini"
// src={require('../../assets/images/banks/ins_3.png')} />,
//   loading() {
//     return <div>Loading...</div>;
//   },
// });

export default class ImageLoader extends Component {
  render() {
    return (
      /* eslint-disable */
      <Image centered size="small" src={require(`../../assets/images/${this.props.imagePath}`)} />
      // <LoadImg {...this.props} />
    );
  }
}
