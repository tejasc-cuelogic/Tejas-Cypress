/*  eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import Aux from 'react-aux';
import { observer, inject } from 'mobx-react';
import { Link, withRouter, Route } from 'react-router-dom';
import { Header, Button, Checkbox, Confirm } from 'semantic-ui-react';
import { FormTextarea } from '../../../../../../theme/form';
import EditContingency from './EditContingency';
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
  removeData = () => {
    const { formName } = this.props;
    const dataKey = formName === 'LAUNCH_CONTITNGENCIES_FRM' ? 'launch' : 'close';
    this.props.offeringCreationStore.removeData(formName, dataKey);
    this.handleSubmitComment();
    Helper.toast('Contingency has been deleted successfully.', 'success');
  }
  canAddNew = roles => roles && (roles.includes('manager') || roles.includes('admin')) &&
    this.props.refTab !== 'close';
  handleSubmitComment = () => {
    const {
      updateOffering,
      currentOfferingId,
      LAUNCH_CONTITNGENCIES_FRM,
      CLOSING_CONTITNGENCIES_FRM,
    } = this.props.offeringCreationStore;
    const fields = { ...LAUNCH_CONTITNGENCIES_FRM.fields, ...CLOSING_CONTITNGENCIES_FRM.fields };
    updateOffering(currentOfferingId, fields, 'contingencies');
  }
  render() {
    const { roles } = this.props.userStore.currentUser;
    const {
      confirmModal,
    } = this.props.offeringCreationStore;
    const {
      form, formName, formArrayChange, match, addon,
    } = this.props;
    const dataKey = formName === 'LAUNCH_CONTITNGENCIES_FRM' ? 'launch' : 'close';
    return (
      <Aux>
        <Route path={`${match.url}/${dataKey}/edit-contingency/:index`} render={() => <EditContingency formArrayChange={formArrayChange} dataKey={dataKey} form={form} formName={formName} refLink={match.url} />} />
        <Header as="h4">
          {formName === 'LAUNCH_CONTITNGENCIES_FRM' ? 'Launch Contingencies' : 'Closing Contingencies'}
          {this.canAddNew(roles) ?
            <Link onClick={() => this.setContingencyForm()} to={`${match.url}/add-new-contingency`} className="link"><small>+ Add {formName === 'LAUNCH_CONTITNGENCIES_FRM' ? 'Launch' : 'Closing'} Contingency</small></Link>
          :
          null}
          {addon}
        </Header>
        {
        form.fields[dataKey] && form.fields[dataKey].length > 0 ?
        form.fields[dataKey].map((contingency, index) => (
          <div className="featured-section collapsed-checkbox">
            <Checkbox
              name="isAccepted"
              label={
                <label>
                  <Header as="h4">
                    {contingency.contingency.value}
                    <Header.Subheader>
                      {contingency.acceptance.value}
                    </Header.Subheader>
                  </Header>
                </label>
              }
              checked={form.fields[dataKey][index].isAccepted.value}
              onChange={(e, result) => formArrayChange(e, result, formName, dataKey, index)}
            />
            <div className="checkbox-description">
              <FormTextarea
                fielddata={contingency.comment}
                name="comment"
                containerclassname="secondary"
                changed={(e, result) => formArrayChange(e, result, formName, dataKey, index)}
              />
              <Button.Group compact size="small">
                {(roles && (roles.includes('manager') || roles.includes('admin'))) &&
                  <Aux>
                    <Button as={Link} inverted color="blue" content="Edit" to={`${match.url}/${dataKey}/edit-contingency/${index}`} />
                    <Button type="button" color="red" content="Delete" onClick={e => this.toggleConfirmModal(e, index, formName)} />
                  </Aux>
                }
                {(roles && (roles.includes('support') || roles.includes('admin'))) &&
                  <Button type="button" primary content="Submit" onClick={this.handleSubmitComment} />
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
          onConfirm={() => this.removeData()}
          size="mini"
          className="deletion"
        />
      </Aux>
    );
  }
}
