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
    const finraLink = <a href="https://www.finra.org/" target="_blank" rel="noopener noreferrer">FINRA</a>;
    const { signupStatus } = this.props.userDetailsStore;
    let overviewInfo = (
      <Aux>
        <Header as="h3">Let’s get started</Header>
        <Divider section className="small" />
        <p className="mb-50">
          To begin making investments, you will need to complete your investor
          profile by answering a few basic questions.
        </p>
      </Aux>
    );
    if (signupStatus.isMigratedFullAccount) {
      overviewInfo = (
        <Aux>
          <Header as="h3">Please establish your investor profile</Header>
          <Divider section className="small" />
          <p>
            We
            {"'"}
re pleased to share that certain new investments will now be facilitated
            by NextSeed Securities LLC (SEC-registered broker-dealer & member of
            {' '}
            {finraLink}
),
            an affiliate of NextSeed US LLC (SEC-registered Funding Portal & member of
            {finraLink}
).
          </p>
          <Divider hidden />
          <p className="mb-50">
            As a registered broker-dealer, NextSeed Securities is required by SEC rules and
            regulations to collect an investor profile. In order to gain full access to
            investments, please answer the following questions to complete your investor
            profile.
          </p>
        </Aux>
      );
    }
    return (
      <div className="center-align">
        {overviewInfo}
        <Button primary size="large" className="very relaxed" content="Continue" onClick={this.handleChangeStep} />
        <p className="mt-30"><Link to={`${this.props.match.url}/confirm`}>I’ll do it later</Link></p>
        {!signupStatus.isMigratedFullAccount
          ? (
<p className="mt-50 note">
              Investment offerings on
              {' '}
              <a href="https://www.nextseed.com/" target="_blank" rel="noopener noreferrer">nextseed.com</a>
              {' '}
    are facilitated by NextSeed US LLC (SEC-registered Funding Portal & member of
              {' '}
              {finraLink}
    )
              and NextSeed Securities LLC (SEC-registered broker-dealer & member of
              {' '}
              {finraLink}
    ).
            </p>
          )
          : null
        }
      </div>
    );
  }
}
