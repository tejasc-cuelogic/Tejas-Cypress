import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { MultiStep } from '../../../../../../helper';
import Employment from './Employment';
import BrokerageEmployment from './BrokerageEmployment';
import PublicCompanyRelations from './PublicCompanyRel';
import Overview from './overview';
import Finances from './Finances';
import Experience from './Experience';

@inject('uiStore', 'investorProfileStore', 'userDetailsStore', 'userStore')
@withRouter
@observer
export default class AccountCreation extends React.Component {
  componentWillMount() {
    this.props.userDetailsStore.setUserAccDetails();
  }
  handleMultiStepModalclose = () => {
    if (this.props.refUrl) {
      this.props.history.push(this.props.refUrl);
    } else {
      this.props.history.push('/app/summary');
    }
    this.props.userDetailsStore.getUser(this.props.userStore.currentUser.sub);
  }
  handleStepChange = (step) => {
    this.props.investorProfileStore.setStepToBeRendered(step);
  }
  render() {
    const {
      inProgress,
      isEnterPressed,
      resetIsEnterPressed,
      setIsEnterPressed,
      errors,
    } = this.props.uiStore;
    const {
      INVESTMENT_EXP_FORM,
      EMPLOYMENT_FORM,
      BROKERAGE_EMPLOYMENT_FORM,
      FINANCES_FORM,
      updateInvestorProfileData,
      PUBLIC_COMPANY_REL_FORM,
      stepToBeRendered,
    } = this.props.investorProfileStore;
    const steps =
    [
      {
        name: 'Overview',
        component: <Overview />,
        isValid: false,
        isDirty: false,
        form: '',
        stepToBeRendered: 1,
        disablePrevButton: true,
        disableNextButton: true,
      },
      {
        name: 'Employment Status',
        component: <Employment />,
        isValid: (EMPLOYMENT_FORM.meta.isValid && !errors) ? '' : stepToBeRendered > 1 ? 'error' : '',
        isDirty: EMPLOYMENT_FORM.meta.isDirty,
        form: 'EMPLOYMENT_FORM',
        stepToBeRendered: 2,
      },
      {
        name: 'Brokerage Employment',
        component: <BrokerageEmployment />,
        isValid: (BROKERAGE_EMPLOYMENT_FORM.meta.isValid && !errors) ? '' : stepToBeRendered > 2 ? 'error' : '',
        isDirty: BROKERAGE_EMPLOYMENT_FORM.meta.isDirty,
        form: 'BROKERAGE_EMPLOYMENT_FORM',
        stepToBeRendered: 3,
      },
      {
        name: 'Public Company Relations',
        component: <PublicCompanyRelations />,
        isValid: (PUBLIC_COMPANY_REL_FORM.meta.isValid && !errors) ? '' : stepToBeRendered > 3 ? 'error' : '',
        isDirty: PUBLIC_COMPANY_REL_FORM.meta.isDirty,
        form: 'PUBLIC_COMPANY_REL_FORM',
        stepToBeRendered: 4,
      },
      {
        name: 'Financial Information',
        component: <Finances />,
        isValid: (FINANCES_FORM.meta.isValid && !errors) ? '' : stepToBeRendered > 4 ? 'error' : '',
        isDirty: FINANCES_FORM.meta.isDirty,
        form: 'FINANCES_FORM',
        stepToBeRendered: 5,
      },
      {
        name: 'Investment Experience',
        component: <Experience />,
        isValid: (INVESTMENT_EXP_FORM.meta.isValid && !errors) ? '' : stepToBeRendered > 5 ? 'error' : '',
        isDirty: INVESTMENT_EXP_FORM.meta.isDirty,
        form: 'INVESTMENT_EXP_FORM',
        stepToBeRendered: 5,
        disableNextButton: true,
      },
    ];

    return (

      <div className="step-progress">
        <MultiStep setIsEnterPressed={setIsEnterPressed} isEnterPressed={isEnterPressed} resetEnterPressed={resetIsEnterPressed} setStepTobeRendered={this.handleStepChange} stepToBeRendered={stepToBeRendered} createAccount={updateInvestorProfileData} inProgress={inProgress} steps={steps} formTitle="Complete your investor profile" handleMultiStepModalclose={this.handleMultiStepModalclose} />
      </div>
    );
  }
}
