import React, { Component } from 'react';

class Invest extends Component {
  render() {
    return (
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
          <span className="title">NextSeed for Investers</span>
          <span className="infotext">Invest in exclusive, pre-vetted deals</span>
        </div>
      </div>
    );
  }
}

export default Invest;
