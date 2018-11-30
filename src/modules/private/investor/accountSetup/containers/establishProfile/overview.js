import React, { Component } from 'react';
import Aux from 'react-aux';
import { Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Divider, Button } from 'semantic-ui-react';

@inject('investorProfileStore', 'userDetailsStore')
@withRouter
@observer
export default class Overview extends Component {
  handleChangeStep = () => {
    this.props.investorProfileStore.setStepToBeRendered(1);
  }
  render() {
    const { signupStatus } = this.props.userDetailsStore;
    let overviewInfo = `
      NextSeed Securities, LLC operates as an SEC-registered broker-dealer.
      To begin making investments on the platform, you will need to answer a few more
      questions to complete your investor profile.
    `;
    if (signupStatus.isMigratedFullAccount) {
      overviewInfo = `
        New investments will now be offered through NextSeed Securities, LLC, an SEC-
        registered broker-dealer.
        To migrate your existing account and to begin making investments on the new platform,
        you will need to answer a few more questions to complete your investor profile.
      `;
    }
    return (
      <Aux>
        <Header as="h3" textAlign="center">Please establish your investor profile</Header>
        <Divider section className="small" />
        <p className="center-align mb-50">{overviewInfo}</p>
        <div className="center-align mt-30">
          <Button primary size="large" className="very relaxed" content="Continue" onClick={this.handleChangeStep} />
        </div>
        <div className="center-align mt-30">
          <p><Link to={`${this.props.match.url}/confirm`}>I’ll do it later</Link></p>
        </div>
      </Aux>
    );
  }
}
