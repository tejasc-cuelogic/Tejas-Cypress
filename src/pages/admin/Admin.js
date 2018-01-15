import React from 'react';
import { inject, observer } from 'mobx-react';

@inject('adminStore')
@observer
export default class Admin extends React.Component {
  render() {
    return (
      <div>
        <p>Welcome admin</p>
        {this.props.children}
      </div>
    );
  }
}
