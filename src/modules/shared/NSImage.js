/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import React from 'react';
import { Image } from 'semantic-ui-react';

export default class NSImage extends React.Component {
  render() {
    const { path, alt, ...restProps } = this.props;
    return (
      <Image alt={alt || 'Image not found!'} {...restProps} src={require(`../../assets/images/${path}`)} />
    );
  }
}
