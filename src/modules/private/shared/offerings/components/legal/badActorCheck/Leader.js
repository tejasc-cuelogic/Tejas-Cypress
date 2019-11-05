import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import { Header, Form, Divider } from 'semantic-ui-react';
import { FormTextarea } from '../../../../../../../theme/form';
import ButtonGroupType2 from '../../ButtonGroupType2';
import { InlineLoader } from '../../../../../../../theme/shared';

@inject('offeringCreationStore', 'userStore', 'uiStore', 'offeringsStore')
@observer
export default class Leader extends Component {
  constructor(props) {
    super(props);
    const {
      getLeadershipOfferingBac,
      currentOfferingId,
    } = this.props.offeringCreationStore;
    getLeadershipOfferingBac(currentOfferingId, 'LEADERSHIP');
  }

  handleSubmitIssuer = (leaderId, approved, index = null, issuerNumber = null) => {
    const {
      createOrUpdateOfferingBac,
      LEADER_FRM,
    } = this.props.offeringCreationStore;
    const leaderNumber = index;
    createOrUpdateOfferingBac('LEADERSHIP', LEADER_FRM.fields, undefined, leaderNumber, leaderId, approved, issuerNumber);
  }

  render() {
    const {
      LEADER_FRM,
      formArrayChange,
      leaderShipOfferingBac,
      leaderShipOfferingBacData,
    } = this.props.offeringCreationStore;
    const issuerNumber = this.props.index;
    let index = issuerNumber || 0;
    const formName = 'LEADER_FRM';
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    const { match, offeringsStore, bacId, leadership } = this.props;
    const { offer } = offeringsStore;
    if (leadership) {
      const id = bacId || '';
      const bacIndex = LEADER_FRM.fields.getOfferingBac.findIndex(b => id === b.id.value);
      index = bacIndex;
    }
    const { isIssuer } = this.props.userStore;
    const isManager = access.asManager;
    const submitted = (leaderShipOfferingBacData && leaderShipOfferingBacData.length
      && leaderShipOfferingBacData[index] && leaderShipOfferingBacData[index].submitted)
      ? leaderShipOfferingBacData[index].submitted : null;
    const approved = (leaderShipOfferingBacData && leaderShipOfferingBacData.length
      && leaderShipOfferingBacData[index] && leaderShipOfferingBacData[index].approved)
      ? leaderShipOfferingBacData[index].approved : null;
    const isReadonly = ((submitted && !isManager) || (isManager && approved && approved.status));
    let leaderId = '';
    if (leaderShipOfferingBac.loading || this.props.uiStore.inProgressArray.includes('getLeadershipOfferingBac')) {
      return <InlineLoader />;
    }
    const otherEntities = LEADER_FRM.fields.getOfferingBac[index].otherEntities.value === '' ? get(offer, `leadership[${index}].otherEntities`) : false;
    leaderId = LEADER_FRM.fields.getOfferingBac[index].id.value;
    return (
      <Form className={!isIssuer || (isIssuer && match.url.includes('offering-creation')) ? 'mt-20' : 'inner-content-spacer'}>
        <Header as="h4">Control Person Diligence</Header>
        {
          ['otherEntities', 'controlPersonQuestionnaire', 'residenceTenYears'].map(field => (
            <>
              <FormTextarea
                readOnly={isReadonly}
                key={field}
                name={field}
                defaultValue={(field === 'otherEntities' ? otherEntities : false)}
                fielddata={LEADER_FRM.fields.getOfferingBac[index][field]}
                changed={(e, result) => formArrayChange(e, result, formName, 'getOfferingBac', index)}
                containerclassname="secondary"
              />
            </>
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
          submitted={submitted}
          isManager={access.asManager}
          formValid={LEADER_FRM.meta.isValid}
          approved={approved}
          updateOffer={approved1 => this.handleSubmitIssuer(leaderId, approved1, index, issuerNumber)}
        />
      </Form>
    );
  }
}
