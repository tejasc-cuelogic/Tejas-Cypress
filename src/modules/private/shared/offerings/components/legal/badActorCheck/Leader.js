import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Header, Form, Divider } from 'semantic-ui-react';
import { FormTextarea } from '../../../../../../../theme/form';
import ButtonGroupType2 from '../../ButtonGroupType2';
import { InlineLoader } from '../../../../../../../theme/shared';

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
  handleSubmitIssuer = (leaderId, approved) => {
    const {
      createOrUpdateOfferingBac,
      LEADER_FRM,
    } = this.props.offeringCreationStore;
    const leaderNumber = this.props.index;
    createOrUpdateOfferingBac('LEADERSHIP', LEADER_FRM.fields, undefined, leaderNumber, leaderId, approved);
  }
  render() {
    const {
      LEADER_FRM,
      formArrayChange,
      leaderShipOfferingBac,
    } = this.props.offeringCreationStore;
    const issuerNumber = this.props.index;
    const index = issuerNumber || 0;
    const formName = 'LEADER_FRM';
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    const { match } = this.props;
    const { isIssuer } = this.props.userStore;
    const isApproved = false;
    const isSubmitted = false;
    const isReadonly = isApproved;
    let leaderId = '';
    if (leaderShipOfferingBac.loading) {
      return <InlineLoader />;
    }
    leaderId = LEADER_FRM.fields.getOfferingBac[index].id.value;
    return (
      <Form className={!isIssuer || (isIssuer && match.url.includes('offering-creation')) ? 'mt-20' : 'inner-content-spacer'}>
        <Header as="h4">Control Person Diligence</Header>
        {
          ['controlPersonQuestionnaire', 'residenceTenYears'].map(field => (
            <Aux>
              <FormTextarea
                readOnly={isReadonly}
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
              readOnly={isReadonly}
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
              readOnly={isReadonly}
              key={field}
              name={field}
              fielddata={LEADER_FRM.fields.getOfferingBac[index][field]}
              changed={(e, result) => formArrayChange(e, result, formName, 'getOfferingBac', index)}
              containerclassname="secondary"
            />
          ))
        }
        <Divider hidden />
        <ButtonGroupType2
          isSubmitted={isSubmitted}
          isManager={access.asManager}
          formValid={LEADER_FRM.meta.isValid}
          isApproved={isApproved}
          updateFunction={approved => this.handleSubmitIssuer(leaderId, approved)}
        />
      </Form>
    );
  }
}
