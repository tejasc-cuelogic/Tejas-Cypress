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
    };
    return (
      <div>
        <PageHeaderSection title="Dashboard" />
        <div className="top-cta-section">
          <Responsive {...Responsive.onlyComputer}>
            <StickyNotification
              stepinfo={stepinfo}
              setDashboardWizardSetup={this.setDashboardWizardSetup}
            />
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
                    <Divider clearing hidden />
                    <AccountSetupChecklist
                      setDashboardWizardSetup={this.setDashboardWizardSetup}
                    />
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid.Row>
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
