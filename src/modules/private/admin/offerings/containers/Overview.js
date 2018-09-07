import React, { Component } from 'react';
import Creation from './Creation';

export default class Overview extends Component {
  render() {
    return (
      <Creation {...this.props} />
    );
  }
}
