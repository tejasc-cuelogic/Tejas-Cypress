import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import * as moment from 'moment';
import { Button, Icon } from 'semantic-ui-react';

@inject('uiStore')
@observer
export default class ButtonGroup extends Component {
  disableCta = disableCtaArgs => this.props.uiStore.disableCta(disableCtaArgs, this.props, ['leaderFormInvalid', 'htmlEditorImageLoading', 'loading']);

  render() {
    const {
      isManager, approved, updateOffer, isIssuer, submitted, issuerSubmitted, leaderFormInvalid, leaderFormErrorMsg, uiStore,
    } = this.props;
    const { inProgress } = this.props.uiStore;
    const isCtaLoading = ['support_decline', 'save', 'manager_edit', 'manager_approved', 'issuer_submitted', 'issuer_decline', 'support_submitted'].includes(inProgress);
    const isCtaDisabled = this.disableCta({ isCtaLoading });
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
        <Button.Group vertical={uiStore.responsiveVars.isMobile} size={uiStore.responsiveVars.isMobile ? 'mini' : ''} compact={uiStore.responsiveVars.isMobile} className={uiStore.responsiveVars.isMobile ? 'sticky-buttons' : ''}>
          {isManager && submitted ? (
            <>
              <Button disabled={isCtaDisabled} loading={inProgress === 'support_decline'} type="button" inverted onClick={() => updateOffer({ isApproved: true, status: 'support_decline' })} color="red" content="Decline to NS Support" />
              {(!approved || (approved && !approved.status))
                && <Button disabled={isCtaDisabled} loading={inProgress === 'save'} type="button" primary onClick={updateOffer} color="green" className="relaxed">Save</Button>
              }
              <Button disabled={isCtaDisabled} loading={inProgress === 'manager_edit' || inProgress === 'manager_approved'} type="button" color="green" onClick={() => updateOffer({ isApproved: true, status: approved && approved.status ? 'manager_edit' : 'manager_approved' })} className="relaxed">{approved && approved.status ? 'Edit' : 'Approve'}</Button>
            </>
          ) : isIssuer && (!approved || (approved && !approved.status)) ? (
            <>
              {!issuerSubmitted
                && <Button disabled={isCtaDisabled} loading={inProgress === 'save'} type="button" primary onClick={updateOffer} color="green" className="relaxed">Save</Button>
              }
              <Button disabled={this.disableCta({ isCtaLoading, issuerSubmitted })} loading={inProgress === 'issuer_submitted'} type="button" primary={!issuerSubmitted} onClick={() => updateOffer({ isApproved: true, status: 'issuer_submitted' })} className="relaxed">{issuerSubmitted ? 'Awaiting Manager Approval' : 'Submit for Approval'}</Button>
            </>
          ) : (!approved || (approved && !approved.status)) && (
            <>
              {issuerSubmitted && !submitted
                && <Button disabled={isCtaDisabled} loading={inProgress === 'issuer_decline'} type="button" inverted onClick={() => updateOffer({ isApproved: true, status: 'issuer_decline' })} color="red" content="Unlock for Issuer" />
              }
              {!submitted
                && <Button disabled={isCtaDisabled} loading={inProgress === 'save'} type="button" primary onClick={updateOffer} color="green" className="relaxed">Save</Button>
              }
              <Button disabled={this.disableCta({ isCtaLoading, submitted })} loading={inProgress === 'support_submitted'} type="button" primary={!submitted} onClick={() => updateOffer({ isApproved: true, status: 'support_submitted' })} className="relaxed">{submitted ? 'Awaiting Manager Approval' : 'Submit for Approval'}</Button>
            </>
          )}
        </Button.Group>
      </div>
    );
  }
}
