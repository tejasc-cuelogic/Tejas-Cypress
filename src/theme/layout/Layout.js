import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

@withRouter
@observer
class Layout extends Component {
  render() {
    return (
      <>
        {this.props.children}
      </>
    );
  }
}

export default Layout;
