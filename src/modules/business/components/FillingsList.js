import React from 'react';
import { observer } from 'mobx-react';
import { Accordion, Icon } from 'semantic-ui-react';

import XmlSubmission from './XmlSubmission';

const FillingsList = observer(props => (
  <Accordion>
    {
      props.fillings.map(filling => (
        <div key={`${filling.created}_${filling.id}`}>
          <Accordion.Title
            active={filling.id === props.openAccordion}
            onClick={props.handleAccordionClick}
            dataid={filling.id}
          >
            <Icon name="dropdown" />
            {filling.id} | {filling.created} |
          </Accordion.Title>
          <XmlSubmission
            xmlSubmissions={filling.xmlSubmissions}
            active={filling.id === props.openAccordion}
          />
        </div>
      ))
    }
  </Accordion>
));

export default FillingsList;
