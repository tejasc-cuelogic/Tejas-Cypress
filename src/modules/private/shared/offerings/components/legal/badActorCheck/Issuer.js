import React, { Component } from 'react';
import Aux from 'react-aux';
import { Header, Form, Divider } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FormTextarea, FormCheckbox } from '../../../../../../../theme/form';
import { InlineLoader } from '../../../../../../../theme/shared';
import ButtonGroupType2 from '../../ButtonGroupType2';

@inject('offeringCreationStore', 'userStore')
@observer
export default class Issuer extends Component {
  componentWillMount() {
    const {
      getOfferingBac,
      currentOfferingId,
    } = this.props.offeringCreationStore;
    getOfferingBac(currentOfferingId, 'ISSUER');
  }
  handleSubmitIssuer = (isApproved = null) => {
    const {
      createOrUpdateOfferingBac,
      ISSUER_FRM,
    } = this.props.offeringCreationStore;
    createOrUpdateOfferingBac('ISSUER', ISSUER_FRM.fields, undefined, undefined, undefined, isApproved);
  }
  render() {
    const {
      ISSUER_FRM, formChange, issuerOfferingBacData, issuerOfferingBac,
    } = this.props.offeringCreationStore;
    const formName = 'ISSUER_FRM';
    const { isIssuer } = this.props.userStore;
    const { match } = this.props;
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    const isManager = access.asManager;
    const submitted = (issuerOfferingBacData && issuerOfferingBacData.length &&
      issuerOfferingBacData[0].submitted) ? issuerOfferingBacData[0].submitted : null;
    const approved = (issuerOfferingBacData && issuerOfferingBacData.length &&
      issuerOfferingBacData[0].approved) ? issuerOfferingBacData[0].approved : null;
    const isReadonly = ((submitted && !isManager) || (isManager && approved && approved.status));

    if (issuerOfferingBac && issuerOfferingBac.loading) {
      return <InlineLoader />;
    }

    return (
      <div className={!isIssuer || (isIssuer && match.url.includes('offering-creation')) ? '' : 'ui card fluid form-card'}>
        <Form>
          {
            ['issuerDiligence', 'certificateFormation', 'operatingAgreement', 'evidenceGoodStanding', 'executiveTeam'].map(field => (
              <Aux>
                {field === 'issuerDiligence' &&
                  <Header as="h4">{ISSUER_FRM.fields[field].label}</Header>
                }
                <FormTextarea
                  readOnly={isReadonly}
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
                readOnly={isReadonly}
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
                readOnly={isReadonly}
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
                disabled={isReadonly}
                fielddata={ISSUER_FRM.fields[field]}
                name={field}
                changed={(e, result) => formChange(e, result, formName, false)}
                defaults
                containerclassname="ui relaxed list"
              />
            ))
          }
          <Divider hidden />
          <ButtonGroupType2
            submitted={submitted}
            isManager={access.asManager}
            formValid={ISSUER_FRM.meta.isValid}
            approved={approved}
            updateOffer={this.handleSubmitIssuer}
          />
        </Form>
      </div>
    );
  }
}
