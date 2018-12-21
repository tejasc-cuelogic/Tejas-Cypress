/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import { Table, Button, Icon, Confirm } from 'semantic-ui-react';
import _ from 'lodash';
import { DateTimeFormat } from './../../../../../theme/shared';

import {
  XML_STATUSES,
} from '../../../../../constants/business';

@inject('businessStore')
@withRouter
@observer
class XmlSubmission extends Component {
  createNewSubmission = () => {
    this.props.businessStore.setBoxFolderLink(this.props.boxFolderLink);
    this.props.history.push(`/app/edgar/${this.props.offeringId}/filing/${this.props.filingId}/xml`);
  }
  render() {
    const { offeringId, filingId } = this.props.offeringId;
    const xmlUrl = `/app/edgar/${offeringId}/filing/${filingId}/xml`;
    if (!_.isEmpty(this.props.xmlSubmissions)) {
      return (
        <Table.Body active={this.props.active} key={this.props.filingId}>
          <Table.Row>
            <Table.Cell colSpan="3" textAlign="center">
              <Button primary compact circular size="mini" as={Link} to={xmlUrl} className="relaxed" content="Generate New Edgar Filing" />
            </Table.Cell>
          </Table.Row>
          {
            this.props.xmlSubmissions.map(xmlSubmission => (
              <Table.Row key={xmlSubmission.xmlSubmissionId}>
                <Table.Cell>
                  <Link to={`${xmlUrl}/${xmlSubmission.xmlSubmissionId}`}>
                    {xmlSubmission.folderName}
                  </Link>
                </Table.Cell>
                <Table.Cell><DateTimeFormat datetime={xmlSubmission.created} /></Table.Cell>
                <Table.Cell collapsing>
                  {
                    xmlSubmission.xmlSubmissionStatus === XML_STATUSES.completed &&
                    xmlSubmission.xmlSubmissionDownloadUrl &&
                    <a href={xmlSubmission.xmlSubmissionDownloadUrl} target="_blank" rel="noopener noreferrer" download className="ui button icon link-button">
                      <Icon name="download" />
                    </a>
                  }
                  {
                    xmlSubmission.xmlSubmissionStatus === XML_STATUSES.created &&
                    !xmlSubmission.xmlSubmissionDownloadUrl &&
                    <a download className="ui button icon link-button"><Icon name="circle notched loading" /></a>
                  }
                  {
                    xmlSubmission.xmlSubmissionStatus === XML_STATUSES.draft &&
                    <Button
                      icon
                      className="link-button disabled"
                      href={xmlSubmission.xmlSubmissionDownloadUrl}
                      download
                    >
                      <Icon name="download" />
                    </Button>
                  }
                  <Button icon className="link-button"><Icon className="ns-link" /></Button>
                  <Button
                    icon
                    color={xmlSubmission.lockedStatus === true ? 'red' : 'green'}
                    className={xmlSubmission.xmlSubmissionStatus === XML_STATUSES.draft ? 'link-button disabled' : 'link-button active'}
                    entity="lockunlock"
                    refid={filingId}
                    subrefid={xmlSubmission.xmlSubmissionId}
                    lockedstatus={xmlSubmission.lockedStatus}
                    onClick={this.props.confirmDelete}
                  >
                    {xmlSubmission.lockedStatus === true && <Icon name="ns-lock" />}
                    {(xmlSubmission.lockedStatus === null || xmlSubmission.lockedStatus === false) && <Icon name="ns-unlock alternate" />}
                  </Button>
                  <Button
                    icon
                    circular
                    color="red"
                    className={xmlSubmission.lockedStatus === true ? 'link-button disabled' : 'link-button'}
                    entity="xml"
                    refid={filingId}
                    subrefid={xmlSubmission.xmlSubmissionId}
                    onClick={this.props.confirmDelete}
                  >
                    <Icon name="ns-trash" />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))
          }
          <Confirm
            header="Confirm"
            content="Are you sure you want to delete this XML submission?"
            open={this.props.confirmBoxValues.entity === 'xml' && filingId === this.props.confirmBoxValues.refId}
            onCancel={this.props.handleDeleteCancel}
            onConfirm={this.props.handleDeleteXMlSubmission}
            size="mini"
            className="deletion"
          />
          <Confirm
            header="Confirm"
            content={this.props.confirmBoxValues.metaData.lockedStatus === true ? 'Are you sure you want to lock this XML submission?' : 'Are you sure you want to unlock this XML submission?'}
            open={this.props.confirmBoxValues.entity === 'lockunlock' && filingId === this.props.confirmBoxValues.refId}
            onCancel={this.props.handleDeleteCancel}
            onConfirm={this.props.handleXMLSubmissionLockUnlock}
            size="mini"
            className="deletion"
          />
        </Table.Body>
      );
    }
    return (
      <Table.Body active={this.props.active} key="xml_key">
        <Table.Row textAlign="center">
          <Table.Cell colSpan="6">
            No XML Submissions are present for this filing,{' '}
            <span style={{ cursor: 'pointer' }} onClick={this.createNewSubmission} className="highlight-text">Click here to create a new submission.</span>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    );
  }
}

export default XmlSubmission;
