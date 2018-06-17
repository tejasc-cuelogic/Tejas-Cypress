/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import _ from 'lodash';
import { Grid, Card, Header, Icon, Responsive, Divider, List, Button } from 'semantic-ui-react';

import PrivateLayout from '../../../containers/common/PrivateHOC';
import PageHeaderSection from '../../../theme/common/PageHeaderSection';
import StickyNotification from '../components/StickyNotification';
import AccountSetupChecklist from '../components/AccountSetupChecklist';
import InvestorPersonalDetails from '../containers/InvestorPersonalDetails';
import DashboardWizard from './DashboardWizard';
import Spinner from '../../../theme/ui/Spinner';

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
      this.props.individualAccountStore.setStepToBeRendered(0);
      this.props.accountStore.setBankLinkInterface('list');
    }
  }

  isVerified(cipStatus) {
    let checkStatus = '';
    if (cipStatus !== null) {
      if (typeof cipStatus === 'object') {
        checkStatus = cipStatus.status;
      } else {
        checkStatus = cipStatus;
      }
      return this.props.accountStore.validAccStatus.includes(checkStatus);
    }
    return false;
  }

  navToAccTypes(step) {
    let type = 0;
    if (step === 'individual') {
      type = 0;
    } else if (step === 'ira') {
      type = 1;
    } else if (step === 'entity') {
      type = 2;
    }
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
      console.log(accDetails, 'accDetails');
      if (accDetails.activeAccounts.length > 0) {
        accTypes = _.filter(
          accTypes,
          n => _.lowerCase(n) !== (accDetails.activeAccounts[0]),
        );
        return (
          <Aux>
            <PrivateLayout
              {...this.props}
            >
              <div className="conent-spacer">
                <Card.Group itemsPerRow={3}>
                  {
                    accTypes.map(item => (
                      <Card fluid>
                        <Card.Content>
                          <Header as="h3">New {_.startCase(item)} Account</Header>
                          <p>Start new application process to proceed</p>
                          <Divider hidden />
                          <Button onClick={() => this.navToAccTypes(_.lowerCase(item))} primary>
                            Create {_.startCase(item)} Account
                          </Button>
                        </Card.Content>
                      </Card>
                    ))
                  }
                </Card.Group>
              </div>
            </PrivateLayout>
            {this.props.uiStore.dashboardStep &&
            <DashboardWizard />
            }
          </Aux>
        );
      }
    }

    const { currentUser } = this.props.userDetailsStore;
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
      let type = 0;
      if (selectedAccType === 'individual') {
        type = 0;
      } else if (selectedAccType === 'ira') {
        type = 1;
      } else if (selectedAccType === 'entity') {
        type = 2;
      }
      linkPath = `${selectedAccType}/AccountCreation`;
      this.props.accountStore.setAccountType(type);
    }

    if (this.props.profileStore.verifyIdentity01.response.message) {
      if (this.isVerified(this.props.profileStore.verifyIdentity01.response.message)) {
        stepinfo = {
          value: 'Welcome to NextSeed!',
          label: 'Would you like to start the process of new account creation?',
          linkText: 'Let`s start it!',
          linkPath,
        };
      }
    } else if (this.isVerified(currentUser.data.user.legalDetails.cipStatus)) {
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
          {this.props.profileStore.verifyIdentity01.response.message &&
          !this.isVerified(this.props.profileStore.verifyIdentity01.response.message) &&
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
          {!this.props.profileStore.verifyIdentity01.response.message &&
          !this.isVerified(currentUser.data.user.legalDetails.cipStatus) &&
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
