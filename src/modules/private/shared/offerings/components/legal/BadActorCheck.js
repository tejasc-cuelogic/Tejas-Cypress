import React, { Component } from 'react';
import Issuer from './badActorCheck/Issuer';

export default class BadActorCheck extends Component {
  render() {
    return (
      <div style={{ fontSize: '24px', color: '#666', textAlign: 'center' }}>
        <Issuer />
      </div>
    );
  }
}
