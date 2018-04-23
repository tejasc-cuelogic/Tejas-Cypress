import React, { Component } from 'react';

class Home extends Component {
  render() {
    return (
      <div className="ui vertical segment content">
        <div className="ui container">
          <div className="ui one column grid">
            <div
              className="column nsContent"
              style={{
                fontSize: '30px',
                color: '#666',
                textAlign: 'center',
              }}
            >
              <span className="title">NextSeed Home</span>
              <span className="infotext">NextSeed is giving local business owners a platform to access flexible debt financing</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
