import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

@inject('authStore', 'uiStore')
@withRouter
@observer
export default class SessionCheckContainer extends React.Component {
  componentDidMount() {
    if (!this.props.authStore.isUserLoggedIn) {
      this.props.uiStore.setRedirectURL(this.props.history.location);
      this.props.history.push('/login');
    }
  }

  render() {
    if (this.props.authStore.isUserLoggedIn) {
      return this.props.children;
    }
    return null;
  }
}
