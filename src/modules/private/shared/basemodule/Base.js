import React, { Component } from 'react';
import PrivateLayout from '../../containers/common/PrivateHOC';

class Base extends Component {
  render() {
    const pathInfo = this.props.location.pathname.split('/app/');
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
          {`
            This is just a landing page to demonstrate real navigation of route
            "${pathInfo[1].replace(/\//g, ' > ')}"
          `}
        </div>
      </PrivateLayout>
    );
  }
}

export default Base;
