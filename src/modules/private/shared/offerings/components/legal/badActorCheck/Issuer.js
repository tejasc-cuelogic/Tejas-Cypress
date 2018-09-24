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
    const { isIssuer } = this.props.userStore;
    return (
      <div className={isIssuer ? 'ui card fluid form-card' : ''}>
        <Form>
          {
            ['issuerDiligence', 'certificateFormation', 'operatingAgreement', 'evidenceGoodStanding', 'executiveTeam'].map(field => (
              <Aux>
                {field === 'issuerDiligence' &&
                  <Header as="h4">{ISSUER_FRM.fields[field].label}</Header>
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
          <Header as="h4">Regulatory Bad Actor Check</Header>
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
          <Header as="h4">Additional Disclosure Check</Header>
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
          <Divider hidden />
          <div className="clearfix mb-20 right-align">
            <Button secondary content="Submit for Approval" disabled={!ISSUER_FRM.meta.isValid} />
          </div>
          <div className="clearfix mb-20">
            {roles && (roles.includes('admin') || roles.includes('support')) &&
              <Button content="Awaiting Manager Approval" color="gray" disabled={!ISSUER_FRM.meta.isValid} />
            }
            <Button.Group floated="right">
              {roles && (roles.includes('admin') || roles.includes('manager')) &&
              <Aux>
                <Button inverted content="Decline" color="red" disabled={!ISSUER_FRM.meta.isValid} />
                <Button secondary content="Generate Report" disabled={!ISSUER_FRM.meta.isValid} />
                <Button primary content="Approve" color="green" disabled={!ISSUER_FRM.meta.isValid} />
              </Aux>
              }
            </Button.Group>
          </div>
          <div className="clearfix">
            <Button.Group floated="right">
              <Button secondary content="Generate Report" disabled={!ISSUER_FRM.meta.isValid} />
              <Button as="span" className="time-stamp">
                <Icon className="ns-check-circle" color="green" />
                Approved by Manager on 2/3/2018
              </Button>
            </Button.Group>
          </div>
        </Form>
      </div>
    );
  }
}
