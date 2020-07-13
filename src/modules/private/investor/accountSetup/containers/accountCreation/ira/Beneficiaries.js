import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Divider } from 'semantic-ui-react';
import { FormRadioGroup } from '../../../../../../../theme/form';
// import Beneficiary from './Beneficiary';

const DesignateBeneficiaries = ({ isMobile, DESIGNATE_BENEFICIARY_FRM, handleStepChange }) => (
  <div>
    <Header as="h4">Do you want to designate benficiaries ?</Header>
    {!isMobile && <Divider hidden />}
    <Form error>
      <FormRadioGroup
        inline
        fielddata={DESIGNATE_BENEFICIARY_FRM.fields.step1}
        name="step1"
        changed={(e, result) => handleStepChange(e, result, 'DESIGNATE_BENEFICIARY_FRM')}
        containerclassname="three wide button-radio center-align"
      />
    </Form>
  </div>
);

const ConfirmDesignatedBeneficiaries = ({ isMobile, DESIGNATE_BENEFICIARY_FRM, handleStepChange }) => (
  <div>
    <Header as="h4">Do you want to designate benficiaries ?</Header>
    {!isMobile && <Divider hidden />}
    <p className="mt-10 mb-10"> Please confirm your choice after selecting</p>
    <Form error>
      <FormRadioGroup
        inline
        fielddata={DESIGNATE_BENEFICIARY_FRM.fields.step2}
        name="step2"
        changed={(e, result) => handleStepChange(e, result, 'DESIGNATE_BENEFICIARY_FRM')}
        containerclassname="three wide button-radio center-align"
      />
    </Form>
  </div>
);

@inject('uiStore', 'iraAccountStore')
@observer
export default class Beneficiaries extends Component {
  // eslint-disable-next-line consistent-return

  handleStepChange = (e, result, formName) => {
    e.preventDefault();
    const { formChange, incrementNestedSteps } = this.props.iraAccountStore;
    formChange(e, result, formName);
    incrementNestedSteps();
  }

  render() {
    const { responsiveVars } = this.props.uiStore;
    const { DESIGNATE_BENEFICIARY_FRM, currentNestedStep } = this.props.iraAccountStore;

    const nestedSteps = [
      {
        component: <DesignateBeneficiaries isMobile={responsiveVars.isMobile} DESIGNATE_BENEFICIARY_FRM={DESIGNATE_BENEFICIARY_FRM} handleStepChange={this.handleStepChange} />,
        step: 0,
      },
      {
        component: <ConfirmDesignatedBeneficiaries isMobile={responsiveVars.isMobile} DESIGNATE_BENEFICIARY_FRM={DESIGNATE_BENEFICIARY_FRM} handleStepChange={this.handleStepChange} />,
        step: 1,
      },
    ];
    const currentStep = nestedSteps.find(s => s.step === currentNestedStep);
    return currentStep.component;
  }
}
