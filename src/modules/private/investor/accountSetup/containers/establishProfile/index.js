import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import AccountCreation from './AccountCreation';

@withRouter
export default class EstablishProfile extends Component {
  handleCloseModal = () => {
    this.props.history.push('/app/summary');
  }
  render() {
    return (
      <div>
        <AccountCreation />
      </div>
    );
  }
}
