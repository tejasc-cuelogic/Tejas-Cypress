import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Divider, Button } from 'semantic-ui-react';

export default class Overview extends Component {
  render() {
    return (
      <div>
        <Header as="h3" textAlign="center">Please establish your investor profile</Header>
        <Divider section />
        <p className="center-align mb-50">
          NextSeed Securities, LLC operates as an SEC-registered broker-dealer.
          To begin making investments on the platform, you will need to answer a few more
          questions to complete your investor profile.
        </p>
        <div className="center-align mt-30">
          <Button primary size="large" className="very relaxed" content="Continue" />
        </div>
        <div className="signup-actions">
          <p><Link to="/app/summary">I’ll do it later</Link></p>
        </div>
      </div>
    );
  }
}
