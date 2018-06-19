import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import _ from 'lodash';
import { Card, Header, Icon, Button } from 'semantic-ui-react';

import PrivateLayout from '../../../containers/common/PrivateHOC';
import StickyNotification from '../components/StickyNotification';
import InvestorPersonalDetails from '../containers/InvestorPersonalDetails';
import DashboardWizard from './DashboardWizard';
import OtherAccountTypes from '../components/OtherAccountTypes';

@inject('uiStore', 'profileStore', 'entityAccountStore', 'iraAccountStore', 'accountStore', 'userStore', 'userDetailsStore', 'individualAccountStore')
@observer
class Summary extends Component {
  componentWillMount() {
    this.props.userDetailsStore.setUserAccDetails();
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
    const stepinfo = {
      value: 'Verify your identity',
      label: 'Complete all required information about yourself',
      linkText: 'Verify me',
      linkPath: 'InvestorPersonalDetails',
    };

    const { getStepStatus } = this.props.userDetailsStore;

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
          <Header as="h3">Progress of verifying your identity</Header>
          <Card.Group stackable itemsPerRow={3}>
            <Card fluid className="verification done">
              <Card.Content>
                <Icon.Group size="huge">
                  <Icon className="ns-envelope-line" />
                  <Icon corner color="green" className="ns-check-circle" />
                </Icon.Group>
                <p>Your <b>Email-addres</b> has been verified</p>
              </Card.Content>
            </Card>
            <Card fluid className="verification">
              <Card.Content>
                <Icon.Group size="huge">
                  <Icon className="ns-contact-card" />
                  <Icon corner color={getStepStatus('idVerification') === 'done' ? 'green' : 'red'} className={getStepStatus('idVerification') === 'done' ? 'ns-check-circle' : 'ns-warning-circle'} />
                </Icon.Group>
                {getStepStatus('idVerification') === 'done' ?
                  <p><b>Your identity has been verified</b></p> :
                  <div>
                    <p><b>Please verify your Identity</b></p>
                    <Button color="green" className="relaxed" content="Verify" onClick={() => this.setDashboardWizardSetup('InvestorPersonalDetails')} />
                  </div>
                }
              </Card.Content>
            </Card>
            <Card fluid className={getStepStatus('phoneVerification') === 'disable' ? 'verification disabled' : 'verification'}>
              <Card.Content>
                <Icon.Group size="huge">
                  <Icon className="ns-phone-line" />
                </Icon.Group>
                {getStepStatus('phoneVerification') === 'done' ?
                  <p><b>Your phone number has been verified</b></p> :
                  <div>
                    <p><b>Please verify your phone number</b></p>
                    <Button color="green" className="relaxed" disabled={getStepStatus('phoneVerification') === 'disable'} content="Verify" />
                  </div>
                }
              </Card.Content>
            </Card>
            <Card fluid className="verification">
              <Card.Content>
                <Icon.Group size="huge">
                  <Icon className="ns-bar-line-chart" />
                </Icon.Group>
                <p><b>You have no account yet</b></p>
                <Button color="green" content="Create your first investment account" />
              </Card.Content>
            </Card>
            <Card fluid className="verification disabled">
              <Card.Content>
                <Icon.Group size="huge">
                  <Icon className="ns-chart-setting" />
                </Icon.Group>
                <p><b>Start creation process of another type of account</b></p>
                <Button inverted color="green" content="Create another account" />
              </Card.Content>
            </Card>
          </Card.Group>
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
