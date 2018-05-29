import React, { Component } from 'react';

class Business extends Component {
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
                top: '25px',
                textAlign: 'center',
              }}
            >
              <span className="title">NextSeed for Business</span>
              <span className="infotext">Let your community invest in your success..</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Business;
