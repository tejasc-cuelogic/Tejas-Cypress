import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Header, Form, Divider, Button, Icon, Confirm } from 'semantic-ui-react';
import { FormTextarea, FormInput } from '../../../../../../../theme/form';

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
  handleSubmitIssuer = (id) => {
    const {
      createOrUpdateOfferingBac,
      AFFILIATED_ISSUER_FRM,
    } = this.props.offeringCreationStore;
    const issuerNumber = this.props.index;
    createOrUpdateOfferingBac('AFFILIATED_ISSUER', AFFILIATED_ISSUER_FRM.fields, issuerNumber, undefined, id);
  }

  render() {
    const {
      AFFILIATED_ISSUER_FRM,
      formArrayChange,
      confirmModal,
    } = this.props.offeringCreationStore;
    const issuerNumber = this.props.index;
    const index = issuerNumber || 0;
    const formName = 'AFFILIATED_ISSUER_FRM';
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    const { match } = this.props;
    const { isIssuer } = this.props.userStore;
    const afIssuerId = AFFILIATED_ISSUER_FRM.fields.getOfferingBac[index].id.value;
    return (
      <Aux>
        <Form onSubmit={() => this.handleSubmitIssuer(afIssuerId)} className={!isIssuer || (isIssuer && match.url.includes('offering-creation')) ? '' : 'inner-content-spacer'}>
          <div className="clearfix mt-10 mb-10">
            <Button.Group floated="right">
              <Button color="red" className="link-button" onClick={e => this.toggleConfirmModal(e, index, formName, afIssuerId)}>Delete Selected Issuer</Button>
              <Button color="blue" className="link-button" onClick={e => this.addMore(e, formName)}>+ Add Affiliated Issuer</Button>
            </Button.Group>
          </div>
          <FormInput
            name="legalName"
            fielddata={AFFILIATED_ISSUER_FRM.fields.getOfferingBac[index].legalName}
            changed={(e, result) => formArrayChange(e, result, formName, 'getOfferingBac', index)}
            containerclassname="secondary"
          />
          {
            ['certificateFormation', 'operatingAgreement', 'evidenceGoodStanding', 'executiveTeam'].map(field => (
              <Aux>
                <FormTextarea
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
                key={field}
                name={field}
                fielddata={AFFILIATED_ISSUER_FRM.fields.getOfferingBac[index][field]}
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
                <Button disabled={!AFFILIATED_ISSUER_FRM.meta.isValid} secondary content="Generate Report" />
                <Button disabled={!AFFILIATED_ISSUER_FRM.meta.isValid} primary content="Approve" color="green" />
              </Button.Group>
            :
              <Aux>
                <div className="clearfix mb-20 right-align">
                  <Button secondary content="Submit for Approval" disabled={!AFFILIATED_ISSUER_FRM.meta.isValid} />
                </div>
                {/* <Button
                  content="Awaiting Manager Approval"
                  color="gray"
                  disabled={!AFFILIATED_ISSUER_FRM.meta.isValid}
                /> */}
              </Aux>
            }
          </div>
          <div className="clearfix">
            <Button.Group floated="right">
              <Button secondary content="Generate Report" disabled={!AFFILIATED_ISSUER_FRM.meta.isValid} />
              <Button as="span" className="time-stamp">
                <Icon className="ns-check-circle" color="green" />
                Approved by Manager on 2/3/2018
              </Button>
            </Button.Group>
          </div>
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

