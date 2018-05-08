/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Grid, Card, Header, Icon, Responsive, Divider } from 'semantic-ui-react';

import PrivateLayout from '../../../containers/common/PrivateHOC';
import PageHeaderSection from '../../../theme/common/PageHeaderSection';
import StickyNotification from '../components/StickyNotification';
import AccountSetupChecklist from '../components/AccountSetupChecklist';
import InvestorPersonalDetails from '../containers/InvestorPersonalDetails';
import DashboardWizard from './DashboardWizard';

@inject('uiStore', 'accountStore')
@observer
class Summary extends Component {
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
      // linkPath: 'ConfirmPhoneNumber',
    };
    return (
      <Aux>
        <PrivateLayout
          {...this.props}
          StickyNotification={
            <StickyNotification
              stepinfo={stepinfo}
              setDashboardWizardSetup={this.setDashboardWizardSetup}
            />
          }
        >
          <Header as="h3">Welcome to NextSeed!</Header>
          <Grid stackable>
            <Grid.Row>
              <Grid.Column computer={8} largeScreen={8} widescreen={5}>
                <Card fluid raised className="welcome-card">
                  <Card.Content>
                    <Icon size="huge" className="ns-nextseed-icon pull-left" />
                    <Card.Header>
                      Would you like to start the process of new account creation?
                    </Card.Header>
                    <Divider hidden />
                    <AccountSetupChecklist
                      setDashboardWizardSetup={this.setDashboardWizardSetup}
                    />
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </PrivateLayout>
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
      </Aux>
    );
  }
}

export default Summary;
