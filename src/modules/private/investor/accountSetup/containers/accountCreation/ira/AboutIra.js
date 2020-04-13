import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
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
      <>
        <Header as="h4">About Self-Directed IRAs on NextSeed</Header>
        <p>
        A NextSeed self-directed IRA offers you the benefits of investing with a retirement account (Traditional and Roth IRA options available) while investing in a new asset class. Minimum opening deposit is $2,200 and Regulation Crowdfunding investment limits apply.
        </p>
        <Divider hidden />
        <p>
        <b>Special Offer</b>: For new NextSeed IRA accounts, NextSeed will cover the one-time setup fee and annual account fees for four years. For full details, go to the <Link target="_blank" to="/agreements/legal/terms-of-use">Terms and Conditions </Link>.
        </p>
        <Divider hidden />
        <p>Questions? Please see our <Link target="_blank" to="/resources/education-center/investor/faq">FAQs</Link> on IRAs.</p>
        <Divider hidden />
        <p className="note grey-text">
        NextSeed is not a tax, investment or legal advisor and does not provide any tax, investment, or legal advice; please consult your own advisors or IRS guidelines to determine whether investing in NextSeed offerings through a self-directed IRA is right for you.
        </p>
        <Divider hidden />
        <Button fluid={isMobile} primary className="relaxed" content="Continue" data-cy="about-ira" onClick={this.handleChangeStep} />
      </>
    );
  }
}
