import React, { Component, Suspense } from 'react';
import { Icon } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import InlineLoader from './InlineLoader';
import { REACT_APP_DEPLOY_ENV } from '../../../constants/common';

const catchErrorBoundry = !['localhosst'].includes(REACT_APP_DEPLOY_ENV);

@inject('authStore')
@observer
class SuspenseBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true }; // Update state so the next render will show the fallback UI.
  }

  componentDidCatch(error, info) {
    let operationName = 'Lazy loading';
    if (sessionStorage.getItem('crashed') && sessionStorage.getItem('crashed') === window.location.href) {
      console.log('SuspenseBoundary crashed more than once');
      sessionStorage.removeItem('crashed');
      operationName = 'Lazy loading - hard fail';
    } else {
      console.log('SuspenseBoundary crashed once');
      sessionStorage.setItem('crashed', window.location.href);
      operationName = 'Lazy loading - soft fail';
    }
    let emailContent = {
      graphqlError: { operationName },
      urlLocation: window.location.href,
      message: error.stack,
    };
    if (window.FS && window.FS.getCurrentSessionURL) {
      const fullStorySession = window.FS.getCurrentSessionURL(true);
      emailContent = {
        ...emailContent,
        fullStoryUrl: fullStorySession,
      };
    }

    if (catchErrorBoundry) {
      try {
        const params = {
          emailContent: JSON.stringify(emailContent),
        };
        this.props.authStore.notifyApplicationError(params).then(() => {
          console.log('Error logging');
        }).catch(() => {
          console.log('Error logging');
        });
      } catch (e) {
        console.log('Error logging', e);
      }
    } else {
      console.log(`Error logging for ${REACT_APP_DEPLOY_ENV}, it would have triggered notifyApplicationError otherwise`, error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="center-align">
          <Icon name="warning circle" size="huge" color="yellow" />
          <h2>Oops! Something went wrong.</h2>
          <p>
            Well, this is awkward. An error occurred while content was loading.
            <br />
            <a href={window.location.href}>Click here</a> to reload or go to the <a href={window.location.origin}>homepage</a>.
          </p>
        </section>
      );
    }

    return (
      <Suspense fallback={this.props.fallBack || <InlineLoader />}>
        {this.props.children}
      </Suspense>
    );
  }
}

export default SuspenseBoundary;
