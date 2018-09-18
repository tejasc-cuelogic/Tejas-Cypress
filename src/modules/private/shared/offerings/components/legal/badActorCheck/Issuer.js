import React, { Component } from 'react';
import Aux from 'react-aux';
import { Header, Form, Divider, Button, Icon } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FormTextarea, FormCheckbox } from '../../../../../../../theme/form';

@inject('offeringCreationStore')
@observer
export default class Issuer extends Component {
  render() {
    const { ISSUER_FRM, formChange } = this.props.offeringCreationStore;
    const formName = 'ISSUER_FRM';
    return (
      <Form >
        {
          ['issuerDiligence', 'certificateOfFormation', 'operatingAgreement', 'evidenceOfGoodStanding', 'whoAreThesePeople'].map(field => (
            <Aux>
              {field === 'issuerDiligence' &&
                <Header as="h4" textAlign="left">{ISSUER_FRM.fields[field].label}</Header>
              }
              <FormTextarea
                hidelabel={field === 'issuerDiligence'}
                key={field}
                name={field}
                fielddata={ISSUER_FRM.fields[field]}
                changed={(e, result) => formChange(e, result, formName)}
                containerclassname="secondary"
              />
            </Aux>
          ))
        }
        <Divider section />
        <Header as="h4" textAlign="left">
          Regulatory Bad Actor Check
        </Header>
        {
          ['hasTheIssuer', 'isTheIssuerSubjectTo', 'isAnyCoveredPersonSubjectToAnOrderThree', 'isAnyCoveredPersonSubjectToAnOrderFour',
          'isAnyCoveredPersonSubjectToOrderFive', 'isAnyCoveredPersonSubjectToOrderSix', 'isAnyCoveredPersonSubjectToOrderSeven', 'isAnyCoveredPersonSubjectToOrderEight'].map(field => (
            <FormTextarea
              key={field}
              name={field}
              fielddata={ISSUER_FRM.fields[field]}
              changed={(e, result) => formChange(e, result, formName)}
              containerclassname="secondary"
            />
          ))
        }
        <Divider section />
        <Header as="h4" textAlign="left">
          Additional Disclosure Check
        </Header>
        {
          ['sanctionsListSearch', 'pendingCivilLawsuits', 'pendingLiens', 'generalOnlineReputationSearch'].map(field => (
            <FormTextarea
              key={field}
              name={field}
              fielddata={ISSUER_FRM.fields[field]}
              changed={(e, result) => formChange(e, result, formName)}
              containerclassname="secondary"
            />
          ))
        }
        {
          ['allControlPersonDiligence', 'allAffiliatedIssuerDiligence'].map(field => (
            <FormCheckbox
              fielddata={ISSUER_FRM.fields[field]}
              name={field}
              changed={(e, result) => formChange(e, result, formName)}
              defaults
              containerclassname="ui relaxed list"
            />
          ))
        }
        <Button secondary className="relaxed" disabled={!ISSUER_FRM.meta.isValid} >Submit for Approval</Button>
        <Button.Group floated="right">
          <Button inverted color="red" content="Decline" disabled={!ISSUER_FRM.meta.isValid} >Decline</Button>
          <Button secondary className="relaxed" disabled={!ISSUER_FRM.meta.isValid} >Generate Report</Button>
          <Button primary color="green" className="relaxed" disabled={!ISSUER_FRM.meta.isValid} >Approve</Button>
        </Button.Group>
        <div className="clearfix mb-20">
          <Button.Group floated="right">
            <Button color="green" className="relaxed" disabled={!ISSUER_FRM.meta.isValid} >Generate Report</Button>
          </Button.Group>
          <Button as="span" className="time-stamp">
            <Icon className="ns-check-circle" color="green" />
            Approved by Manager on 2/3/2018
          </Button>
        </div>
      </Form>
    );
  }
}
