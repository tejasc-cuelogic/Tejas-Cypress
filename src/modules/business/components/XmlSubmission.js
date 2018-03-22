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
                      {xmlSubmission.folderName}
                    </Link>
                  </Table.Cell>
                  <Table.Cell><DateTimeFormat datetime={xmlSubmission.created} /></Table.Cell>
                  <Table.Cell>
                    <Button
                      icon
                      circular
                      color="red"
                      className="link-button"
                      entity="xml"
                      refid={filingId}
                      subrefid={xmlSubmission.xmlSubmissionId}
                      onClick={props.confirmDelete}
                    >
                      <Icon name="trash" />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))
            }
            <Confirm
              header="Confirm"
              content="Are you sure you want to delete this XML submission?"
              open={props.confirmBoxValues.entity === 'xml'}
              onCancel={props.handleDeleteCancel}
              onConfirm={props.handleDeleteXMlSubmission}
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
