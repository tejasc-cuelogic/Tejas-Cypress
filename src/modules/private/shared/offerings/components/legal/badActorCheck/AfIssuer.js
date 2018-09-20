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
            ['certificateFormation', 'operatingAgreement', 'evidenceGoodStanding', 'executiveTeam'].map(field => (
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
            ['bac1', 'bac2', 'bac3', 'bac4', 'bac5', 'bac6', 'bac7', 'bac8'].map(field => (
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
            ['ofac', 'civilLawsuit', 'onlineReputation'].map(field => (
              <FormTextarea
                key={field}
                name={field}
                fielddata={AFFILIATED_ISSUER_FRM.fields.data[index][field]}
                changed={(e, result) => formChangeWithIndex(e, result, formName, index)}
                containerclassname="secondary"
              />
            ))
          }
          <Button secondary content="Submit for Approval" floated="right" disabled={!AFFILIATED_ISSUER_FRM.meta.isValid} />
          <Button.Group floated="right">
            {roles && (roles.includes('admin') || roles.includes('support')) &&
              <Button color="gray" content="Awaiting Manager Approval" disabled={!AFFILIATED_ISSUER_FRM.meta.isValid} />
            }
            {roles && (roles.includes('admin') || roles.includes('manager')) &&
            <Aux>
              <Button inverted color="red" content="Decline" disabled={!AFFILIATED_ISSUER_FRM.meta.isValid} />
              <Button content="Generate Report" secondary disabled={!AFFILIATED_ISSUER_FRM.meta.isValid} />
              <Button content="Approve" primary color="green" disabled={!AFFILIATED_ISSUER_FRM.meta.isValid} />
            </Aux>
            }
          </Button.Group>
          <div className="clearfix mb-20">
            <Button.Group floated="right">
              <Button color="green" content="Generate Report" disabled={!AFFILIATED_ISSUER_FRM.meta.isValid} />
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
          onConfirm={() => this.removeData(confirmModalName)}
          size="mini"
          className="deletion"
        />
      </Aux>
    );
  }
}

