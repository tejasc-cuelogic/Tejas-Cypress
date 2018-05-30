/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import _ from 'lodash';
import { Grid, Card, Header, Icon, Responsive, Divider, List } from 'semantic-ui-react';

import PrivateLayout from '../../../containers/common/PrivateHOC';
import PageHeaderSection from '../../../theme/common/PageHeaderSection';
import StickyNotification from '../components/StickyNotification';
import AccountSetupChecklist from '../components/AccountSetupChecklist';
import InvestorPersonalDetails from '../containers/InvestorPersonalDetails';
import DashboardWizard from './DashboardWizard';
import Spinner from '../../../theme/ui/Spinner';

@inject('uiStore', 'userStore', 'accountStore', 'userDetailsStore', 'individualAccountStore', 'iraAccountStore')
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

  render() {
    const stepinfo = {
      value: 'Verify your identity',
      label: 'Complete all required information about yourself',
      linkText: 'Verify me',
      linkPath: 'InvestorPersonalDetails',
    };
    if (!this.props.userDetailsStore.currentUser) {
      return (
        <div>
          <Spinner loaderMessage="Loading..." />
        </div>
      );
    }

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
