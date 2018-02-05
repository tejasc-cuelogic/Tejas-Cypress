import React, { Component } from 'react';

class Settings extends Component {
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
          <span className="title">NextSeed Settings</span>
          <span className="infotext">Explore your account settings</span>
        </div>
      </div>
    );
  }
}

export default Settings;
