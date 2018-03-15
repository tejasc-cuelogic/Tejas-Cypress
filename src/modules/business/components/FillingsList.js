import React from 'react';
import { observer } from 'mobx-react';
import { Accordion, Icon, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import XmlSubmission from './XmlSubmission';

const FillingsList = observer(props => (
  <Accordion>
    {
      props.filings.map(filing => (
        <div key={`${filing.created}_${filing.filingId}`}>
          <Accordion.Title
            active={filing.filingId === props.openAccordion}
            onClick={props.handleAccordionClick}
            dataid={filing.filingId}
          >
            <Icon name="dropdown" />
            {filing.filingId} | {filing.created} |
            <Link to={`/app/business/edgar/${filing.filingId}`} as={Button}>
              <Icon name="eye" />
            </Link>
            <Button><Icon name="trash" /></Button>
          </Accordion.Title>
          <XmlSubmission
            xmlSubmissions={filing.xmlSubmissions || []}
            active={filing.filingId === props.openAccordion}
          />
        </div>
      ))
    }
  </Accordion>
));

export default FillingsList;
