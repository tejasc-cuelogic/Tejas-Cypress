import React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Icon, Header, Button, Confirm, Responsive } from 'semantic-ui-react';
import _ from 'lodash';

import FillingsList from '../components/FillingsList';
import { businessActions } from '../../../../../services/actions';
import NewBusinessForm from './NewBusinessForm';
import { Spinner } from '../../../../../theme/shared';
import Helper from '../../../../../helper/utility';

@inject('businessStore', 'uiStore')
@observer
export default class BusinessDetails extends React.Component {
  componentDidMount() {
    businessActions.getBusinessDetails(this.props.match.params.businessId);
  }

  handleAccordionTitleClick = (e, { dataid }) => this.props.uiStore.setOpenAccordion(dataid);

  handleNewFiling = () => this.props.history.push(`/app/edgar/${this.props.match.params.businessId}/edgar`);

  editBusinessModal = () => {
    this.props.businessStore.setEditBusinessMode(true);
    this.props.businessStore.resetNewOfferingInfo();
    this.props.uiStore.setModalStatus('BusinessForm');
  }

  confirmDelete = (e, {
    entity, refid, subrefid, lockedstatus, filings,
  }) => {
    e.stopPropagation();
    const anyFilingXmlLocked = false;
    const entityV = entity;
    if (entityV === 'filing' && !this.canDeleteFiling(subrefid, filings)) {
      Helper.toast('You can not delete this Filing as one of its XML Submission is locked', 'warning', { position: 'top-center' });
      return false;
    }

    this.props.uiStore.setConfirmBox(entityV, refid, subrefid, !lockedstatus, anyFilingXmlLocked);
    return true;
  }

  canDeleteFiling = (subrefid, filings) => {
    const filing = _.find(filings, { filingId: subrefid });
    const isLocked = _.find(filing.submissions, { lockedStatus: true });
    if (filing.submissions.length === 0 || typeof isLocked === 'undefined') {
      return true;
    }
    return false;
  }

  handleDeleteCancel = () => {
    this.props.uiStore.setConfirmBox('', '', '', false);
  }

  handleDeleteBusiness = () => {
    this.props.uiStore.setConfirmBox('', '');
    businessActions.deleteBusiness(this.props.match.params.businessId)
      .then(() => {
        this.props.history.push('/app/edgar');
        Helper.toast('Business deleted successfully', 'success');
      }).catch(() => {
        Helper.toast('Something went wrong while deleting business Please try again.', 'error', { position: 'top-center' });
      });
  }

  handleDeleteFiling = () => {
    if (this.props.uiStore.confirmBox.metaData.isAnyFilingLocked) {
      this.handleDeleteCancel();
      this.props.history.push(`/app/edgar/${this.props.match.params.businessId}`);
    } else {
      const filingId = this.props.uiStore.confirmBox.subRefId;
      businessActions.deleteFiling(this.props.match.params.businessId, filingId)
        .then(() => {
          this.handleDeleteCancel();
          this.props.history.push(`/app/edgar/${this.props.match.params.businessId}`);
          Helper.toast('Filing deleted successfully', 'success');
        }).catch(() => {
          Helper.toast('Something went wrong while deleting filing Please try again.', 'error', { position: 'top-center' });
        });
    }
  }

  handleDeleteXMlSubmission = () => {
    const filingId = this.props.uiStore.confirmBox.refId;
    const xmlSubmissionId = this.props.uiStore.confirmBox.subRefId;
    businessActions.deleteXmlSubmission(filingId, xmlSubmissionId).then(() => {
      this.handleDeleteCancel();
      this.props.history.push(`/app/edgar/${this.props.match.params.businessId}`);
      Helper.toast('XML Submission deleted successfully', 'success');
    }).catch(() => {
      Helper.toast('Something went wrong while deleting XMl submission Please try again.', 'error', { position: 'top-center' });
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
        this.props.history.push(`/app/edgar/${this.props.match.params.businessId}`);
        Helper.toast(`XML submission ${status} successfully`, 'success');
      });
  }

  render() {
    const { business } = this.props.businessStore;
    if (this.props.uiStore.inProgress) {
      return (
        <div>
          <Spinner loaderMessage={this.props.uiStore.loaderMessage} />
        </div>
      );
    }
    return (
      <>
        <div className="page-header-section">
          <Header as="h1">
            <Button
              primary
              floated="right"
              onClick={this.handleNewFiling}
            >
              + Add Filing
            </Button>
            <NewBusinessForm businessid={this.props.match.params.businessId} />
            <Responsive
              minWidth={Responsive.onlyLargeScreen.minWidth}
              as={Link}
              to="/app/edgar"
              className="back-link"
            >
              <Icon name="ns-arrow-left" />
            </Responsive>
            {business.name.value}
            <div className="actions">
              <Button
                icon
                circular
                inverted
                color="green"
                size="mini"
                onClick={this.editBusinessModal}
              >
                <Icon name="ns-pencil" />
              </Button>{' '}
              <Button
                icon
                circular
                inverted
                color="red"
                size="mini"
                entity="business"
                refid={this.props.match.params.businessId}
                subrefid=""
                onClick={this.confirmDelete}
              >
                <Icon name="ns-trash" />
              </Button>
              <Button
                icon
                circular
                inverted
                size="mini"
                color="theme-primary"
                onClick={() => window.open(`${process.env.REACT_APP_BOX_URL}/folder/${business.folderId}`, '_blank')}
              >
                <Icon name="external" />
              </Button>
              <Confirm
                header="Confirm"
                content="Are you sure you want to delete business and its associated data?"
                open={this.props.uiStore.confirmBox.entity === 'business'}
                onCancel={this.handleDeleteCancel}
                onConfirm={this.handleDeleteBusiness}
                size="mini"
                className="deletion"
              />
            </div>
          </Header>
        </div>
        <div className="search-filters">
          <p className="inverse-text">{business.desc.value}</p>
        </div>
        <div className="content-spacer">
          <FillingsList
            filings={business.filings}
            handleAccordionClick={this.handleAccordionTitleClick}
            openAccordion={this.props.uiStore.openAccordion}
            businessId={this.props.match.params.businessId}
            confirmDelete={this.confirmDelete}
            canDeleteFiling={this.canDeleteFiling}
            handleDeleteCancel={this.handleDeleteCancel}
            confirmBoxValues={this.props.uiStore.confirmBox}
            handleDeleteFiling={this.handleDeleteFiling}
            handleDeleteXMlSubmission={this.handleDeleteXMlSubmission}
            handleXMLSubmissionLockUnlock={this.handleXMLSubmissionLockUnlock}
          />
        </div>
      </>
    );
  }
}
