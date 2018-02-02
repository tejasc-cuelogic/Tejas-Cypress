import React, { Component } from 'react';

class Blog extends Component {
  render() {
    return (
      <div className="ui one column grid">
        <div className="column" style={{ fontSize: '30px', color: '#666', top: '25px' }} >
          <span className="title">NextSeed Blog</span>
          <span className="infotext">Let your community invest in your success</span>
        </div>
      </div>
    );
  }
}

export default Blog;
