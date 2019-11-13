import React, { Component, Suspense } from 'react';
import { Icon } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import InlineLoader from './InlineLoader';
import { REACT_APP_DEPLOY_ENV } from '../../../constants/common';

const catchErrorBoundry = !['localhost'].includes(REACT_APP_DEPLOY_ENV);

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
    if (sessionStorage.getItem('crashed') && sessionStorage.getItem('crashed') === window.location.href) {
      let emailContent = {
        graphqlError: { operationName: 'Lazy loading' },
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
      sessionStorage.removeItem('crashed');
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
    } else {
      console.log('SuspenseBoundary crashed once, no error reported via email');
      sessionStorage.setItem('crashed', window.location.href);
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
