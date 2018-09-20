import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Header, Form, Divider, Button, Icon, Confirm } from 'semantic-ui-react';
import { FormTextarea, FormInput } from '../../../../../../../theme/form';
import Helper from '../../../../../../../helper/utility';

@inject('offeringCreationStore', 'userStore')
@observer
export default class AfIssuer extends Component {
  addMore = (e, formName) => {
    e.preventDefault();
    this.props.offeringCreationStore.addMore(formName);
  }
  toggleConfirmModal = (e, index, formName) => {
    e.preventDefault();
    this.props.offeringCreationStore.toggleConfirmModal(index, formName);
  }
  removeData = (confirmModalName) => {
    this.props.offeringCreationStore.removeData(confirmModalName);
    Helper.toast('Affiliated issuer has been deleted successfully.', 'success');
    this.props.history.push(`${this.props.refLink}/1`);
  }
  render() {
    const {
      AFFILIATED_ISSUER_FRM,
      formChangeWithIndex,
      confirmModal,
      confirmModalName,
    } = this.props.offeringCreationStore;
    const issuerNumber = this.props.index;
    const index = issuerNumber || 0;
    const formName = 'AFFILIATED_ISSUER_FRM';
    const { roles } = this.props.userStore.currentUser;
    return (
      <Aux>
        <Form>
          <Button.Group floated="right">
            <Button size="small" color="red" className="link-button mt-20" onClick={e => this.toggleConfirmModal(e, index, formName)}> Delete Selected Issuer</Button>
            <Button size="small" color="blue" className="link-button mt-20" onClick={e => this.addMore(e, formName)}>+ Add Affiliated Issuer</Button>
          </Button.Group>
          <FormInput
            name="legalName"
            fielddata={AFFILIATED_ISSUER_FRM.fields.data[index].legalName}
            changed={(e, result) => formChangeWithIndex(e, result, formName, index)}
            containerclassname="secondary"
          />
          {
            ['certificateOfFormation', 'operatingAgreement', 'evidenceOfGoodStanding', 'whoAreThesePeople'].map(field => (
              <Aux>
                <FormTextarea
                  key={field}
                  name={field}
                  fielddata={AFFILIATED_ISSUER_FRM.fields.data[index][field]}
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
                fielddata={AFFILIATED_ISSUER_FRM.fields.data[index][field]}
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
            ['sanctionsListSearch', 'pendingCivilLawsuits', 'generalOnlineReputationSearch'].map(field => (
              <FormTextarea
                key={field}
                name={field}
                fielddata={AFFILIATED_ISSUER_FRM.fields.data[index][field]}
                changed={(e, result) => formChangeWithIndex(e, result, formName, index)}
                containerclassname="secondary"
              />
            ))
          }
          <Button secondary className="relaxed" disabled={!AFFILIATED_ISSUER_FRM.meta.isValid} >Submit for Approval</Button>
          <Button.Group floated="right">
            {roles && (roles.includes('admin') || roles.includes('support')) &&
              <Button color="gray" disabled={!AFFILIATED_ISSUER_FRM.meta.isValid} >Awaiting Manager Approval</Button>
            }
            {roles && (roles.includes('admin') || roles.includes('manager')) &&
            <Aux>
              <Button inverted color="red" content="Decline" disabled={!AFFILIATED_ISSUER_FRM.meta.isValid} >Decline</Button>
              <Button secondary className="relaxed" disabled={!AFFILIATED_ISSUER_FRM.meta.isValid} >Generate Report</Button>
              <Button primary color="green" className="relaxed" disabled={!AFFILIATED_ISSUER_FRM.meta.isValid} >Approve</Button>
            </Aux>
            }
          </Button.Group>
          <div className="clearfix mb-20">
            <Button.Group floated="right">
              <Button color="green" className="relaxed" disabled={!AFFILIATED_ISSUER_FRM.meta.isValid} >Generate Report</Button>
            </Button.Group>
            <Button as="span" className="time-stamp">
              <Icon className="ns-check-circle" color="green" />
              Approved by Manager on 2/3/2018
            </Button>
          </div>
        </Form>
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this issuer?"
          open={confirmModal}
          onCancel={this.toggleConfirmModal}
          onConfirm={() => this.removeData(confirmModalName)}
          size="mini"
          className="deletion"
        />
      </Aux>
    );
  }
}

