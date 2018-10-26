import React from 'react';
import Aux from 'react-aux';
import { Button } from 'semantic-ui-react';

const ButtonGroup = ({
  formValid, formName, isManager, approved, submitted, submitWithApproval,
}) => (
  <Aux>
    {!isManager && (!approved || (approved && !approved.status)) &&
    <div className="right-align mt-30">
      <Button.Group>
        {(!submitted || (approved && !approved.status && !submitted)) &&
        <Button disabled={!formValid} secondary className="relaxed">Save</Button>
        }
        <Button onClick={() => submitWithApproval(formName, 'REVIEW_SUBMITTED')} disabled={!(formValid) || !(!submitted || (approved && !approved.status && !submitted))} primary={(!submitted || (approved && !approved.status && !submitted))} type="button">{(!submitted || (approved && !approved.status && !submitted)) ? 'Submit for Approval' : 'Awaiting Manager Approval'}</Button>
      </Button.Group>
    </div>
    }
  </Aux>
);

export default ButtonGroup;
