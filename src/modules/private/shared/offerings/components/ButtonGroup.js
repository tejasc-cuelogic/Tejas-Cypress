import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import { Button, Icon } from 'semantic-ui-react';

@inject('uiStore')
@observer
export default class ButtonGroup extends Component {
  render() {
    const {
      isManager, approved, updateOffer, isIssuer, submitted, issuerSubmitted,
    } = this.props;
    const { inProgress, htmlEditorImageLoading } = this.props.uiStore;
    return (
      <div className="sticky-actions">
        <Button.Group vertical icon size="tiny" className="time-stamp">
          {!isIssuer && issuerSubmitted &&
            <Button as="span" className="time-stamp">
              <Icon className="ns-circle-line" color="green" />{' '}
              Submitted by Issuer on {moment(issuerSubmitted).format('MM/DD/YYYY')}
            </Button>
          }
          {!isIssuer && submitted &&
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
              <Button disabled={htmlEditorImageLoading} loading={inProgress} type="button" inverted onClick={() => updateOffer({ isApproved: true, status: 'support_decline' })} color="red" content="Decline to NS Support" />
              {(!approved || (approved && !approved.status)) &&
              <Button disabled={htmlEditorImageLoading} loading={inProgress} type="button" primary onClick={updateOffer} color="green" className="relaxed">Save</Button>
              }
              <Button disabled={htmlEditorImageLoading} loading={inProgress} type="button" color="green" onClick={() => updateOffer({ isApproved: true, status: approved && approved.status ? 'manager_edit' : 'manager_approved' })} className="relaxed">{approved && approved.status ? 'Edit' : 'Approve'}</Button>
            </Aux>
          ) : isIssuer && (!approved || (approved && !approved.status)) ? (
            <Aux>
              {!issuerSubmitted &&
              <Button disabled={htmlEditorImageLoading} loading={inProgress} type="button" primary onClick={updateOffer} color="green" className="relaxed">Save</Button>
              }
              <Button disabled={htmlEditorImageLoading} loading={inProgress} type="button" primary={!issuerSubmitted} onClick={() => updateOffer({ isApproved: true, status: 'issuer_submitted' })} className="relaxed">{issuerSubmitted ? 'Awaiting Manager Approval' : 'Submit for Approval'}</Button>
            </Aux>
          ) : (!approved || (approved && !approved.status)) && (
            <Aux>
              {issuerSubmitted && !submitted &&
                <Button disabled={htmlEditorImageLoading} loading={inProgress} type="button" inverted onClick={() => updateOffer({ isApproved: true, status: 'issuer_decline' })} color="red" content="Unlock for Issuer" />
              }
              {!submitted &&
              <Button disabled={htmlEditorImageLoading} loading={inProgress} type="button" primary onClick={updateOffer} color="green" className="relaxed">Save</Button>
              }
              <Button disabled={htmlEditorImageLoading} loading={inProgress} type="button" primary={!submitted} onClick={() => updateOffer({ isApproved: true, status: 'support_submitted' })} className="relaxed">{submitted ? 'Awaiting Manager Approval' : 'Submit for Approval'}</Button>
            </Aux>
          )}
        </Button.Group>
      </div>
    );
  }
}
