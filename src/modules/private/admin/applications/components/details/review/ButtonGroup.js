import React from 'react';
import Aux from 'react-aux';
import moment from 'moment';
import { Button, Icon, Divider } from 'semantic-ui-react';

const ButtonGroup = ({
  formName, submitted, approved, isManager, submitWithApproval,
  inProgress, isReadonly, showDeclinedBtn, updateApplicationStatus,
}) => (
  <Aux>
    {((isManager && !submitted) ||
    (!isManager && (!approved || (approved && !approved.status)))) ?
      <Aux>
        <Divider hidden />
        <div className="sticky-actions">
          <Button.Group vertical icon size="tiny" className="time-stamp">
            {submitted &&
              <Button as="span" className="time-stamp">
                <Icon className="ns-circle" color="green" />{' '}
                Submitted By {submitted.by} on {moment(submitted.date).format('MM/DD/YYYY')}
              </Button>
            }
          </Button.Group>
          <Button.Group>
            {((isManager && !submitted) || (!isManager && !submitted)) &&
            <Button secondary className="relaxed" content="Save" loading={inProgress === 'SAVE'} />
            }
            <Button loading={inProgress === 'REVIEW_SUBMITTED'} onClick={() => submitWithApproval(formName, 'REVIEW_SUBMITTED')} disabled={!((isManager && !submitted) || (!isManager && !submitted))} primary={((isManager && !submitted) || (!isManager && !submitted))}>{((isManager && !submitted) || (!isManager && !submitted)) ? 'Submit for Approval' : 'Awaiting Manager Approval'}</Button>
            {showDeclinedBtn &&
              <Button loading={inProgress === 'REVIEW_FAILED'} onClick={updateApplicationStatus} color="red" >Decline Application</Button>
            }
          </Button.Group>
        </div>
      </Aux> :
      ((!isManager && isReadonly && approved && approved.status) || (isManager && submitted)) &&
      (!isReadonly && isManager && submitted) &&
      <Aux>
        <Divider hidden />
        <div className="sticky-actions">
          <Button.Group className="time-stamp" />
          <Button primary className="relaxed" content="Save" loading={inProgress === 'SAVE'} />
        </div>
      </Aux>
      }
  </Aux>
);

export default ButtonGroup;
