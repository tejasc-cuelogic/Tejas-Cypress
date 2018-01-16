import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

@inject('adminStore', 'userStore')
@withRouter
@observer
export default class Admin extends React.Component {
  render() {
    return (
      <div>
        <p>Admin Dashboard panel</p>
      </div>
    );
  }
}
