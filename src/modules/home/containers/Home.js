import React, { Component } from 'react';

class Home extends Component {
  render() {
    return (
      <div className="ui one column grid">
        <div className="column" style={{ fontSize: '30px', color: '#666', top: '25px' }} >
          <span className="title">NextSeed Home</span>
          <span className="infotext">
            NextSeed is giving local business owners a platform to access flexible debt financing
          </span>
        </div>
      </div>
    );
  }
}

export default Home;
