import React from 'react';
import { observer } from 'mobx-react';
import { Accordion, Icon, Card } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import DateTimeFormat from './../../../components/common/DateTimeFormat';
import XmlSubmission from './XmlSubmission';

const FillingsList = observer((props) => {
  if (!_.isEmpty(props.filings)) {
    return (
      <Accordion fluid styled className="filing-list">
        {
          props.filings.map(filing => (
            <div key={`${filing.created}_${filing.filingId}`}>
              <Accordion.Title
                active={filing.filingId === props.openAccordion}
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
                </div>
              </Accordion.Title>
              <XmlSubmission
                xmlSubmissions={filing.submissions || []}
                filingId={filing.filingId}
                active={filing.filingId === props.openAccordion}
                businessId={props.businessId}
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
