import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';

class Home extends Component {
  render() {
    return (
      <Header as="h1">NextSeed Home
        <Header.Subheader>
          NextSeed is giving local business owners a platform to access flexible debt financing
        </Header.Subheader>
      </Header>
    );
  }
}

export default Home;
