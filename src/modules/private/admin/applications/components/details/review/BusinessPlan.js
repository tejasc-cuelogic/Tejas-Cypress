import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Button, Divider } from 'semantic-ui-react';
import { FormTextarea, MaskedInput } from '../../../../../../../theme/form';

@inject('businessAppReviewStore')
@observer
export default class BusinessPlan extends Component {
  render() {
    const {
      BUSINESS_PLAN_FRM,
      businessPlanEleChange,
      businessPlanMaskChange,
    } = this.props.businessAppReviewStore;
    return (
      <div className="inner-content-spacer">
        <Form>
          <FormTextarea
            name="locationFeasibility"
            fielddata={BUSINESS_PLAN_FRM.fields.locationFeasibility}
            changed={businessPlanEleChange}
            containerclassname="secondary"
          />
          <Divider section />
          <FormTextarea
            name="timingOfOperations"
            fielddata={BUSINESS_PLAN_FRM.fields.timingOfOperations}
            changed={businessPlanEleChange}
            containerclassname="secondary"
          />
          <Divider section />
          <FormTextarea
            name="writeupTieToProjections"
            fielddata={BUSINESS_PLAN_FRM.fields.writeupTieToProjections}
            changed={businessPlanEleChange}
            containerclassname="secondary"
          />
          <Divider section />
          <FormTextarea
            name="isPlanAdequate"
            fielddata={BUSINESS_PLAN_FRM.fields.isPlanAdequate}
            changed={businessPlanEleChange}
            containerclassname="secondary"
          />
          <Divider section />
          <MaskedInput
            name="dateOfIncorporation"
            fielddata={BUSINESS_PLAN_FRM.fields.dateOfIncorporation}
            format="##-##-####"
            changed={businessPlanMaskChange}
            dateOfBirth
          />
          <Button.Group className="pull-right">
            <Button disabled={!BUSINESS_PLAN_FRM.meta.isValid} primary size="large" className="very relaxed" >Save</Button>
            <Button disabled={!BUSINESS_PLAN_FRM.meta.isValid} type="button">Approve Review</Button>
          </Button.Group>
        </Form>
      </div>
    );
  }
}
