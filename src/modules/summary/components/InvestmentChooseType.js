import React from 'react';
import { Link } from 'react-router-dom';
import { Modal, Grid, Button, Header, Tab, Menu } from 'semantic-ui-react';

const panes = [
  {
    menuItem: <Menu.Item key="individual"><div className="account-tab"><div className="account-type small">I</div> Individual</div></Menu.Item>,
    render: () => [
      <Tab.Pane key="individual">
        <p>Open a NextSeed investment account to begin investing in local businesses.
          <br /> <br />
        An initial deposit can be quickly and securely completed by
        linking your checking account. <br />
        You can easily connect your account by logging in through our secure system or by <br />
        manually entering your account information. The uninvested cash in your account is <br />
        [FDIC-insured][note: hover over with footnote] up to $250,000
        and is interest-bearing. <br /><br />
        We safeguard your information with bank-level security measures.
        </p>
      </Tab.Pane>,
    ],
  },
  {
    menuItem: <Menu.Item key="ira"><div className="account-tab"><div className="account-type small">R</div> IRA</div></Menu.Item>,
    render: () => [
      <Tab.Pane key="ira">
        <p>Open a self-directed NextSeed IRA to begin investing in local businesses.
          (Traditional and Roth IRA options available.) <br />
          Minimum opening deposit: $5,000.  Investment limits apply. <br />
          For new NextSeed IRA accounts,
          NextSeed will cover the one-time setup fee and annual account <br /> fees for four years.
          See the <Link to="/app/summary">Terms and Conditions</Link> for full details
        </p>
      </Tab.Pane>,
    ],
  },
  {
    menuItem: <Menu.Item key="entity"><div className="account-tab"><div className="account-type small">E</div> Entity</div></Menu.Item>,
    render: () => [
      <Tab.Pane key="entity">
        <p>Create a NextSeed Investment Account by linking your checking account.
          You can easily <br />
        connect your account by logging in through our secure system or by manually
        entering your <br />
        account information. <br />
        The uninvested cash in your account1 is FDIC-insured up to
        $250,000 and is interest-bearing.<br /><br />
        We safeguard your information with bank-level security measures.
        </p>
      </Tab.Pane>,
    ],
  },
];

const InvestmentChooseType = props => (
  <Modal open closeIcon onClose={() => props.setDashboardWizardStep()}>
    <Modal.Header className="center-align signup-header">
      <Header as="h1">What type of Investment Account would you like to start?</Header>
    </Modal.Header>
    <Modal.Content className="signup-content">
      <Header as="h4" textAlign="center">Choose an account type</Header>
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
          activeIndex={props.selectedInvestmentType.activeIndex}
          onTabChange={props.handleAccoutTypeChange}
        />
      </Grid>
      <Button
        circular
        icon={{ className: 'ns-arrow-right' }}
        className="multistep__btn next active"
        onClick={() => props.setDashboardWizardStep(props.routeOnInvestmentTypeSelection)}
      />
    </Modal.Content>
  </Modal>
);

export default InvestmentChooseType;
