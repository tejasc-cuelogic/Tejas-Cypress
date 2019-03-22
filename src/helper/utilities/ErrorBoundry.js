import React from 'react';
import { Header } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { REACT_APP_DEPLOY_ENV } from '../../constants/common';
// TODO: Improve the component

const catchErrorBoundry = ['production', 'demo'].includes(REACT_APP_DEPLOY_ENV);

@inject('authStore')
@withRouter
@observer
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    console.log('Error payload:: ', error);
    console.log('Error info:: ', info);
    if (catchErrorBoundry) {
      try {
        const params = {
          subject: 'Application error occured',
          body: JSON.stringify(error),
        };
        this.props.authStore.notifyApplicationError(params);
      } catch (e) {
        console.log(e);
      }
      window.location = window.location.origin;
    }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-page">
          <Header as="h2">
            Oops! Something went wrong.
          </Header>
          <span>
            Hang tight -
            we&lsquo;ve notified the team, and we&lsquo;re taking you back to the homepage.<br />
            <a href={window.location.origin}>Click here to be redirected now</a>
          </span>
        </div>
      );
    }
    return (catchErrorBoundry && this.state.hasError) ? null : this.props.children;
  }
}

export default ErrorBoundary;
