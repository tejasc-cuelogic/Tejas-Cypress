import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Header, Form, Divider, Button, Icon } from 'semantic-ui-react';
import { FormTextarea } from '../../../../../../../theme/form';

@inject('offeringCreationStore', 'userStore', 'offeringsStore')
@observer
export default class Leader extends Component {
  render() {
    const { LEADER_FRM, formChangeWithIndex } = this.props.offeringCreationStore;
    const issuerNumber = this.props.index;
    const index = issuerNumber || 0;
    const formName = 'LEADER_FRM';
    const { roles } = this.props.userStore.currentUser;
    const { offer } = this.props.offeringsStore;
    return (
      <Form className={offer.stage === 'CREATION' ? 'inner-content-spacer' : 'mt-20'}>
        <Header as="h4">Control Person Diligence</Header>
        {
          ['controlPersonQuestionaire', 'residenceTenYears'].map(field => (
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
        <Header as="h4">Regulatory Bad Actor Check</Header>
        {
          ['bac1', 'bac2', 'bac3', 'bac4', 'bac5', 'bac6', 'bac7', 'bac8'].map(field => (
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
        <Header as="h4">Additional Disclosure Check</Header>
        {
          ['ofac', 'civilLawsuit', 'onlineReputation'].map(field => (
            <FormTextarea
              key={field}
              name={field}
              fielddata={LEADER_FRM.fields.data[index][field]}
              changed={(e, result) => formChangeWithIndex(e, result, formName, index)}
              containerclassname="secondary"
            />
          ))
        }
        <Divider hidden />
        <div className="clearfix mb-20 right-align">
          <Button secondary content="Submit for Approval" disabled={!LEADER_FRM.meta.isValid} />
        </div>
        <div className="clearfix mb-20">
          {roles && (roles.includes('admin') || roles.includes('support')) &&
            <Button color="gray" content="Awaiting Manager Approval" disabled={!LEADER_FRM.meta.isValid} />
          }
          <Button.Group floated="right">
            {roles && (roles.includes('admin') || roles.includes('manager')) &&
            <Aux>
              <Button inverted content="Send Back" color="red" disabled={!LEADER_FRM.meta.isValid} />
              <Button secondary content="Generate Report" disabled={!LEADER_FRM.meta.isValid} />
              <Button primary content="Approve" color="green" disabled={!LEADER_FRM.meta.isValid} />
            </Aux>
            }
          </Button.Group>
        </div>
        <div className="clearfix">
          <Button.Group floated="right">
            <Button secondary content="Generate Report" disabled={!LEADER_FRM.meta.isValid} />
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
