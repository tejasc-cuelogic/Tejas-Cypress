import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';

export default class Overview extends Component {
  render() {
    return (
      <div>
        <Header as="h1">
Overview
          <Header.Subheader>Offerings Overview ...</Header.Subheader>
        </Header>
      </div>
    );
  }
}
