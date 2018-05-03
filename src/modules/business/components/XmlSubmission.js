import React from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Accordion, Table, Button, Icon, Confirm } from 'semantic-ui-react';
import _ from 'lodash';
import DateTimeFormat from './../../../components/common/DateTimeFormat';

import {
  XML_STATUSES,
} from '../../../constants/business';

const XmlSubmission = observer((props) => {
  const { businessId, filingId } = props;
  const xmlUrl = `/app/business/${businessId}/filing/${filingId}/xml`;
  if (!_.isEmpty(props.xmlSubmissions)) {
    return (
      <Accordion.Content active={props.active} key={props.filingId}>
        <p>
          <Link to={xmlUrl}>Click here to create a new submission.</Link>
        </p>
        <Table basic celled collapsing>
          <Table.Body>
            {
              props.xmlSubmissions.map(xmlSubmission => (
                <Table.Row key={xmlSubmission.xmlSubmissionId}>
                  <Table.Cell>
                    <Link to={`${xmlUrl}/${xmlSubmission.xmlSubmissionId}`}>
                      {xmlSubmission.folderName}
                    </Link>
                  </Table.Cell>
                  <Table.Cell><DateTimeFormat datetime={xmlSubmission.created} /></Table.Cell>
                  <Table.Cell>
                    {
                      xmlSubmission.xmlSubmissionStatus === XML_STATUSES.completed &&
                      xmlSubmission.xmlSubmissionDownloadUrl &&
                        <a href={xmlSubmission.xmlSubmissionDownloadUrl} download className="ui button icon link-button">
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
                    <Button
                      icon
                      color={xmlSubmission.lockedStatus === true ? 'red' : 'green'}
                      className={xmlSubmission.xmlSubmissionStatus === XML_STATUSES.draft ? 'link-button disabled' : 'link-button active'}
                      entity="lockunlock"
                      refid={filingId}
                      subrefid={xmlSubmission.xmlSubmissionId}
                      lockedstatus={xmlSubmission.lockedStatus}
                      onClick={props.confirmDelete}
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
                      onClick={props.confirmDelete}
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
              open={props.confirmBoxValues.entity === 'xml' && filingId === props.confirmBoxValues.refId}
              onCancel={props.handleDeleteCancel}
              onConfirm={props.handleDeleteXMlSubmission}
              size="tiny"
              className="deletion"
            />
            <Confirm
              header="Confirm"
              content={props.confirmBoxValues.metaData.lockedStatus === true ? 'Are you sure you want to lock this XML submission?' : 'Are you sure you want to unlock this XML submission?'}
              open={props.confirmBoxValues.entity === 'lockunlock' && filingId === props.confirmBoxValues.refId}
              onCancel={props.handleDeleteCancel}
              onConfirm={props.handleXMLSubmissionLockUnlock}
              size="tiny"
              className="deletion"
            />
          </Table.Body>
        </Table>
      </Accordion.Content>
    );
  }
  return (
    <Accordion.Content active={props.active}>
      {/* <Card className="flexible">
        <Card.Content> */}
      <p>No XML Submissions are present for this filing,{' '}
        <Link to={xmlUrl}>Click here to create a new submission.</Link>
      </p>
      {/* </Card.Content>
    </Card> */}
    </Accordion.Content>
  );
});

export default XmlSubmission;
