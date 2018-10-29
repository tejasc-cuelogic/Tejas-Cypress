import React from 'react';
import Aux from 'react-aux';
import moment from 'moment';
import { Button, Icon } from 'semantic-ui-react';

const ButtonGroup = ({
  formValid, isManager, approved, updateOffer, isIssuer, submitted, issuerSubmitted,
}) => (
  <Aux>
    <div className="right-align sticky-actions">
      <Button.Group>
        {isIssuer && issuerSubmitted &&
          <Button as="span" className="time-stamp">
            <Icon className="ns-check-circle" color="green" />
            Submitted by USER_NAME on {moment(issuerSubmitted).format('MM/DD/YYYY')}
          </Button>
        }
        {submitted &&
        <Button as="span" className="time-stamp">
          <Icon className="ns-check-circle" color="green" />
          Submitted by {submitted.by} on {moment(submitted.date).format('MM/DD/YYYY')}
        </Button>
        }
        {approved && approved.status &&
        <Button as="span" className="time-stamp">
          <Icon className="ns-check-circle" color="green" />
          Approved by {approved.by} on {moment(approved.date).format('MM/DD/YYYY')}
        </Button>
      }
        {isManager && submitted ? (
          <Aux>
            <Button inverted onClick={() => updateOffer(false)} color="red" content="Decline" disabled={!formValid} />
            <Button color="green" onClick={() => updateOffer(approved && approved.status ? !approved.status : true)} className="relaxed" disabled={!formValid}>{approved && approved.status ? 'Edit' : 'Approve'}</Button>
          </Aux>
        ) : isIssuer ? (
          <Button primary onClick={updateOffer} color="green" className="relaxed" disabled={!formValid}>Save</Button>
        ) : (
          <Button primary={submitted} onClick={updateOffer} className="relaxed" disabled={!formValid || submitted}>{submitted ? 'Awaiting Manager Approval' : 'Submit for Approval'}</Button>
        )}
      </Button.Group>
    </div>
  </Aux>
);

export default ButtonGroup;
