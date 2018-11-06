import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Divider, Button } from 'semantic-ui-react';

@inject('investorProfileStore')
@withRouter
@observer
export default class Overview extends Component {
  handleChangeStep = () => {
    this.props.investorProfileStore.setStepToBeRendered(1);
  }
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
          <Button primary size="large" className="very relaxed" content="Continue" onClick={this.handleChangeStep} />
        </div>
        <div className="center-align mt-30">
          <p><Link to={`${this.props.match.url}/confirm`}>I’ll do it later</Link></p>
        </div>
      </div>
    );
  }
}
