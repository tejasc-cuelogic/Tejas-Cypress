import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Grid, Card, Header, Icon, Responsive, Divider } from 'semantic-ui-react';

import PageHeaderSection from '../../../components/common/PageHeaderSection';
import StickyNotification from '../components/StickyNotification';
import AccountSetupChecklist from '../components/AccountSetupChecklist';
import InvestorPersonalDetails from '../containers/InvestorPersonalDetails';
import DashboardWizard from './DashboardWizard';

@inject('uiStore', 'accountStore')
@observer
class Dashboard extends Component {
  setDashboardWizardSetup = (step) => {
    this.props.uiStore.setDashboardWizardStep(step);
  }

  handleAccoutTypeChange = (e, { activeIndex }) => {
    this.props.accountStore.setAccountType(activeIndex);
  }

  render() {
    const stepinfo = {
      value: 'Verify your identity',
      label: 'Complete all required information about yourself',
      linkText: 'Verify me',
      linkPath: 'InvestorPersonalDetails',
      // linkPath: 'ConfirmEmailAddress',
    };
    return (
      <div>
        <PageHeaderSection title="Dashboard" />
        {/* <StickyNotification
          stepinfo={stepinfo}
          setDashboardWizardSetup={this.setDashboardWizardSetup}
        />
        </PageHeaderSection> */}
        {/* <div className="page-header-section webcontent-spacer">
          <Grid>
            <Grid.Row>
              <Grid.Column width={4}>
                <h1>Summary</h1>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div> */}
        <div className="top-cta-section">
          <Responsive {...Responsive.onlyComputer}>
            <StickyNotification
              stepinfo={stepinfo}
              setDashboardWizardSetup={this.setDashboardWizardSetup}
            />
            {/* <div className="sticky-notification">
              <Card fluid raised>
                <Card.Content>
                  <Card.Meta>Next Step:</Card.Meta>
                  <Statistic size="mini" className="cta">
                    <Statistic.Value>Verify your identity</Statistic.Value>
                    <Statistic.Label>Complete all required information about you</Statistic.Label>
                  </Statistic>
                  <Button primary as={Link} floated="right"
                  className="pull-right" to="">Verify me</Button>
                </Card.Content>
              </Card>
            </div> */}
          </Responsive>
        </div>
        <Divider section hidden />
        <div className="content-spacer">
          <Header as="h3">Welcome to NextSeed!</Header>
          <Grid stackable>
            <Grid.Row>
              <Grid.Column computer={8} largeScreen={8} widescreen={5}>
                <Card fluid raised className="welcome-card">
                  <Card.Content>
                    <Icon size="huge" name="ns-nextseed-icon" className="pull-left" />
                    <Card.Header>
                      Would you like to start the process of new account creation?
                    </Card.Header>
                    {/* <Card.Meta>Please complete the following steps in order
                      to unlock all features:
                    </Card.Meta> */}
                    <Divider hidden />
                    <AccountSetupChecklist
                      setDashboardWizardSetup={this.setDashboardWizardSetup}
                    />
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid.Row>
            {/* <Grid.Row>
              <Grid.Column mobile={16} tablet={16} computer={6}>
                <Card.Group className="steps-card">
                  <Card fluid raised>
                    <Card.Content>
                      <Card.Description>
                        <Icon name="numbar" data-icon="1" />
                        Complete all required information about you
                        <Link as="a" to=""><strong>here</strong></Link>
                      </Card.Description>
                    </Card.Content>
                  </Card>
                  <Card fluid raised>
                    <Card.Content>
                      <Card.Description>
                        <Icon name="numbar" data-icon="2" />
                        Confirm your e-mail address.
                        <Link as="a" to=""><strong>Resend email</strong></Link>
                      </Card.Description>
                    </Card.Content>
                  </Card>
                  <Card fluid raised>
                    <Card.Content>
                      <Card.Description className="disabled">
                        <Icon name="numbar" data-icon="3" />
                        Open your first NextSeeed Account
                      </Card.Description>
                    </Card.Content>
                  </Card>
                </Card.Group>
              </Grid.Column>
            </Grid.Row> */}
          </Grid>
        </div>
        {this.props.uiStore.dashboardStep &&
        <DashboardWizard
          handleAccoutTypeChange={this.handleAccoutTypeChange}
          routeOnInvestmentTypeSelection={this.props.accountStore.routeOnInvestmentTypeSelection}
          selectedInvestmentType={this.props.accountStore.accountType}
        />
        }
        {this.props.uiStore.modalStatus &&
          <InvestorPersonalDetails />
        }
      </div>
    );
  }
}

export default Dashboard;
