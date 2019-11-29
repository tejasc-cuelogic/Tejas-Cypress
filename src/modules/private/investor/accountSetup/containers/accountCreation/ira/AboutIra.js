import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Divider, Button } from 'semantic-ui-react';

const isMobile = document.documentElement.clientWidth < 768;

@inject('iraAccountStore', 'userDetailsStore')
@withRouter
@observer
export default class AboutIra extends Component {
  handleChangeStep = () => {
    this.props.iraAccountStore.setStepToBeRendered(1);
  }

  render() {
    return (
      <div className={isMobile ? '' : 'center-align'}>
        <Header as={isMobile ? 'h4' : 'h3'}>
        About Self-Directed IRAs on NextSeed
        </Header>
        {!isMobile && <Divider section className="small" hidden />}
        <p>
        A NextSeed self-directed IRA offers you the benefits of investing with a retirement account (Traditional and Roth IRA options available) while investing in a new asset class. Minimum opening deposit is $2,200 and Regulation Crowdfunding investment limits apply.
        </p>
        <Divider section hidden />
        <p>
        Special Offer: For new NextSeed IRA accounts, NextSeed will cover the one-time setup fee and annual account fees for four years. For full details, go to the Terms and Conditions.
        </p>
        <Divider section hidden />
        <p>
        Questions? Please see our FAQs on IRAs.
        </p>
        <Divider section hidden />
          <Button fluid={isMobile} primary className="relaxed" content="Continue" onClick={this.handleChangeStep} />
        <Divider section hidden />
      </div>
    );
  }
}
