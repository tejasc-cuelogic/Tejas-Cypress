import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Header, Form, Divider, Button, Confirm } from 'semantic-ui-react';
import { FormTextarea, FormInput } from '../../../../../../../theme/form';
import ButtonGroupType2 from '../../ButtonGroupType2';

@inject('offeringCreationStore', 'userStore', 'uiStore')
@observer
export default class AfIssuer extends Component {
  addMore = (e, formName) => {
    e.preventDefault();
    this.props.offeringCreationStore.addMore(formName, 'getOfferingBac');
    const { AFFILIATED_ISSUER_FRM } = this.props.offeringCreationStore;
    const issuerCount = AFFILIATED_ISSUER_FRM.fields.getOfferingBac.length;
    this.props.history.push(`${this.props.refLink}/${issuerCount}`);
  }
  toggleConfirmModal = (e, index, formName, afIssuerId) => {
    e.preventDefault();
    this.props.offeringCreationStore.toggleConfirmModal(index, formName);
    this.props.uiStore.setConfirmBox('', afIssuerId);
  }
  removeData = () => {
    const { deleteBac } = this.props.offeringCreationStore;
    const { confirmBox } = this.props.uiStore;
    deleteBac(confirmBox.refId);
    this.props.history.push(`${this.props.refLink}/1`);
    this.props.uiStore.setConfirmBox('');
  }
  handleSubmitIssuer = (id, approved) => {
    const {
      createOrUpdateOfferingBac,
      AFFILIATED_ISSUER_FRM,
    } = this.props.offeringCreationStore;
    const issuerNumber = this.props.index;
    createOrUpdateOfferingBac('AFFILIATED_ISSUER', AFFILIATED_ISSUER_FRM.fields, issuerNumber, undefined, id, approved);
  }

  render() {
    const {
      AFFILIATED_ISSUER_FRM,
      formArrayChange,
      confirmModal,
      affiliatedIssuerOfferingBacData,
    } = this.props.offeringCreationStore;
    const issuerNumber = this.props.index;
    const index = issuerNumber || 0;
    const formName = 'AFFILIATED_ISSUER_FRM';
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    const { match } = this.props;
    const { isIssuer } = this.props.userStore;
    const afIssuerId = AFFILIATED_ISSUER_FRM.fields.getOfferingBac[index].id.value;
    const isManager = access.asManager;
    const submitted = (affiliatedIssuerOfferingBacData && affiliatedIssuerOfferingBacData.length &&
      affiliatedIssuerOfferingBacData[issuerNumber] &&
      affiliatedIssuerOfferingBacData[issuerNumber].submitted) ?
      affiliatedIssuerOfferingBacData[issuerNumber].submitted : null;
    const approved = (affiliatedIssuerOfferingBacData && affiliatedIssuerOfferingBacData.length &&
      affiliatedIssuerOfferingBacData[issuerNumber] &&
      affiliatedIssuerOfferingBacData[issuerNumber].approved) ?
      affiliatedIssuerOfferingBacData[issuerNumber].approved : null;
    const isReadonly = ((submitted && !isManager) || (isManager && approved && approved.status));
    return (
      <Aux>
        <Form className={!isIssuer || (isIssuer && match.url.includes('offering-creation')) ? '' : 'inner-content-spacer'}>
          <div className="clearfix mt-10 mb-10">
            <Button.Group floated="right">
              {AFFILIATED_ISSUER_FRM.fields.getOfferingBac.length !== 1 &&
                <Button color="red" disabled={isReadonly} className="link-button" onClick={e => this.toggleConfirmModal(e, index, formName, afIssuerId)}>Delete Selected Issuer</Button>
              }
              <Button color="blue" disabled={isReadonly} className="link-button" onClick={e => this.addMore(e, formName)}>+ Add Affiliated Issuer</Button>
            </Button.Group>
          </div>
          <FormInput
            displayMode={isReadonly}
            name="legalName"
            fielddata={AFFILIATED_ISSUER_FRM.fields.getOfferingBac[index].legalName}
            changed={(e, result) => formArrayChange(e, result, formName, 'getOfferingBac', index)}
            containerclassname="secondary"
          />
          {
            ['certificateFormation', 'operatingAgreement', 'evidenceGoodStanding', 'executiveTeam'].map(field => (
              <Aux>
                <FormTextarea
                  readOnly={isReadonly}
                  key={field}
                  name={field}
                  fielddata={AFFILIATED_ISSUER_FRM.fields.getOfferingBac[index][field]}
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
                fielddata={AFFILIATED_ISSUER_FRM.fields.getOfferingBac[index][field]}
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
                fielddata={AFFILIATED_ISSUER_FRM.fields.getOfferingBac[index][field]}
                changed={(e, result) => formArrayChange(e, result, formName, 'getOfferingBac', index)}
                containerclassname="secondary"
              />
            ))
          }
          <Divider hidden />
          <ButtonGroupType2
            submitted={submitted}
            isManager={access.asManager}
            formValid={AFFILIATED_ISSUER_FRM.meta.isValid}
            approved={approved}
            updateOffer={approved1 => this.handleSubmitIssuer(afIssuerId, approved1)}
          />
        </Form>
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this issuer?"
          open={confirmModal}
          onCancel={this.toggleConfirmModal}
          onConfirm={() => this.removeData()}
          size="mini"
          className="deletion"
        />
      </Aux>
    );
  }
}

