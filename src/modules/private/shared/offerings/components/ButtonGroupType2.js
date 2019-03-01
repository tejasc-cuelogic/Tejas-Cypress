import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import { Button, Icon, Checkbox, Divider } from 'semantic-ui-react';

@inject('uiStore')
@observer
export default class ButtonGroupType2 extends Component {
  state = { canLaunch: false };
  render() {
    const {
      isManager, approved, updateOffer,
      submitted, launch,
    } = this.props;
    const { inProgress } = this.props.uiStore;
    const { canLaunch } = this.state;
    return (
      <Aux>
        {launch && approved && approved.status && (
          <Aux>
            <div className="mb-10">
              <Checkbox
                label="Launch Sign-Off"
                onClick={() => this.setState({ canLaunch: !canLaunch })}
              />
            </div>
            <Divider hidden />
          </Aux>
        )}
        <div className="sticky-actions">
          <Button.Group vertical icon size="tiny" className="time-stamp">
            {submitted &&
              <Button as="span" className="time-stamp">
                <Icon className="ns-circle" color="green" />{' '}
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
          <Button.Group>
            {isManager && submitted ? (
              <Aux>
                <Button loading={inProgress === 'support_decline'} type="button" inverted onClick={() => updateOffer({ isAdminOnly: true, isApproved: true, status: 'support_decline' })} color="red" content="Decline" />
                {(!approved || (approved && !approved.status)) &&
                <Button loading={inProgress === 'save'} primary onClick={updateOffer} color="green" className="relaxed">Save</Button>
                }
                <Button loading={inProgress === 'manager_edit' || inProgress === 'manager_approved'} type="button" color="green" onClick={() => updateOffer({ isAdminOnly: true, isApproved: true, status: approved && approved.status ? 'manager_edit' : 'manager_approved' })} className="relaxed">{approved && approved.status ? 'Edit' : 'Approve'}</Button>
                {launch && approved && approved.status && (
                  <Button loading={inProgress} type="button" disabled={!this.state.canLaunch} onClick={launch} color="green"className="relaxed">Launch</Button>
                )}
              </Aux>
            ) : (!approved || (approved && !approved.status)) && (
              <Aux>
                {!submitted &&
                <Button loading={inProgress === 'save'} type="button" primary onClick={updateOffer} color="green" className="relaxed">Save</Button>
                }
                <Button loading={inProgress === 'support_submitted'} type="button" primary={!submitted} onClick={() => updateOffer({ isAdminOnly: true, isApproved: true, status: 'support_submitted' })} className="relaxed">{submitted ? 'Awaiting Manager Approval' : 'Submit for Approval'}</Button>
              </Aux>
            )}
          </Button.Group>
        </div>
      </Aux>
    );
  }
}
