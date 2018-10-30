import React from 'react';
import Aux from 'react-aux';
import moment from 'moment';
import { Button, Icon } from 'semantic-ui-react';

const ButtonGroup = ({
  formValid, formName, submitted, approved, isManager, submitWithApproval,
}) => (
  <Aux>
    {((isManager && !submitted) ||
    (!isManager && (!approved || (approved && !approved.status)))) &&
    <div className="right-align mt-30">
      <Button.Group>
        {((isManager && !submitted) || (!isManager && !submitted)) &&
        <Button disabled={!formValid} secondary className="relaxed">Save</Button>
        }
        {submitted &&
          <Button as="span" className="time-stamp">
            <Icon className="ns-check-circle" color="green" />
            Submitted By {submitted.by} on {moment(submitted.date).format('MM/DD/YYYY')}
          </Button>
        }
        <Button onClick={() => submitWithApproval(formName, 'REVIEW_SUBMITTED')} disabled={!(formValid) || !((isManager && !submitted) || (!isManager && !submitted))} primary={((isManager && !submitted) || (!isManager && !submitted))} type="button">{((isManager && !submitted) || (!isManager && !submitted)) ? 'Submit for Approval' : 'Awaiting Manager Approval'}</Button>
      </Button.Group>
    </div>
    }
  </Aux>
);

export default ButtonGroup;
