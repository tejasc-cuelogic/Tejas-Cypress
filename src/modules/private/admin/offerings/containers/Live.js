import React, { Component } from 'react';
import Creation from './Creation';

export default class Live extends Component {
  render() {
    return (
      <Creation {...this.props} />
    );
  }
}
