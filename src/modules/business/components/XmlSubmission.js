import React from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Accordion, Button, Icon } from 'semantic-ui-react';

const XmlSubmission = observer(props => (
  props.xmlSubmissions.map(xmlSubmission => (
    <Accordion.Content active={props.active} key={xmlSubmission.id}>
      <Link to={`/app/business/xml/${xmlSubmission.id}`}>{xmlSubmission.created}</Link>
      <Button xmlid={xmlSubmission.id}><Icon name="trash" /></Button>
    </Accordion.Content>
  ))
));

export default XmlSubmission;
