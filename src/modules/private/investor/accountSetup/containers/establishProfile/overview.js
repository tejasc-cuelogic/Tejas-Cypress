import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Divider, Button } from 'semantic-ui-react';

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
        <Header as={isMobile ? 'h4' : 'h3'}>Please establish your investor profile</Header>
        {!isMobile && <Divider section className="small" />}
        <p>{
          signupStatus.isMigratedFullAccount
            ? (
              <>
                We{"'"}re pleased to share that certain new investments will now be facilitated
                by NextSeed Securities LLC (SEC-registered broker-dealer & member of{' '}
                {finraLink}),
                an affiliate of NextSeed US LLC (SEC-registered Funding Portal & member of {finraLink}).
               </>
            )
            : (
              <>
                Investments are facilitated by NextSeed Securities LLC (SEC-registered 
                broker-dealer & member of {finraLink}) and NextSeed US LLC (SEC-registered Funding 
                Portal & member of {finraLink}).
              </>
            )
        }
        </p>
        <Divider hidden />
        <p>{signupStatus.isMigratedFullAccount
          ? `As a registered broker-dealer, NextSeed Securities is required by SEC rules and
          regulations to collect an investor profile. In order to gain full access to
          investments, please answer the following questions to complete your investor
          profile.`
          : `As a registered broker-dealer, NextSeed Securities is required by SEC rules and 
          regulations to collect an investor profile. In order to gain full access to 
          investments, please answer the following questions to complete your investor 
          profile.`
        }
        </p>
      </>
    );
    return (
      <div className={isMobile ? '' : 'center-align'}>
        {overviewInfo}
        <div className="center-align">
          <Button fluid={isMobile} primary size="large" className="very relaxed" content="Continue" onClick={this.handleChangeStep} />
          <p className="mt-30"><Link to={`${this.props.match.url}/confirm`}>I’ll do it later</Link></p>
        </div>
      </div>
    );
  }
}
