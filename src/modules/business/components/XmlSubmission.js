import React from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Accordion, Table, Button, Icon, Confirm } from 'semantic-ui-react';
import _ from 'lodash';
import DateTimeFormat from './../../../components/common/DateTimeFormat';

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
                      {'XML Submission'}
                    </Link>
                  </Table.Cell>
                  <Table.Cell><DateTimeFormat datetime={xmlSubmission.created} /></Table.Cell>
                  <Table.Cell>
                    <Button
                      icon
                      circular
                      color="red"
                      filingid={filingId}
                      xmlsubmissionid={xmlSubmission.xmlSubmissionId}
                      lockedstatus={xmlSubmission.lockedStatus}
                      onClick={props.confirmForLock}
                    >
                      {xmlSubmission.lockedStatus === true && <Icon name="lock" />}
                      {(xmlSubmission.lockedStatus === null || xmlSubmission.lockedStatus === false) && <Icon name="unlock" />}
                    </Button>
                    <Confirm
                      header="Confirm"
                      content="Are you sure you want to perform this operation?"
                      open={props.confirmBoxForLock}
                      filingid={props.filingIdToBeDeleted}
                      xmlsubmissionid={props.xmlSubmissionIdToBeDeleted}
                      lockedstatus={props.lockedStatusTobeToggled}
                      onCancel={props.handleCancelForLock}
                      onConfirm={props.handleXMLSubmissionLockUnlock}
                      size="tiny"
                      className="deletion"
                    />
                  </Table.Cell>
                  <Table.Cell>
                    {xmlSubmission.lockedStatus !== true &&
                    <Button
                      icon
                      circular
                      color="red"
                      filingid={filingId}
                      xmlsubmissionid={xmlSubmission.xmlSubmissionId}
                      onClick={props.confirmDeleteForDuplicated}
                    >
                      <Icon name="trash" />
                    </Button>
                    }
                    <Confirm
                      header="Confirm"
                      content="Are you sure you want to delete this XML submission?"
                      open={props.confirmBoxDuplicated}
                      filingid={props.filingIdToBeDeleted}
                      xmlsubmissionid={props.xmlSubmissionIdToBeDeleted}
                      onCancel={props.handleDelCancelDuplicated}
                      onConfirm={props.handleXMlSubmissionDelete}
                      size="tiny"
                      className="deletion"
                    />
                  </Table.Cell>
                  {xmlSubmission.jobStatus === 'COMPLETED' &&
                  <Table.Cell>
                    <a href={xmlSubmission.xmlSubmissionDownloadUrl} download>Download</a>
                  </Table.Cell>
                  }
                </Table.Row>
              ))
            }
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
