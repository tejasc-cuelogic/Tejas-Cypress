import React, { Component, Suspense } from 'react';
import { Icon } from 'semantic-ui-react';
import InlineLoader from './InlineLoader';

class SuspenseBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true }; // Update state so the next render will show the fallback UI.
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo, 'Reloading page in 5 seconds...');
    // setTimeout(() => {
    //   window.location.reload();
    // }, 5000);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="center-align">
          <Icon name="warning circle" size="huge" color="yellow" />
          <h2>Oops! something went wrong.</h2>
          <p>
            Well, this is awkward. An error occurred loading content.
            <br />
            <a href={window.location.href}>Click here</a> to reload.
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
