import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Header, Form, Divider, Button, Icon, Confirm } from 'semantic-ui-react';
import { FormTextarea } from '../../../../../../../theme/form';
import Helper from '../../../../../../../helper/utility';

@inject('offeringCreationStore', 'userStore')
@observer
export default class Leader extends Component {
  addMore = (e, formName) => {
    e.preventDefault();
    this.props.offeringCreationStore.addMore(formName);
    const { LEADER_FRM } = this.props.offeringCreationStore;
    const leaderCount = LEADER_FRM.fields.data.length;
    this.props.history.push(`${this.props.refLink}/leader/${leaderCount}`);
  }
  toggleConfirmModal = (e, index, formName) => {
    e.preventDefault();
    this.props.offeringCreationStore.toggleConfirmModal(index, formName);
  }
  removeData = (confirmModalName) => {
    this.props.offeringCreationStore.removeData(confirmModalName);
    Helper.toast('Leader has been deleted successfully.', 'success');
    this.props.history.push(`${this.props.refLink}/leader/1`);
  }
  render() {
    const {
      LEADER_FRM,
      formChangeWithIndex,
      confirmModal,
      confirmModalName,
    } = this.props.offeringCreationStore;
    const issuerNumber = this.props.index;
    const index = issuerNumber || 0;
    const formName = 'LEADER_FRM';
    const { roles } = this.props.userStore.currentUser;
    return (
      <Aux>
        <Form>
          <Button.Group floated="right">
            <Button size="small" color="red" className="link-button mt-20" onClick={e => this.toggleConfirmModal(e, index, formName)}> Delete selected leader</Button>
            <Button size="small" color="blue" className="link-button mt-20" onClick={e => this.addMore(e, formName)}>+ Add another leader</Button>
          </Button.Group>
          <Header as="h4" textAlign="left">
            Control Person Diligence
          </Header>
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
          <Header as="h4" textAlign="left">
            Regulatory Bad Actor Check
          </Header>
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
          <Header as="h4" textAlign="left">
            Additional Disclosure Check
          </Header>
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
                <Button inverted content="Decline" color="red" disabled={!LEADER_FRM.meta.isValid} />
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
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this leader?"
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
