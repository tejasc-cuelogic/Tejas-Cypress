import React from 'react';
import Aux from 'react-aux';
import moment from 'moment';
import { Button, Icon } from 'semantic-ui-react';

const ButtonGroupType2 = ({
  isManager, approved, updateOffer, submitted,
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
            <Button inverted onClick={() => updateOffer({ isAdminOnly: true, isApproved: true, status: 'support_decline' })} color="red" content="Decline" />
            {(!approved || (approved && !approved.status)) &&
            <Button primary onClick={updateOffer} color="green" className="relaxed">Save</Button>
            }
            <Button color="green" onClick={() => updateOffer({ isAdminOnly: true, isApproved: true, status: approved && approved.status ? 'manager_edit' : 'manager_approved' })} className="relaxed">{approved && approved.status ? 'Edit' : 'Approve'}</Button>
          </Aux>
        ) : (!approved || (approved && !approved.status)) && (
          <Aux>
            {!submitted &&
            <Button primary onClick={updateOffer} color="green" className="relaxed">Save</Button>
            }
            <Button primary={!submitted} onClick={() => updateOffer({ isAdminOnly: true, isApproved: true, status: 'support_submitted' })} className="relaxed">{submitted ? 'Awaiting Manager Approval' : 'Submit for Approval'}</Button>
          </Aux>
        )}
      </Button.Group>
    </div>
  </Aux>
);

export default ButtonGroupType2;
