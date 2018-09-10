/*  eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import Aux from 'react-aux';
import { observer, inject } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import { Header, Button, Checkbox, Confirm } from 'semantic-ui-react';
import { FormTextarea } from '../../../../../../theme/form';
import Helper from '../../../../../../helper/utility';

@withRouter
@inject('offeringCreationStore', 'userStore')
@observer
export default class Contingency extends Component {
  setContingencyForm = () => {
    const { formName, offeringCreationStore } = this.props;
    offeringCreationStore.setContingencyFormSelected(formName);
  }
  toggleConfirmModal = (e, index, formName) => {
    e.preventDefault();
    this.props.offeringCreationStore.toggleConfirmModal(index, formName);
  }
  removeData = (confirmModalName) => {
    this.props.offeringCreationStore.removeData(confirmModalName);
    Helper.toast('Contingency deleted successfully.', 'success');
  }
  render() {
    const { roles } = this.props.userStore.currentUser;
    const {
      confirmModal,
      confirmModalName,
    } = this.props.offeringCreationStore;
    const {
      form,
      formName,
      formChangeWithIndex,
      match,
    } = this.props;
    return (
      <Aux>
        <Header as="h4">
          {formName === 'LAUNCH_CONTITNGENCIES_FRM' ? 'Launch Contingencies' : 'Closing Contingencies'}
          {(roles && (roles.includes('manager') || roles.includes('admin'))) ?
            <Link onClick={() => this.setContingencyForm()} to={`${match.url}/add-new-contingency`} className="link"><small>+ Add {formName === 'LAUNCH_CONTITNGENCIES_FRM' ? 'Launch' : 'Closing'} Contingency</small></Link>
          :
          null}
        </Header>
        {
        form.fields.data.length > 0 ?
        form.fields.data.map((contingency, index) => (
          <div className="featured-section collapsed-checkbox">
            <Checkbox
              label={
                <label>
                  <Header as="h4">
                    {contingency.name.value}
                    <Header.Subheader>
                      {contingency.acceptanceCriteria.value}
                    </Header.Subheader>
                  </Header>
                </label>
              }
              onChange={(e, result) => formChangeWithIndex(e, result, formName, index)}
            />
            <div className="checkbox-description">
              {/* <p>
                {contingency.comment.value}
              </p> */}
              <FormTextarea
                fielddata={contingency.comment}
                name="comment"
                containerclassname="secondary"
                changed={(e, result) => formChangeWithIndex(e, result, formName, index)}
              />
              <Button.Group compact size="small">
                {(roles && (roles.includes('manager') || roles.includes('admin'))) &&
                  <Aux>
                    <Button inverted color="blue" content="Edit" />
                    <Button type="button" color="red" content="Delete" onClick={e => this.toggleConfirmModal(e, index, formName)} />
                  </Aux>
                }
                {/* <Button as="span" className="time-stamp">
                <Icon className="ns-check-circle" color="green" />
                Submited 2/16/18 by Aaron Adams</Button>
                */}
                {(roles && (roles.includes('support') || roles.includes('admin'))) &&
                  <Button primary content="Submit" />
                }
              </Button.Group>
            </div>
          </div>
        )) :
        <div className="featured-section collapsed-checkbox">
          No data found
        </div>
      }
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this contingency?"
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
