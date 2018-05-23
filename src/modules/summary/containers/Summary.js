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

@inject('uiStore', 'userStore', 'accountStore', 'userDetailsStore', 'individualAccountStore')
@observer
class Summary extends Component {
  componentWillMount() {
    this.props.userDetailsStore.getUser(this.props.userStore.currentUser.sub);
  }
  componentDidMount() {
    console.log(this.props.userDetailsStore.currentUser);
    const account = _.find(
      this.props.userDetailsStore.currentUser.data.user.accounts,
      { accountType: 'ira' },
    );
    Object.keys(this.props.iraAccountStore.formFinInfo.fields).map((f) => {
      this.props.iraAccountStore.formFinInfo.fields[f].value = account.accountDetails[f];
      return this.props.iraAccountStore.formFinInfo.fields[f];
    });
    this.props.iraAccountStore.onFieldChange('formFinInfo');
    Object.keys(this.props.iraAccountStore.formFunding.fields).map((f) => {
      if (account.accountDetails[f] === 'check') {
        this.props.iraAccountStore.formFunding.fields[f].value = 0;
      } else if (account.accountDetails[f] === 'iraTransfer') {
        this.props.iraAccountStore.formFunding.fields[f].value = 1;
      } else {
        this.props.iraAccountStore.formFunding.fields[f].value = 2;
      }
      return this.props.iraAccountStore.formFunding.fields[f];
    });
    this.props.iraAccountStore.onFieldChange('formFunding');
    Object.keys(this.props.iraAccountStore.formAccTypes.fields).map((f) => {
      if (account.accountDetails[f] === 'traditional') {
        this.props.iraAccountStore.formAccTypes.fields[f].value = 0;
      } else {
        this.props.iraAccountStore.formAccTypes.fields[f].value = 1;
      }
      return this.props.iraAccountStore.formAccTypes.fields[f];
    });
    this.props.iraAccountStore.onFieldChange('formAccTypes');
    Object.keys(this.props.iraAccountStore.formIdentity.fields).map((f) => {
      this.props.iraAccountStore.formIdentity.fields[f].value = account.accountDetails[f];
      return this.props.iraAccountStore.formIdentity.fields[f];
    });
    this.props.iraAccountStore.onFieldChange('formIdentity');
    console.log(this.props.iraAccountStore.formFinInfo.meta.isValid);
    console.log(this.props.iraAccountStore.formAccTypes.meta.isValid);
    console.log(this.props.iraAccountStore.formIdentity.meta.isValid);
    console.log(this.props.iraAccountStore.formFunding.meta.isValid);
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
      this.props.individualAccountStore.setBankLinkInterface('list');
    }
  }

  render() {
    const stepinfo = {
      value: 'Verify your identity',
      label: 'Complete all required information about yourself',
      linkText: 'Verify me',
      linkPath: 'InvestorPersonalDetails',
    };
    if (!this.props.userDetailsStore.currentUser.data.user) {
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
