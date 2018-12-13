import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import moment from 'moment';
import { Header, Button, Divider, Icon } from 'semantic-ui-react';
import { FormTextarea } from '../../../../../../../theme/form';
import { BUSINESS_APPLICATION_STATUS } from '../../../../../../../services/constants/businessApplication';

@inject('businessAppReviewStore')
@observer
export default class ManagerOverview extends Component {
  render() {
    const {
      formChange, MANAGERS_FRM, saveReviewForms, inProgress,
    } = this.props.businessAppReviewStore;
    const {
      isReadonly, approved, formName, isManager, submitted,
      title, applicationStatus,
    } = this.props;
    return (
      ((!isManager && isReadonly && approved && approved.status) || (isManager && submitted)) ?
        <Aux>
          <Header as="h4">
            Manager
            {!isReadonly && isManager && submitted &&
              <Button primary size="mini" floated="right" className="relaxed" content="Save" loading={inProgress === 'SAVE'} />
            }
          </Header>
          <FormTextarea
            name="managerOverview"
            fielddata={MANAGERS_FRM.fields.managerOverview}
            changed={(e, result) => formChange(e, result, 'MANAGERS_FRM')}
            readOnly={isReadonly}
            containerclassname={isReadonly ? 'display-only secondary' : 'secondary'}
          />
          {approved && approved.status && submitted &&
          <div className="sticky-actions at-top">
            <Button.Group vertical icon size="tiny" className="time-stamp">
              <Button as="span" className="time-stamp">
                <Icon className="ns-circle" color="green" />{' '}
                Submitted By {submitted.by} on {moment(submitted.date).format('MM/DD/YYYY')}
              </Button>
              <Button as="span" className="time-stamp">
                <Icon className="ns-check-circle" color="green" />{' '}
                Approved By {approved.by} on {moment(approved.date).format('MM/DD/YYYY')}
              </Button>
            </Button.Group>
            {isManager && approved && approved.status && applicationStatus
            !== BUSINESS_APPLICATION_STATUS.APPLICATION_SUCCESSFUL &&
            <Button.Group>
              <Button inverted className="relaxed" color="red" content="Decline" loading={inProgress === 'REVIEW_DECLINED'} onClick={() => saveReviewForms(formName, 'REVIEW_APPROVED', 'SUPPORT_DECLINE')} />
              <Button primary className="relaxed" content="Edit" loading={inProgress === 'REVIEW_APPROVED'} onClick={() => saveReviewForms(formName, 'REVIEW_APPROVED', 'MANAGER_EDIT')} />
            </Button.Group>
            }
          </div>
          }
          {!isReadonly && isManager && submitted &&
            <div className="sticky-actions at-top">
              <Button.Group vertical icon size="tiny" className="time-stamp">
                {submitted &&
                  <Button as="span" className="time-stamp">
                    <Icon className="ns-circle" color="green" />{' '}
                    Submitted By {submitted.by} on {moment(submitted.date).format('MM/DD/YYYY')}
                  </Button>
                }
              </Button.Group>
              <Button.Group>
                <Button inverted color="red" className="relaxed" content="Decline" loading={inProgress === 'REVIEW_DECLINED'} onClick={() => saveReviewForms(formName, 'REVIEW_APPROVED', 'SUPPORT_DECLINE')} />
                {/* <Button primary className="relaxed"
                content="Save" loading={inProgress === 'SAVE'} /> */}
                <Button primary className="relaxed" content={title || 'Approve'} loading={inProgress === 'REVIEW_APPROVED'} disabled={!MANAGERS_FRM.meta.isValid} onClick={() => saveReviewForms(formName, 'REVIEW_APPROVED', 'MANAGER_APPROVE')} />
              </Button.Group>
            </div>
          }
          <Divider section />
        </Aux> : null
    );
  }
}
