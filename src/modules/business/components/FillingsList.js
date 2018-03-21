import React from 'react';
import { observer } from 'mobx-react';
import { Accordion, Icon, Card, Button, Confirm } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import DateTimeFormat from './../../../components/common/DateTimeFormat';
import XmlSubmission from './XmlSubmission';

const FillingsList = observer((props) => {
  console.log(props.filings);
  if (!_.isEmpty(props.filings)) {
    return (
      <Accordion fluid styled className="filing-list">
        {
          props.filings.map(filing => (
            <div key={`${filing.created}_${filing.filingId}`}>
              <Accordion.Title
                active={props.openAccordion.indexOf(filing.filingId) === -1}
                onClick={props.handleAccordionClick}
                dataid={filing.filingId}
              >
                <Icon name="dropdown" />
                <span>
                  Filing | <DateTimeFormat datetime={filing.created} />
                </span>
                <div className="actions">
                  <Link to={`/app/business/${props.businessId}/edgar/${filing.filingId}`}>
                    View
                  </Link>
                  <Button
                    icon
                    circular
                    color="red"
                    filingid={filing.filingId}
                    onClick={props.confirmDeleteForDuplicatedAgain}
                  >
                    <Icon name="trash" />
                  </Button>
                  <Confirm
                    header="Confirm"
                    content="Are you sure you want to delete this filing?"
                    open={props.confirmBoxDuplicatedAgain}
                    filingid={props.filingIdToBeDeleted}
                    onCancel={props.handleDelCancelDuplicatedAgain}
                    onConfirm={props.handleFilingDelete}
                    size="tiny"
                    className="deletion"
                  />
                </div>
              </Accordion.Title>
              <XmlSubmission
                xmlSubmissions={filing.submissions || []}
                filingId={filing.filingId}
                active={props.openAccordion.indexOf(filing.filingId) === -1}
                businessId={props.businessId}
                filingIdToBeDeleted={props.filingIdToBeDeleted}
                xmlSubmissionIdToBeDeleted={props.xmlSubmissionIdToBeDeleted}
                confirmDeleteForDuplicated={props.confirmDeleteForDuplicated}
                confirmBoxDuplicated={props.confirmBoxDuplicated}
                handleDelCancelDuplicated={props.handleDelCancelDuplicated}
                handleXMlSubmissionDelete={props.handleXMlSubmissionDelete}
              />
            </div>
          ))
        }
      </Accordion>
    );
  }
  return (
    <Card centered>
      <Card.Content textAlign="center">
        No filing is present for this business
      </Card.Content>
    </Card>
  );
});

export default FillingsList;
