import React from 'react';
import { observer } from 'mobx-react';
import { Accordion, Icon, Card, Button, Confirm } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { DateTimeFormat } from '../../../../../theme/shared';
import XmlSubmission from './XmlSubmission';

const FillingsList = observer((props) => {
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
                  {filing.filingFolderName}, <DateTimeFormat datetime={filing.created} />
                </span>
                <div className="actions">
                  <Link
                    to={(`${process.env.REACT_APP_BOX_URL}/folder/${filing.folderId}`)}
                    target="_blank"
                    className="text-link"
                  >
                    Documents
                  </Link>
                  <Link to={`/dashboard/edgar/${props.businessId}/edgar/${filing.filingId}`}>
                    View
                  </Link>
                  <Button
                    color="red"
                    className="link-button"
                    entity="filing"
                    filings={props.filings}
                    refid={props.businessId}
                    subrefid={filing.filingId}
                    onClick={props.confirmDelete}
                  >
                    Delete
                  </Button>
                </div>
              </Accordion.Title>
              <XmlSubmission
                xmlSubmissions={filing.submissions || []}
                filingId={filing.filingId}
                active={props.openAccordion.indexOf(filing.filingId) === -1}
                businessId={props.businessId}
                confirmBoxValues={props.confirmBoxValues}
                confirmDelete={props.confirmDelete}
                handleDeleteCancel={props.handleDeleteCancel}
                handleDeleteXMlSubmission={props.handleDeleteXMlSubmission}
                handleXMLSubmissionLockUnlock={props.handleXMLSubmissionLockUnlock}
              />
            </div>
          ))
        }
        <Confirm
          header="Confirm"
          content="Are you sure you want to delete this filing and associated XML submissions?"
          open={props.confirmBoxValues.entity === 'filing' && props.confirmBoxValues.metaData.isAnyFilingXmlLocked === false}
          onCancel={props.handleDeleteCancel}
          onConfirm={props.handleDeleteFiling}
          size="mini"
          className="deletion"
        />
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
