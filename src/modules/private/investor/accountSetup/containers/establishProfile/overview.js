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
    let overviewInfo = (
      <Aux>
        <p>
          Investment offerings on <a href="https://www.nextseed.com/" target="_blank" rel="noopener noreferrer">nextseed.com</a>
          {' '}are facilitated by NextSeed US LLC (SEC-registered Funding Portal & member of FINRA)
          and NextSeed Securities LLC (SEC-registered broker-dealer & member of{' '}
          <a href="https://www.finra.org/" target="_blank" rel="noopener noreferrer">FINRA</a>.
        </p>
        <Divider hidden />
        <p>
          To begin making investments on the platform, you will need to answer a few more
          questions to complete your investor profile.
        </p>
      </Aux>
    );
    if (signupStatus.isMigratedFullAccount) {
      overviewInfo = (
        <Aux>
          <p>
            New investments will now be offered through NextSeed Securities, LLC, an SEC-
            registered broker-dealer and a member firm of the Financial Industry Regulatory
            Authority ({'"'}<a href="https://www.finra.org/" target="_blank" rel="noopener noreferrer">FINRA</a>{'"'}).
          </p>
          <Divider hidden />
          <p>
            To migrate your existing account and to begin making investments on the new platform,
            you will need to answer a few more questions to complete your investor profile.
          </p>
        </Aux>
      );
    }
    return (
      <div className="center-align">
        <Header as="h3">Please establish your investor profile</Header>
        <Divider section className="small" />
        <p className="mb-50">{overviewInfo}</p>
        <Button primary size="large" className="very relaxed" content="Continue" onClick={this.handleChangeStep} />
        <p className="mt-30"><Link to={`${this.props.match.url}/confirm`}>I’ll do it later</Link></p>
      </div>
    );
  }
}
