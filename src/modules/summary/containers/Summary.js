import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import _ from 'lodash';
import { Grid, Card, Header, Divider, List } from 'semantic-ui-react';

import PrivateLayout from '../../../containers/common/PrivateHOC';
import StickyNotification from '../components/StickyNotification';
import AccountSetupChecklist from '../components/AccountSetupChecklist';
import InvestorPersonalDetails from '../containers/InvestorPersonalDetails';
import DashboardWizard from './DashboardWizard';
import Spinner from '../../../theme/ui/Spinner';
import OtherAccountTypes from '../components/OtherAccountTypes';

@inject('uiStore', 'profileStore', 'entityAccountStore', 'iraAccountStore', 'accountStore', 'userStore', 'userDetailsStore', 'individualAccountStore')
@observer
class Summary extends Component {
  componentWillMount() {
    this.props.userDetailsStore.getUser(this.props.userStore.currentUser.sub);
  }

  setDashboardWizardSetup = (step) => {
    this.props.uiStore.setDashboardWizardStep(step);
    this.restoreStep();
  }

  handleAccoutTypeChange = (e, { activeIndex }) => {
    this.props.accountStore.setAccountType(activeIndex);
    this.restoreStep();
  }

  restoreStep = () => {
    if (this.props.accountStore.accountType.activeIndex === 0) {
      // this.props.individualAccountStore.setStepToBeRendered(0);
      this.props.accountStore.setBankLinkInterface('list');
    }
  }

  navToAccTypes = (step) => {
    const type = this.props.accountStore.getAccountTypeIndex(step);
    this.props.accountStore.setAccountType(type);
    this.setDashboardWizardSetup(`${step}/AccountCreation`);
  }

  render() {
    let stepinfo = {
      value: 'Verify your identity',
      label: 'Complete all required information about yourself',
      linkText: 'Verify me',
      linkPath: 'InvestorPersonalDetails',
    };

    let accTypes = ['individual', 'IRA', 'entity'];
    if (!this.props.uiStore.errors) {
      const accDetails = this.props.userDetailsStore.signupStatus;
      if (accDetails.activeAccounts.length > 0) {
        accTypes = _.filter(
          accTypes,
          n => !accDetails.activeAccounts.includes(_.lowerCase(n)),
        );
        return (
          <OtherAccountTypes
            {...this.props}
            accTypes={accTypes}
            navToAccTypes={this.navToAccTypes}
            dashboardStep={this.props.uiStore.dashboardStep}
          />
        );
      }
    }

    const { currentUser, isUserVerified } = this.props.userDetailsStore;
    if (!currentUser.data.user) {
      return (
        <div>
          <Spinner loaderMessage="Loading..." />
        </div>
      );
    }

    let linkPath = 'InvestmentChooseType';
    if (currentUser.data.user.accounts.length || this.props.accountStore.accountTypeCreated) {
      let selectedAccType = '';
      if (currentUser.data.user.accounts.length) {
        selectedAccType = currentUser.data.user.accounts[0].accountType;
      } else {
        selectedAccType = this.props.accountStore.accountTypeCreated;
      }
      const type = this.props.accountStore.getAccountTypeIndex(selectedAccType);
      linkPath = `${selectedAccType}/AccountCreation`;
      this.props.accountStore.setAccountType(type);
    }

    if (isUserVerified) {
      stepinfo = {
        value: 'Welcome to NextSeed!',
        label: 'Would you like to start the process of new account creation?',
        linkText: 'Let`s start it!',
        linkPath,
      };
    }

    return (
      <Aux>
        <PrivateLayout
          {...this.props}
          P5={
            <StickyNotification
              stepinfo={stepinfo}
              setDashboardWizardSetup={this.setDashboardWizardSetup}
            />
          }
        >
          {!isUserVerified &&
            <div>
              <Header as="h3">Welcome to NextSeed!</Header>
              <Grid>
                <Grid.Row>
                  <Grid.Column widescreen={5} largeScreen={8} computer={8} tablet={16} mobile={16}>
                    <Card fluid raised className="welcome-card">
                      <Card.Content>
                        <List divided relaxed="very">
                          <List.Item>
                            <List.Icon className="ns-nextseed-icon" size="huge" verticalAlign="middle" />
                            <List.Content verticalAlign="middle">
                              <List.Header>
                                Would you like to start the process of new account creation?
                              </List.Header>
                            </List.Content>
                          </List.Item>
                        </List>
                        <Divider hidden />
                        <AccountSetupChecklist
                          setDashboardWizardSetup={this.setDashboardWizardSetup}
                        />
                      </Card.Content>
                    </Card>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </div>
          }
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
