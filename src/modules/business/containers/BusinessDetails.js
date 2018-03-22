import React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Icon, Button, Grid, Confirm } from 'semantic-ui-react';
// import _ from 'lodash';

import FillingsList from '../components/FillingsList';
import uiActions from '../../../actions/ui';
import businessActions from '../../../actions/business';
import NewBusinessForm from '../containers/NewBusinessForm';
import Spinner from '../../../theme/ui/Spinner';
import Helper from '../../../helper/utility';

@inject('businessStore', 'uiStore')
@observer
export default class BusinessDetails extends React.Component {
  componentDidMount() {
    businessActions.getBusinessDetails(this.props.match.params.businessId);
  }

  handleAccordionTitleClick = (e, { dataid }) => uiActions.setOpenAccordion(dataid);

  handleNewFiling = () => this.props.history.push(`/app/business/${this.props.match.params.businessId}/edgar`);

  editBusinessModal = () => {
    this.props.businessStore.setEditBusinessMode(true);
    this.props.businessStore.resetNewOfferingInfo();
    this.props.uiStore.setModalStatus(true);
  }

  confirmDelete = (e, {
    entity, refid, subrefid, lockedstatus,
  }) => {
    this.props.uiStore.setConfirmBox(entity, refid, subrefid, !lockedstatus);
  }

  handleDeleteCancel = () => {
    this.props.uiStore.setConfirmBox('', '', '', false);
  }

  handleDeleteBusiness = () => {
    this.props.uiStore.setConfirmBox('', '');
    businessActions.deleteBusiness(this.props.match.params.businessId)
      .then(() => {
        this.props.history.push('/app/business');
        Helper.toast('Business deleted successfully', 'success');
      });
  }

  handleDeleteFiling = () => {
    const filingId = this.props.uiStore.confirmBox.subRefId;
    businessActions.deleteFiling(this.props.match.params.businessId, filingId)
      .then(() => {
        this.handleDeleteCancel();
        this.props.history.push(`/app/business/${this.props.match.params.businessId}`);
        Helper.toast('Filing deleted successfully', 'success');
      });
  }

  handleDeleteXMlSubmission = () => {
    const filingId = this.props.uiStore.confirmBox.refId;
    const xmlSubmissionId = this.props.uiStore.confirmBox.subRefId;
    businessActions.deleteXmlSubmission(filingId, xmlSubmissionId).then(() => {
      this.handleDeleteCancel();
      this.props.history.push(`/app/business/${this.props.match.params.businessId}`);
      Helper.toast('XML Submission deleted successfully', 'success');
    });
  }

  handleXMLSubmissionLockUnlock = () => {
    const { businessId } = this.props.match.params;
    const filingId = this.props.uiStore.confirmBox.refId;
    const xmlSubmissionId = this.props.uiStore.confirmBox.subRefId;
    const lockStatus = this.props.uiStore.confirmBox.metaData.lockedStatus;
    const status = lockStatus === false ? 'unlocked' : 'locked';
    businessActions.lockUnlockXmlSubmission(businessId, filingId, xmlSubmissionId, lockStatus)
      .then(() => {
        this.handleDeleteCancel();
        this.props.history.push(`/app/business/${this.props.match.params.businessId}`);
        Helper.toast(`XML submission ${status} successfully`, 'success');
      });
  }

  render() {
    console.log(this.props.uiStore.confirmBox);
    const { business } = this.props.businessStore;
    if (this.props.uiStore.inProgress) {
      return (
        <div>
          <Spinner loaderMessage={this.props.uiStore.loaderMessage} />
        </div>
      );
    }
    return (
      <div>
        <div className="page-header-section webcontent-spacer">
          <Grid>
            <Grid.Row>
              <Grid.Column width={16}>
                <h1>
                  <Button
                    circular
                    color="green"
                    floated="right"
                    onClick={this.handleNewFiling}
                  >
                    + Add Filing
                  </Button>
                  <NewBusinessForm businessid={this.props.match.params.businessId} />
                  <Link to="/app/business" className="back-link"><Icon name="long arrow left" /></Link>
                  {business.name.value}
                  <div className="actions">
                    <Button
                      onClick={this.editBusinessModal}
                      icon
                      circular
                      inverted
                      color="green"
                    >
                      <Icon name="write" />
                    </Button>{' '}
                    <Button
                      icon
                      circular
                      inverted
                      color="red"
                      entity="business"
                      refid={this.props.match.params.businessId}
                      subrefid=""
                      onClick={this.confirmDelete}
                    >
                      <Icon name="trash" />
                    </Button>
                    <Confirm
                      header="Confirm"
                      content="Are you sure you want to delete business and its associated data?"
                      open={this.props.uiStore.confirmBox.entity === 'business'}
                      onCancel={this.handleDeleteCancel}
                      onConfirm={this.handleDeleteBusiness}
                      size="tiny"
                      className="deletion"
                    />
                  </div>
                </h1>
                <p>{business.desc.value}</p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
        <div className="content-spacer">
          <FillingsList
            filings={business.filings}
            handleAccordionClick={this.handleAccordionTitleClick}
            openAccordion={this.props.uiStore.openAccordion}
            businessId={this.props.match.params.businessId}
            confirmDelete={this.confirmDelete}
            handleDeleteCancel={this.handleDeleteCancel}
            confirmBoxValues={this.props.uiStore.confirmBox}
            handleDeleteFiling={this.handleDeleteFiling}
            handleDeleteXMlSubmission={this.handleDeleteXMlSubmission}
            handleXMLSubmissionLockUnlock={this.handleXMLSubmissionLockUnlock}
          />
        </div>
      </div>
    );
  }
}
