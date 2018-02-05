import React, { Component } from 'react';

class Messages extends Component {
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
          <span className="title">NextSeed Messages</span>
          <span className="infotext">Explore your Messages...</span>
        </div>
      </div>
    );
  }
}

export default Messages;
