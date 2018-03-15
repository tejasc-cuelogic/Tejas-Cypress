import React from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Accordion, Table, Card } from 'semantic-ui-react';
import _ from 'lodash';

const XmlSubmission = observer((props) => {
  if (!_.isEmpty(props.xmlSubmissions)) {
    return (
      <Accordion.Content active={props.active} key={props.filingId}>
        <Table basic celled collapsing>
          <Table.Body>
            {
              props.xmlSubmissions.map(xmlSubmission => (
                <Table.Row>
                  <Table.Cell>
                    <Link to={`/app/business/xml/${xmlSubmission.xmlSubmissionId}`}>
                      {'XML Submission'}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{`${xmlSubmission.created}`}</Table.Cell>
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
      <Card color="red" className="flexible">
        <Card.Content>
          No XML Submissions are present for this filling, <Link to="/app/business/xml">Click here to create new.</Link>
        </Card.Content>
      </Card>
      {/* <p>No XML Submissions are present for this filling,
        <Link to="/app/business/xml">
          Click here to create new.
        </Link>
      </p> */}
    </Accordion.Content>
  );
});

export default XmlSubmission;
