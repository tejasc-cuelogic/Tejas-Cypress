import React, { Component } from 'react';
import {
  isEmpty,
  find,
} from 'lodash';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Header, Table, Message, Button, Confirm } from 'semantic-ui-react';
import XmlSubmission from '../../../../admin/edgar/components/XmlSubmission';
import Helper from '../../../../../../helper/utility';
import { businessActions } from '../../../../../../services/actions';
import { NEXTSEED_BOX_URL, NEXTSEED_SECURITIES_BOX_URL } from './../../../../../../constants/common';

@withRouter
@inject('businessStore', 'offeringCreationStore', 'uiStore')
@observer
export default class EdgarFilingList extends Component {
  confirmDelete = (e, {
    entity, refid, subrefid, lockedstatus, submissions,
  }) => {
    e.stopPropagation();
    const anyFilingXmlLocked = false;
    const entityV = entity;
    if (entityV === 'filing' && !this.canDeleteFiling(submissions)) {
      Helper.toast('You can not delete this Filing as one of its XML Submission is locked', 'warning', { position: 'top-center' });
      return false;
    }

    this.props.uiStore.setConfirmBox(entityV, refid, subrefid, !lockedstatus, anyFilingXmlLocked);
    return true;
  }

  canDeleteFiling = (submissions) => {
    const isLocked = find(submissions, { lockedStatus: true });
    if (submissions.length === 0 || typeof isLocked === 'undefined') {
      return true;
    }
    return false;
  }

  handleDeleteCancel = () => {
    this.props.uiStore.setConfirmBox('', '', '', false);
  }

  handleDeleteXMlSubmission = () => {
    const { currentOfferingId } = this.props.offeringCreationStore;
    const filingId = this.props.uiStore.confirmBox.refId;
    const xmlSubmissionId = this.props.uiStore.confirmBox.subRefId;
    businessActions.deleteXmlSubmission(filingId, xmlSubmissionId).then(() => {
      this.handleDeleteCancel();
      this.props.history.push(`/app/offerings/creation/edit/${currentOfferingId}/legal/generate-docs`);
      Helper.toast('XML Submission deleted successfully', 'success');
    }).catch(() => {
      Helper.toast('Something went wrong while deleting XMl submission, Please try again.', 'error', { position: 'top-center' });
    });
  }

  handleXMLSubmissionLockUnlock = () => {
    const { currentOfferingId } = this.props.offeringCreationStore;
    const filingId = this.props.uiStore.confirmBox.refId;
    const xmlSubmissionId = this.props.uiStore.confirmBox.subRefId;
    const lockStatus = this.props.uiStore.confirmBox.metaData.lockedStatus;
    const status = lockStatus === false ? 'unlocked' : 'locked';
    businessActions.lockUnlockXmlSubmission(
      currentOfferingId,
      filingId,
      xmlSubmissionId,
      lockStatus,
    )
      .then(() => {
        this.handleDeleteCancel();
        this.props.history.push(`/app/offerings/creation/edit/${currentOfferingId}/legal/generate-docs`);
        Helper.toast(`XML submission ${status} successfully`, 'success');
      });
  }

  handleDeleteFiling = () => {
    const { currentOfferingId } = this.props.offeringCreationStore;
    if (this.props.uiStore.confirmBox.metaData.isAnyFilingLocked) {
      this.handleDeleteCancel();
      this.props.history.push(`/app/offerings/creation/edit/${currentOfferingId}/legal/generate-docs`);
    } else {
      const filingId = this.props.uiStore.confirmBox.subRefId;
      businessActions.deleteFiling(currentOfferingId, filingId)
        .then(() => {
          this.handleDeleteCancel();
          this.props.history.push(`/app/offerings/creation/edit/${currentOfferingId}/legal/generate-docs`);
          Helper.toast('Filing deleted successfully', 'success');
        }).catch(() => {
          Helper.toast('Something went wrong while deleting filing Please try again.', 'error', { position: 'top-center' });
        });
    }
  }

  render() {
    const offeringFilingList = this.props.offeringFilings;
    const offering = this.props.offeringDetails;
    const offeringRegulationArr = offering.regulation.split('_');
    const regulationType = offeringRegulationArr[0];
    const BOX_URL_TO_CONSIDER = regulationType === 'BD' ? NEXTSEED_SECURITIES_BOX_URL : NEXTSEED_BOX_URL;
    if (isEmpty(offeringFilingList)) {
      return (
        <Message className="center-align">No Generated Docs present in this offering.</Message>
      );
    }
    return (
      <Aux>
        <Header as="h4">Edgar Filing</Header>
        {
          offeringFilingList.map(filing => (
            <Aux>
              <Table basic compact className="form-table">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell colSpan="3">
                      <Header as="h6">
                        {filing.filingFolderName}
                        <div className="actions pull-right">
                          <a
                            href={(`${BOX_URL_TO_CONSIDER}folder/${filing.folderId}`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-link"
                          >
                            Documents
                          </a>
                          <Button
                            color="red"
                            className="link-button"
                            entity="filing"
                            submissions={filing.submissions}
                            refid={filing.offeringId}
                            subrefid={filing.filingId}
                            onClick={this.confirmDelete}
                          >
                            Delete
                          </Button>
                        </div>
                      </Header>
                    </Table.HeaderCell>
                  </Table.Row>
                  <Table.Row>
                    <Table.HeaderCell>Submission</Table.HeaderCell>
                    <Table.HeaderCell>Created Date</Table.HeaderCell>
                    <Table.HeaderCell>Actions</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <XmlSubmission
                  xmlSubmissions={filing.submissions || []}
                  filingId={filing.filingId}
                  offeringId={filing.offeringId}
                  confirmBoxValues={this.props.uiStore.confirmBox}
                  confirmDelete={this.confirmDelete}
                  handleDeleteCancel={this.handleDeleteCancel}
                  handleDeleteXMlSubmission={this.handleDeleteXMlSubmission}
                  handleXMLSubmissionLockUnlock={this.handleXMLSubmissionLockUnlock}
                  boxFolderLink={(`${BOX_URL_TO_CONSIDER}folder/${filing.folderId}`)}
                />
              </Table>
            </Aux>
          ))
        }
        <Confirm
          header="Confirm"
          content="Are you sure you want to delete this filing and associated XML submissions?"
          open={this.props.uiStore.confirmBox.entity === 'filing' && this.props.uiStore.confirmBox.metaData.isAnyFilingXmlLocked === false}
          onCancel={this.handleDeleteCancel}
          onConfirm={this.handleDeleteFiling}
          size="mini"
          className="deletion"
        />
      </Aux>
    );
  }
}
