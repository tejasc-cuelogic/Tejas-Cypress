import React from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Accordion } from 'semantic-ui-react';
import _ from 'lodash';

const XmlSubmission = observer((props) => {
  if (!_.isEmpty(props.xmlSubmissions)) {
    return (
      <Accordion.Content active={props.active} key={props.filingId}>
        {
          props.xmlSubmissions.map(xmlSubmission => (
            <div>
              <Link to={`/app/business/xml/${xmlSubmission.xmlSubmissionId}`}>
                {`XML Submission | ${xmlSubmission.created}`}
              </Link>
            </div>
          ))
        }
      </Accordion.Content>
    );
  }
  return (
    <Accordion.Content active={props.active}>
      <p>No XML Submissions are present for this filling,
        <Link to="/app/business/xml">
          Click here to create new.
        </Link>
      </p>
    </Accordion.Content>
  );
});

export default XmlSubmission;
