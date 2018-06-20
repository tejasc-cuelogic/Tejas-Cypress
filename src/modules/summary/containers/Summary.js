import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Message } from 'semantic-ui-react';

import PrivateLayout from '../../../containers/common/PrivateHOC';
import StickyNotification from '../components/StickyNotification';
import InvestorPersonalDetails from '../containers/InvestorPersonalDetails';
import DashboardWizard from './DashboardWizard';
import ProgressCard from '../components/ProgressCard';
import ListErrors from '../../../theme/common/ListErrors';

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
      if (step === 'ConfirmPhoneNumber') {
        this.props.profileStore.startPhoneVerification().then(() => {
          this.setDashboardWizardSetup(step);
        }).catch((err) => {
          this.props.uiStore.setErrors(JSON.stringify(err.message));
        });
      } else {
        this.setDashboardWizardSetup(step);
      }
    }
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
    const { getStepStatus } = this.props.userDetailsStore;
    const { signupStatus } = this.props.userDetailsStore;
    const { errors } = this.props.uiStore;

    const progressMeta = {
      'envelope-line': { label: 'Email-address', action: false },
      'contact-card': { label: 'Identity', action: 'InvestorPersonalDetails' },
      'phone-line': { label: 'phone number', action: 'ConfirmPhoneNumber' },
    };

    return (
      <Aux>
        <PrivateLayout
          {...this.props}
          P5={!signupStatus.finalStatus ?
            <StickyNotification
              signupStatus={signupStatus}
            /> : null
          }
        >
          {errors &&
            <Message error>
              <ListErrors errors={[errors]} />
            </Message>
          }
          <ProgressCard
            action={this.verifyStep}
            metaData={progressMeta}
            signupStatus={signupStatus}
            getStepStatus={getStepStatus}
            navToAccTypes={this.navToAccTypes}
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
