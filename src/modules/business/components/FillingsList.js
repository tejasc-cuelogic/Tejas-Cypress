import React from 'react';
import { observer } from 'mobx-react';
import { Accordion, Icon, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import _ from 'lodash';

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
                {`Filing | ${filing.created}`}
                <div className="actions">
                  <Link to={`/app/business/${props.businessId}/edgar/${filing.filingId}`} as={Button}>
                    <Icon name="eye" />
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
    <Accordion>
      <p>No filling is present for this business,
        <Link to={`/app/business/${props.businessId}/edgar`}>
          click here to create new
        </Link>
      </p>
    </Accordion>
  );
});

export default FillingsList;
