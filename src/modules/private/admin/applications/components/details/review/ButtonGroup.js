import React from 'react';
import Aux from 'react-aux';
import { Button } from 'semantic-ui-react';

const ButtonGroup = ({
  formValid, formName, isManager, approved, submitted, submitWithApproval,
}) => (
  <Aux>
    {!isManager && (!approved || (approved && !approved.status)) &&
    <div className="right-align">
      <Button.Group>
        {((approved && !approved.status) || !submitted) &&
        <Button disabled={!((formValid) || ((approved && !approved.status) || !submitted))} secondary className="relaxed">Save</Button>
        }
        <Button onClick={() => submitWithApproval(formName, 'REVIEW_SUBMITTED')} disabled={!((formValid) || ((approved && !approved.status) || !submitted))} primary={((approved && !approved.status) || !submitted)} type="button">{((approved && !approved.status) || !submitted) ? 'Submit for Approval' : 'Awaiting Manager Approval'}</Button>
      </Button.Group>
    </div>
    }
  </Aux>
);

export default ButtonGroup;
