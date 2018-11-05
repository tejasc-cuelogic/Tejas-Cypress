import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Aux from 'react-aux';
import { withRouter } from 'react-router-dom';

@withRouter
@observer
class Layout extends Component {
  render() {
    return (
      <Aux>
        {this.props.children}
      </Aux>
    );
  }
}

export default Layout;
