import React from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Accordion, Table } from 'semantic-ui-react';
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
