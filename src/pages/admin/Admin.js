import React from 'react';
import { inject, observer } from 'mobx-react';

import UsersList from './components/UsersList';

@inject('adminStore')
@observer
export default class Admin extends React.Component {
  render() {
    return (
      <div>
        <UsersList usersList={this.props.adminStore.usersList} />
      </div>
    );
  }
}
