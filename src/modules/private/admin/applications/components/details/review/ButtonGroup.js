import React from 'react';
import Aux from 'react-aux';
import moment from 'moment';
import { Button, Icon } from 'semantic-ui-react';

const ButtonGroup = ({
  formName, submitted, approved, isManager, submitWithApproval, inProgress,
}) => (
  <Aux>
    {((isManager && !submitted) ||
    (!isManager && (!approved || (approved && !approved.status)))) &&
    <div className="right-align mt-30">
      <Button.Group>
        {((isManager && !submitted) || (!isManager && !submitted)) &&
        <Button loading={inProgress === 'SAVE'} secondary className="relaxed">Save</Button>
        }
        {submitted &&
          <Button as="span" className="time-stamp">
            <Icon className="ns-circle" color="green" />
            Submitted By {submitted.by} on {moment(submitted.date).format('MM/DD/YYYY')}
          </Button>
        }
        <Button loading={inProgress === 'REVIEW_SUBMITTED'} onClick={() => submitWithApproval(formName, 'REVIEW_SUBMITTED')} disabled={!((isManager && !submitted) || (!isManager && !submitted))} primary={((isManager && !submitted) || (!isManager && !submitted))} type="button">{((isManager && !submitted) || (!isManager && !submitted)) ? 'Submit for Approval' : 'Awaiting Manager Approval'}</Button>
      </Button.Group>
    </div>
    }
  </Aux>
);

export default ButtonGroup;
