import React from 'react';
import Aux from 'react-aux';
import moment from 'moment';
import { Button, Icon } from 'semantic-ui-react';

const ButtonGroupType2 = ({
  formValid, isManager, approved, updateOffer, submitted,
}) => (
  <Aux>
    <div className="clearfix sticky-actions">
      <Button.Group vertical icon className="time-stamp">
        {submitted &&
          <Button as="span" className="time-stamp">
            <Icon className="ns-check-circle" color="green" />{' '}
            Submitted by {submitted.by} on {moment(submitted.date).format('MM/DD/YYYY')}
          </Button>
        }
        {approved && approved.status &&
          <Button as="span" className="time-stamp">
            <Icon className="ns-check-circle" color="green" />{' '}
            Approved by {approved.by} on {moment(approved.date).format('MM/DD/YYYY')}
          </Button>
        }
      </Button.Group>
      <Button.Group floated="right">
        {isManager && submitted ? (
          <Aux>
            <Button inverted onClick={() => updateOffer({ isApproved: true, status: false })} color="red" content="Decline" disabled={!formValid} />
            {approved && !approved.status &&
            <Button color="green" onClick={() => updateOffer({ isApproved: true, status: true })} className="relaxed" disabled={!formValid}>Approve</Button>
            }
          </Aux>
        ) : (!approved || (approved && !approved.status)) && (
          <Aux>
            {!submitted &&
            <Button primary onClick={updateOffer} color="green" className="relaxed" disabled={!formValid}>Save</Button>
            }
            <Button primary={!submitted} onClick={() => updateOffer({ submitted: true })} className="relaxed" disabled={!formValid || submitted}>{submitted ? 'Awaiting Manager Approval' : 'Submit for Approval'}</Button>
          </Aux>
        )}
      </Button.Group>
    </div>
  </Aux>
);

export default ButtonGroupType2;
