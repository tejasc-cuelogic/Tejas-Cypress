/* eslint-disable no-unused-vars, prefer-const */
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
import ProgressCard from '../components/ProgressCard';

@inject('uiStore', 'profileStore', 'accountStore', 'userDetailsStore')
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

  verifyStep = (step) => {
    if (step) {
      this.setDashboardWizardSetup(step);
    }
  }

  verifyPhoneNumber = () => {
    this.props.profileStore.startPhoneVerification().then(() => {
      this.setDashboardWizardSetup('ConfirmPhoneNumber');
    })
      .catch(() => { });
  }

  restoreStep = () => {
    if (this.props.accountStore.accountType.activeIndex === 0) {
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
    const { signupStatus } = this.props.userDetailsStore;

    let accTypes = ['individual', 'IRA', 'entity'];

    const progressMeta = {
      'envelope-line': { label: 'Email-address', action: false },
      'contact-card': { label: 'Identity', action: 'InvestorPersonalDetails' },
      'phone-line': { label: 'phone number', action: 'ConfirmPhoneNumber' },
      'bar-line-chart': { label: 'You have no account yet', action: false },
      'chart-setting': {
        label: 'Start creation process of another type of account',
        action: false,
      },
    };

    console.log(signupStatus);

    return (
      <Aux>
        <PrivateLayout
          {...this.props}
          P5={!signupStatus.finalStatus ?
            <StickyNotification
              stepinfo={stepinfo}
              setDashboardWizardSetup={this.setDashboardWizardSetup}
            /> : null
          }
        >
          <ProgressCard
            action={this.verifyStep}
            metaData={progressMeta}
            signupStatus={signupStatus}
          />
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
