import React, { Component } from 'react';
import PrivateLayout from '../../shared/PrivateHOC';

class Dashboard extends Component {
  render() {
    return (
      <PrivateLayout {...this.props}>
        <div
          style={{
            fontSize: '24px',
            color: '#666',
            marginTop: '28px',
            textAlign: 'center',
          }}
        >
          This is just a landing page to demonstrate admin Dashboard
        </div>
      </PrivateLayout>
    );
  }
}

export default Dashboard;
