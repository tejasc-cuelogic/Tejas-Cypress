import React from 'react';
import { Link } from 'react-router-dom';
import { Modal, Grid, Button, Header, Tab, Menu, Icon } from 'semantic-ui-react';

const panes = [
  {
    menuItem: <Menu.Item key="individual"><div className="account-tab"><div className="account-type small">I</div> Individual</div></Menu.Item>,
    render: () => [
      <Tab.Pane key="tab1">
        <p>Create a NextSeed Investment Account by linking your checking account. You can easily
          connect your account by logging in through our secure system or by manually entering
          your account information.<br /><br />
          The uninvested cash in your account 1 is FDIC-insured up to $250,000 and is interest-
          bearing.<br /><br />
          We safeguard your information with bank-level security measures.
        </p>
      </Tab.Pane>,
    ],
  },
  {
    menuItem: <Menu.Item key="individual"><div className="account-tab"><div className="account-type small">E</div> Entity</div></Menu.Item>,
    render: () => [
      <Tab.Pane key="tab2">
        <p>Invest on NextSeed with a corporate, LLC or Trust investment account.<br /><br />
          Minimum opening deposit of $5,000. Please note investment limits apply. The uninvested
          cash in your account 1 is FDIC-insured up to $250,000 and is interest-bearing.<br /><br />
          We safeguard your information with bank-level security measures.
        </p>
      </Tab.Pane>,
    ],
  },
  {
    menuItem: <Menu.Item key="individual"><div className="account-tab"><div className="account-type small">R</div> IRA</div></Menu.Item>,
    render: () => [
      <Tab.Pane>
        <p>Begin investing in local businesses with a self-directed NextSeed IRA. Get the benefits
          of investing with a retirement account (Traditional and Roth IRA options available) while
          investing in this new asset class.<br /><br />
          Minimum opening deposit of $5,000. Please note investment limits apply. The uninvested
          cash in your account 1 is FDIC-insured up to $250,000 and is interest-bearing.<br /><br />
          We safeguard your information with bank-level security measures.<br /><br />
          Promotional Offer: For new NextSeed IRA Accounts, NextSeed will cover the one-time setup
          fee and annual account fees for four years! For full details, go to the Terms and
          Conditions.
        </p>
      </Tab.Pane>,
    ],
  },
];

const investmentChooseType = props => (
  <Modal open closeIcon>
    <Modal.Header className="center-align">
      <Link to="" onClick={() => props.setAuthWizardStep('SignupInitial')} className="back-link"><Icon name="arrow left" /></Link>
      <Header as="h2">What type of Investment Account would you like to start?</Header>
      <p>Choose an account type</p>
    </Modal.Header>
    <Modal.Content className="signup-modal">
      <Grid textAlign="center">
        <Tab
          className="account-type-tab"
          menu={{
            secondary: true,
            pointing: true,
            className: 'item three',
            fluid: true,
            stackable: true,
          }}
          panes={panes}
        />
        <Grid.Row>
          <Grid.Column>
            <Button circular color="green" onClick={() => props.setAuthWizardStep('InvestmentChooseType')} content="Accept" />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Modal.Content>
  </Modal>
);

export default investmentChooseType;
