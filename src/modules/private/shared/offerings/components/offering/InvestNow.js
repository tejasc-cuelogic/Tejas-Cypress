import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';

@inject('userStore', 'uiStore', 'offeringCreationStore')
@withRouter
@observer
export default class InvestNow extends Component {
  render() {
    return (
      <div>Cooming Soon InvestNow</div>
    );
  }
}
