import React from 'react';
import { inject, observer } from 'mobx-react';

@inject('adminStore', 'userStore')
@observer
export default class Investor extends React.Component {
  render() {
    return (
      <div>
        <p>this is investor home page</p>
      </div>
    );
  }
}
