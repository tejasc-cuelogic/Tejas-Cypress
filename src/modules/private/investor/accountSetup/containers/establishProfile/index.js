import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import AccountCreation from './AccountCreation';

@inject('investorProfileStore')
@withRouter
@observer
export default class EstablishProfile extends Component {
  handleCloseModal = () => {
    this.props.history.push('/app/summary');
  }
  handleCloseNestedModal = () => {
    this.props.history.push('/app/summary/establish-profile');
  }
  handleFormSubmit = () => {
    this.props.investorProfileStore.submitFieldsForm();
    this.props.history.push('/app/summary/establish-profile');
  }
  render() {
    return (
      <div>
        <AccountCreation
          close={this.handleCloseModal}
          {...this.props}
        />
      </div>
    );
  }
}
