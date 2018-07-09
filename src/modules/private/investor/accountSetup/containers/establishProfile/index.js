import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Employment from '../../components/establishProfile/Employment';

@withRouter
export default class EstablishProfile extends Component {
  handleCloseModal = () => {
    this.props.history.push('/app/summary');
  }
  render() {
    return (
      <div>
        <Employment
          close={this.handleCloseModal}
        />
      </div>
    );
  }
}
