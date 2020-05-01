import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import * as moment from 'moment';
import { Button, Icon, Checkbox, Divider } from 'semantic-ui-react';

@inject('uiStore')
@observer
export default class ButtonGroupType2 extends Component {
  state = { canLaunch: false };

  disableCta = disableCtaArgs => this.props.uiStore.disableCta(disableCtaArgs, this.props, ['htmlEditorImageLoading', 'loading']);

  render() {
    const {
      isManager, approved, updateOffer,
      submitted, launch, uiStore,
    } = this.props;
    const { inProgress } = this.props.uiStore;
    const { canLaunch } = this.state;
    const isCtaLoading = ['support_submitted', 'save', 'manager_edit', 'manager_approved', 'support_decline'].includes(inProgress);
    const isCtaDisabled = this.disableCta({ isCtaLoading });

    return (
      <>
        {launch && approved && approved.status && (
          <>
            <div className="mb-10">
              <Checkbox
                label="Launch Sign-Off"
                onClick={() => this.setState({ canLaunch: !canLaunch })}
              />
            </div>
            <Divider hidden />
          </>
        )}
        <div className="sticky-actions">
          <Button.Group vertical icon size="tiny" className="time-stamp">
            {submitted
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
                <Button disabled={isCtaDisabled} loading={inProgress === 'support_decline'} type="button" inverted onClick={() => updateOffer({ isAdminOnly: true, isApproved: true, status: 'support_decline' })} color="red" content="Decline" />
                {(!approved || (approved && !approved.status))
                  && <Button disabled={isCtaDisabled} loading={inProgress === 'save'} primary onClick={updateOffer} color="green" className="relaxed">Save</Button>
                }
                <Button disabled={isCtaDisabled} loading={inProgress === 'manager_edit' || inProgress === 'manager_approved'} type="button" color="green" onClick={() => updateOffer({ isAdminOnly: true, isApproved: true, status: approved && approved.status ? 'manager_edit' : 'manager_approved' })} className="relaxed">{approved && approved.status ? 'Edit' : 'Approve'}</Button>
                {launch && approved && approved.status && (
                  <Button loading={inProgress} type="button" disabled={!this.state.canLaunch} onClick={launch} color="green">Launch</Button>
                )}
              </>
            ) : (!approved || (approved && !approved.status)) && (
              <>
                {!submitted
                  && <Button disabled={isCtaDisabled} loading={inProgress === 'save'} type="button" primary onClick={updateOffer} color="green" className="relaxed">Save</Button>
                }
                <Button disabled={this.disableCta({ isCtaLoading, submitted })} loading={inProgress === 'support_submitted'} type="button" primary={!submitted} onClick={() => updateOffer({ isAdminOnly: true, isApproved: true, status: 'support_submitted' })}>{submitted ? 'Awaiting Manager Approval' : 'Submit for Approval'}</Button>
              </>
            )}
          </Button.Group>
        </div>
      </>
    );
  }
}
