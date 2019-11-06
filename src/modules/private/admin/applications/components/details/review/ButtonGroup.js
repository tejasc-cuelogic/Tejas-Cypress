import React from 'react';
import moment from 'moment';
import { Button, Icon, Divider } from 'semantic-ui-react';
import { observer, inject } from 'mobx-react';

const ButtonGroup = ({
  formName, submitted, approved, isManager, submitWithApproval,
  inProgress, isReadonly, showDeclinedBtn, updateApplicationStatus, uiStore,
}) => (
  <>
    {((isManager && !submitted)
    || (!isManager && (!approved || (approved && !approved.status))))
      ? (
        <>
          <Divider hidden />
          <div className="sticky-actions">
            {submitted
            && (
            <Button.Group vertical icon size="tiny" className="time-stamp">
              <Button as="span" className="time-stamp">
                <Icon className="ns-circle" color="green" />{' '}
                Submitted By {submitted.by} on {moment(submitted.date).format('MM/DD/YYYY')}
              </Button>
            </Button.Group>
            )}
          <Button.Group vertical={uiStore.responsiveVars.isMobile} size={uiStore.responsiveVars.isMobile ? 'mini' : ''} compact={uiStore.responsiveVars.isMobile} className={uiStore.responsiveVars.isMobile ? 'sticky-buttons' : ''}>
            {((isManager && !submitted) || (!isManager && !submitted))
            && <Button secondary className="relaxed" content="Save" loading={inProgress === 'SAVE'} />
            }
            <Button loading={inProgress === 'REVIEW_SUBMITTED'} onClick={() => submitWithApproval(formName, 'REVIEW_SUBMITTED')} disabled={!((isManager && !submitted) || (!isManager && !submitted))} primary={((isManager && !submitted) || (!isManager && !submitted))}>{((isManager && !submitted) || (!isManager && !submitted)) ? 'Submit for Approval' : 'Awaiting Manager Approval'}</Button>
            {showDeclinedBtn
              && <Button loading={inProgress === 'REVIEW_FAILED'} onClick={updateApplicationStatus} color="red">Decline Application</Button>
            }
            </Button.Group>
          </div>
        </>
      )
      : ((!isManager && isReadonly && approved && approved.status) || (isManager && submitted))
      && (!isReadonly && isManager && submitted)
      && (
      <>
        <Divider hidden />
        <div className="sticky-actions">
          <Button.Group className="time-stamp" />
          <Button primary className="relaxed" content="Save" loading={inProgress === 'SAVE'} />
        </div>
      </>
      )
      }
  </>
);

export default inject('uiStore')(observer(ButtonGroup));
