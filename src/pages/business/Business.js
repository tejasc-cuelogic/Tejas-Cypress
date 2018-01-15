import React from 'react';
import { inject, observer } from 'mobx-react';

@inject('adminStore', 'userStore')
@observer
export default class Business extends React.Component {
  render() {
    return (
      <div>
        <p>This is Business Owner Home page</p>
      </div>
    );
  }
}
