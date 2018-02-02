import React, { Component } from 'react';

class Offering extends Component {
  render() {
    return (
      <div className="ui one column grid">
        <div
          className="column"
          style={{
            fontSize: '30px',
            color: '#666',
            textAlign: 'center',
            top: '25px',
          }}
        >
          <span className="title">NextSeed Offerings</span>
          <span className="infotext">Invest in growing local businesses</span>
        </div>
      </div>
    );
  }
}

export default Offering;
