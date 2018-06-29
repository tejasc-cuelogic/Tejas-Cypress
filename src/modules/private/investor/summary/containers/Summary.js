import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import Aux from 'react-aux';
import { Message } from 'semantic-ui-react';

import PrivateLayout from '../../../../../containers/common/PrivateHOC';
import StickyNotification from '../components/StickyNotification';
import InvestorPersonalDetails from '../containers/InvestorPersonalDetails';
import DashboardWizard from './DashboardWizard';
import ProgressCard from '../components/ProgressCard';
import { ListErrors } from '../../../../../theme/shared';

@inject('uiStore', 'profileStore', 'accountStore', 'userDetailsStore')
@observer
class Summary extends Component {
  componentWillMount() {
    this.props.userDetailsStore.setUserAccDetails();
    const validPanes = [];
    const { inActiveAccounts } = this.props.userDetailsStore.signupStatus;
    const accTypesValues = this.props.accountStore.investmentAccTypes.fields.accType.values;
    inActiveAccounts.map((key) => {
      const acc = _.find(accTypesValues, { accType: key });
      if (acc) {
        validPanes.push(acc);
      }
      return validPanes;
    });
    if (inActiveAccounts.length !== 3) {
      this.props.accountStore.setInvestmentAccTypeValues(validPanes);
    }
  }

  setDashboardWizardSetup = (step) => {
    this.props.uiStore.setDashboardWizardStep(step);
    this.restoreStep();
  }

  handleAccoutTypeChange = (e, { value }) => {
    this.props.accountStore.setInvestmentAccType(value);
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
    this.props.accountStore.setInvestmentAccType(type);
    this.setDashboardWizardSetup(`${step}/AccountCreation`);
  }

  render() {
    const { getStepStatus, currentUser, signupStatus } = this.props.userDetailsStore;
    const { errors } = this.props.uiStore;
    const { investmentAccTypes } = this.props.accountStore;

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
          {!(currentUser.data && currentUser.data.user) ? 'Loading..' : (
            <ProgressCard
              action={this.verifyStep}
              metaData={progressMeta}
              signupStatus={signupStatus}
              getStepStatus={getStepStatus}
              navToAccTypes={this.navToAccTypes}
            />
          )
          }
        </PrivateLayout>
        {this.props.uiStore.dashboardStep &&
        <DashboardWizard
          handleAccoutTypeChange={this.handleAccoutTypeChange}
          routeOnInvestmentTypeSelection={this.props.accountStore.routeOnInvestmentTypeSelection}
          selectedInvestmentType={this.props.accountStore.accountType}
          investmentAccTypes={investmentAccTypes}
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
