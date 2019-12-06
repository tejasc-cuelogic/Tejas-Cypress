import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Divider, Button, Responsive } from 'semantic-ui-react';

const isMobile = document.documentElement.clientWidth < 768;

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
    const overviewInfo = (
      <>
        <Header as="h3">
          {signupStatus.isMigratedFullAccount
            ? <>Please establish your<Responsive minWidth={992}><br /></Responsive>investor profile</>
            : <>Let{"'"}s get started</>
          }
        </Header>
        {!isMobile && <Divider section className="small" hidden={!signupStatus.isMigratedFullAccount} />}
        <p>
          {signupStatus.isMigratedFullAccount
            ? <>Investments are facilitated by NextSeed Securities LLC (SEC-registered broker-dealer & member of {finraLink}) and NextSeed US LLC (SEC-registered Funding Portal & member of {finraLink}).</>
            : 'To begin making investments, you will need to complete your investor profile by answering a few basic questions.'
          }
        </p>
        {signupStatus.isMigratedFullAccount
          ? (
            <>
              <Divider hidden />
              <p>
                As a registered broker-dealer, NextSeed Securities is required by SEC rules and r egulations to collect an investor profile. In order to gain full access to investments, please answer the following questions to complete your investor profile.
              </p>
            </>
          )
          : <Divider section hidden />
        }
      </>
    );
    return (
      <div className={isMobile ? '' : 'center-align'}>
        {overviewInfo}
        <div className="center-align">
          <Button fluid={isMobile} primary size="large" className="very relaxed" content="Continue" onClick={this.handleChangeStep} />
          <p className="mt-30"><Link to={`${this.props.match.url}/confirm`}>I’ll do it later</Link></p>
        </div>
        {!signupStatus.isMigratedFullAccount
          && (
            <>
              <Divider section hidden />
              <p className="note">
                Investment offerings on nextseed.com are facilitated by NextSeed LLC (SEC-registered Funding Portal & member of {finraLink}) and NextSeed Securities LLC (SEC-registered broker-dealer & membcer of {finraLink}).
              </p>
            </>
          )}
      </div>
    );
  }
}
