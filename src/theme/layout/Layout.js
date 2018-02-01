/* eslint-disable eol-last */
import React, { Component } from 'react';
import Header from './Header';
import Footer from './Footer';

class Layout extends Component {
  render() {
    return (
      <div>
        <Header />
        <div
          className="ui text container"
          style={{
            marginTop: '7em',
            minHeight: '300px',
            textAlign: 'center',
                }}
        >
          {this.props.children}
        </div>
        <Footer />
      </div>
    );
  }
}

export default Layout;