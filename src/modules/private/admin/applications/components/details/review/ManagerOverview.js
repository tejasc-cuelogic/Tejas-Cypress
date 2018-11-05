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
            {approved && approved.status && submitted &&
            <Button.Group floated="right" size="mini">
              <Button as="span" className="time-stamp">
                <Icon className="ns-circle" color="green" />
                Submitted By {submitted.by} on {moment(submitted.date).format('MM/DD/YYYY')}
              </Button>
              <Button as="span" className="time-stamp">
                <Icon className="ns-check-circle" color="green" />
                Approved By {approved.by} on {moment(approved.date).format('MM/DD/YYYY')}
              </Button>
              {isManager && approved && approved.status && applicationStatus
              !== BUSINESS_APPLICATION_STATUS.APPLICATION_SUCCESSFUL &&
              <Aux>
                <Button className="relaxed" loading={inProgress === 'REVIEW_DECLINED'} inverted color="red" type="button" onClick={() => saveReviewForms(formName, 'REVIEW_APPROVED', 'SUPPORT_DECLINE')}>Decline</Button>
                <Button loading={inProgress === 'REVIEW_APPROVED'} primary className="relaxed" type="button" onClick={() => saveReviewForms(formName, 'REVIEW_APPROVED', 'MANAGER_EDIT')}>Edit</Button>
              </Aux>
              }
            </Button.Group>
            }
            {!isReadonly && isManager && submitted &&
              <Button.Group floated="right" size="mini">
                {submitted &&
                  <Button as="span" className="time-stamp">
                    <Icon className="ns-circle" color="green" />
                    Submitted By {submitted.by} on {moment(submitted.date).format('MM/DD/YYYY')}
                  </Button>
                }
                <Button loading={inProgress === 'REVIEW_DECLINED'} className="relaxed" inverted color="red" type="button" onClick={() => saveReviewForms(formName, 'REVIEW_APPROVED', 'SUPPORT_DECLINE')}>Decline</Button>
                <Button loading={inProgress === 'SAVE'} primary className="relaxed">Save</Button>
                <Button loading={inProgress === 'REVIEW_APPROVED'} disabled={!MANAGERS_FRM.meta.isValid} primary className="relaxed" type="button" onClick={() => saveReviewForms(formName, 'REVIEW_APPROVED', 'MANAGER_APPROVE')}>{title || 'Approve'}</Button>
              </Button.Group>
            }
          </Header>
          <FormTextarea
            name="managerOverview"
            fielddata={MANAGERS_FRM.fields.managerOverview}
            changed={(e, result) => formChange(e, result, 'MANAGERS_FRM')}
            readOnly={isReadonly}
            containerclassname={isReadonly ? 'display-only secondary' : 'secondary'}
          />
          <Divider section />
        </Aux> : null
    );
  }
}
