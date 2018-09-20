import React, { Component } from 'react';
import Aux from 'react-aux';
import { Header, Form, Divider, Button, Icon } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FormTextarea, FormCheckbox } from '../../../../../../../theme/form';

@inject('offeringCreationStore', 'userStore')
@observer
export default class Issuer extends Component {
  render() {
    const { ISSUER_FRM, formChange } = this.props.offeringCreationStore;
    const { roles } = this.props.userStore.currentUser;
    const formName = 'ISSUER_FRM';
    return (
      <Form >
        {
          ['issuerDiligence', 'certificateFormation', 'operatingAgreement', 'evidenceGoodStanding', 'executiveTeam'].map(field => (
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
          ['bac1', 'bac2', 'bac3', 'bac4', 'bac5', 'bac6', 'bac7', 'bac8'].map(field => (
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
          ['ofac', 'civilLawsuit', 'judgements', 'onlineReputation'].map(field => (
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
          ['isControlDiligence', 'isAffiliatedDiligence'].map(field => (
            <FormCheckbox
              fielddata={ISSUER_FRM.fields[field]}
              name={field}
              changed={(e, result) => formChange(e, result, formName)}
              defaults
              containerclassname="ui relaxed list"
            />
          ))
        }
        <Button secondary content="Submit for Approval" floated="right" disabled={!ISSUER_FRM.meta.isValid} />
        <Button.Group floated="right">
          {roles && (roles.includes('admin') || roles.includes('support')) &&
            <Button color="gray" content="Awaiting Manager Approval" disabled={!ISSUER_FRM.meta.isValid} />
          }
          {roles && (roles.includes('admin') || roles.includes('manager')) &&
          <Aux>
            <Button inverted color="red" content="Decline" disabled={!ISSUER_FRM.meta.isValid} />
            <Button secondary content="Generate Report" disabled={!ISSUER_FRM.meta.isValid} />
            <Button primary color="green" content="Approve" disabled={!ISSUER_FRM.meta.isValid} />
          </Aux>
          }
        </Button.Group>
        <div className="clearfix mb-20">
          <Button.Group floated="right">
            <Button color="green" content="Generate Report" disabled={!ISSUER_FRM.meta.isValid} />
            <Button as="span" className="time-stamp">
              <Icon className="ns-check-circle" color="green" />
              Approved by Manager on 2/3/2018
            </Button>
          </Button.Group>
        </div>
      </Form>
    );
  }
}
