import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Header, Form, Divider, Button, Icon } from 'semantic-ui-react';
import { FormTextarea } from '../../../../../../../theme/form';

@inject('offeringCreationStore', 'userStore')
@observer
export default class Leader extends Component {
  componentWillMount() {
    const {
      getLeadershipOfferingBac,
      currentOfferingId,
    } = this.props.offeringCreationStore;
    getLeadershipOfferingBac(currentOfferingId, 'LEADERSHIP');
  }
  handleSubmitIssuer = () => {
    const {
      createOrUpdateOfferingBac,
      LEADER_FRM,
    } = this.props.offeringCreationStore;
    const leaderNumber = this.props.index;
    createOrUpdateOfferingBac('LEADERSHIP', LEADER_FRM.fields, undefined, leaderNumber);
  }
  render() {
    const { LEADER_FRM, formArrayChange } = this.props.offeringCreationStore;
    const issuerNumber = this.props.index;
    const index = issuerNumber || 0;
    const formName = 'LEADER_FRM';
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    const { match } = this.props;
    const { isIssuer } = this.props.userStore;
    return (
      <Form onSubmit={this.handleSubmitIssuer} className={!isIssuer || (isIssuer && match.url.includes('offering-creation')) ? 'mt-20' : 'inner-content-spacer'}>
        <Header as="h4">Control Person Diligence</Header>
        {
          ['controlPersonQuestionnaire', 'residenceTenYears'].map(field => (
            <Aux>
              <FormTextarea
                key={field}
                name={field}
                fielddata={LEADER_FRM.fields.getOfferingBac[index][field]}
                changed={(e, result) => formArrayChange(e, result, formName, 'getOfferingBac', index)}
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
              fielddata={LEADER_FRM.fields.getOfferingBac[index][field]}
              changed={(e, result) => formArrayChange(e, result, formName, 'getOfferingBac', index)}
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
              fielddata={LEADER_FRM.fields.getOfferingBac[index][field]}
              changed={(e, result) => formArrayChange(e, result, formName, 'getOfferingBac', index)}
              containerclassname="secondary"
            />
          ))
        }
        <Divider hidden />
        <div className="clearfix mb-20">
          {access.asManager ?
            <Button.Group floated="right">
              <Button inverted content="Decline" color="red" />
              <Button disabled={!LEADER_FRM.meta.isValid} secondary content="Generate Report" />
              <Button disabled={!LEADER_FRM.meta.isValid} primary content="Approve" color="green" />
            </Button.Group>
            :
            <Aux>
              <div className="clearfix mb-20 right-align">
                <Button secondary content="Submit for Approval" disabled={!LEADER_FRM.meta.isValid} />
              </div>
              {/* <Button
                content="Awaiting Manager Approval"
                color="gray"
                disabled={!LEADER_FRM.meta.isValid}
              /> */}
            </Aux>
            }
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
