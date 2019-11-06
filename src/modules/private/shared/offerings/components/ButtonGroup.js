import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import { Button, Icon } from 'semantic-ui-react';

const isMobile = document.documentElement.clientWidth < 768;
@inject('uiStore')
@observer
export default class ButtonGroup extends Component {
  render() {
    const {
      isManager, approved, updateOffer, isIssuer, submitted, issuerSubmitted, leaderFormInvalid, leaderFormErrorMsg,
    } = this.props;
    const { inProgress, htmlEditorImageLoading } = this.props.uiStore;
    return (
      <div className="sticky-actions">
        {leaderFormInvalid
          && <p className="negative-text right-align"><small>{leaderFormErrorMsg}</small></p>
        }
        <Button.Group vertical icon size="tiny" className="time-stamp">
          {!isIssuer && issuerSubmitted
            && (
<Button as="span" className="time-stamp">
              <Icon className="ns-circle-line" color="green" />{' '}
              Submitted by Issuer on {moment(issuerSubmitted).format('MM/DD/YYYY')}
            </Button>
            )
          }
          {!isIssuer && submitted
            && (
<Button as="span" className="time-stamp">
              <Icon className="ns-circle" color="green" />{' '}
              Submitted by {submitted.by} on {moment(submitted.date).format('MM/DD/YYYY')}
            </Button>
            )
          }
          {approved && approved.status
            && (
<Button as="span" className="time-stamp">
              <Icon className="ns-check-circle" color="green" />{' '}
              Approved by {approved.by} on {moment(approved.date).format('MM/DD/YYYY')}
            </Button>
            )
          }
        </Button.Group>
        <Button.Group size={isMobile ? 'mini' : ''} compact={isMobile} className={isMobile ? 'sticky-buttons' : ''}>
          {isManager && submitted ? (
            <>
              <Button disabled={leaderFormInvalid || htmlEditorImageLoading} loading={inProgress === 'support_decline'} type="button" inverted onClick={() => updateOffer({ isApproved: true, status: 'support_decline' })} color="red" content="Decline to NS Support" />
              {(!approved || (approved && !approved.status))
              && <Button disabled={leaderFormInvalid || htmlEditorImageLoading} loading={inProgress === 'save'} type="button" primary onClick={updateOffer} color="green" className="relaxed">Save</Button>
              }
              <Button disabled={leaderFormInvalid || htmlEditorImageLoading} loading={inProgress === 'manager_edit' || inProgress === 'manager_approved'} type="button" color="green" onClick={() => updateOffer({ isApproved: true, status: approved && approved.status ? 'manager_edit' : 'manager_approved' })} className="relaxed">{approved && approved.status ? 'Edit' : 'Approve'}</Button>
            </>
          ) : isIssuer && (!approved || (approved && !approved.status)) ? (
            <>
              {!issuerSubmitted
              && <Button disabled={leaderFormInvalid || htmlEditorImageLoading} loading={inProgress === 'save'} type="button" primary onClick={updateOffer} color="green" className="relaxed">Save</Button>
              }
              <Button disabled={leaderFormInvalid || htmlEditorImageLoading || issuerSubmitted} loading={inProgress === 'issuer_submitted'} type="button" primary={!issuerSubmitted} onClick={() => updateOffer({ isApproved: true, status: 'issuer_submitted' })} className="relaxed">{issuerSubmitted ? 'Awaiting Manager Approval' : 'Submit for Approval'}</Button>
            </>
          ) : (!approved || (approved && !approved.status)) && (
            <>
              {issuerSubmitted && !submitted
                && <Button disabled={leaderFormInvalid || htmlEditorImageLoading} loading={inProgress === 'issuer_decline'} type="button" inverted onClick={() => updateOffer({ isApproved: true, status: 'issuer_decline' })} color="red" content="Unlock for Issuer" />
              }
              {!submitted
              && <Button disabled={leaderFormInvalid || htmlEditorImageLoading} loading={inProgress === 'save'} type="button" primary onClick={updateOffer} color="green" className="relaxed">Save</Button>
              }
              <Button disabled={leaderFormInvalid || htmlEditorImageLoading || submitted} loading={inProgress === 'support_submitted'} type="button" primary={!submitted} onClick={() => updateOffer({ isApproved: true, status: 'support_submitted' })} className="relaxed">{submitted ? 'Awaiting Manager Approval' : 'Submit for Approval'}</Button>
            </>
          )}
        </Button.Group>
      </div>
    );
  }
}
