import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Header, Form, Divider, Button, Icon } from 'semantic-ui-react';
import { FormTextarea } from '../../../../../../../theme/form';

@inject('offeringCreationStore')
@observer
export default class Leader extends Component {
  render() {
    const { LEADER_FRM, formChangeWithIndex } = this.props.offeringCreationStore;
    const issuerNumber = this.props.index;
    const index = issuerNumber || 0;
    const formName = 'LEADER_FRM';
    return (
      <Form>
        <Header as="h4" textAlign="left">
          Control Person Diligence
        </Header>
        {
          ['controlPersonQuestionnaire', 'countriesAndStateForResidence'].map(field => (
            <Aux>
              <FormTextarea
                key={field}
                name={field}
                fielddata={LEADER_FRM.fields.data[index][field]}
                changed={(e, result) => formChangeWithIndex(e, result, formName, index)}
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
              fielddata={LEADER_FRM.fields.data[index][field]}
              changed={(e, result) => formChangeWithIndex(e, result, formName, index)}
              containerclassname="secondary"
            />
          ))
        }
        <Divider section />
        <Header as="h4" textAlign="left">
          Additional Disclosure Check
        </Header>
        {
          ['sanctionsListSearch', 'noPendingCivilLawSuit', 'generalOnlineReputationSearch'].map(field => (
            <FormTextarea
              key={field}
              name={field}
              fielddata={LEADER_FRM.fields.data[index][field]}
              changed={(e, result) => formChangeWithIndex(e, result, formName, index)}
              containerclassname="secondary"
            />
          ))
        }
        <Button secondary className="relaxed" disabled={!LEADER_FRM.meta.isValid} >Submit for Approval</Button>
        <Button.Group floated="right">
          <Button inverted color="red" content="Decline" disabled={!LEADER_FRM.meta.isValid} >Decline</Button>
          <Button secondary className="relaxed" disabled={!LEADER_FRM.meta.isValid} >Generate Report</Button>
          <Button primary color="green" className="relaxed" disabled={!LEADER_FRM.meta.isValid} >Approve</Button>
        </Button.Group>
        <div className="clearfix mb-20">
          <Button.Group floated="right">
            <Button color="green" className="relaxed" disabled={!LEADER_FRM.meta.isValid} >Generate Report</Button>
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
