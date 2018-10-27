import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import moment from 'moment';
import { Header, Button, Divider, Icon } from 'semantic-ui-react';
import { FormTextarea } from '../../../../../../../theme/form';
import { BUSINESS_APPLICATION_STATUS } from '../../../../../../../services/constants/businessApplication';

@inject('businessAppReviewStore', 'uiStore')
@observer
export default class ManagerOverview extends Component {
  render() {
    const { formChange, MANAGERS_FRM, saveReviewForms } = this.props.businessAppReviewStore;
    const {
      isReadonly, approved, formName, isManager, submitted, stepStatus,
      uiStore, title, applicationStatus,
    } = this.props;
    const { inProgress } = uiStore;
    return (
      ((!isManager && isReadonly && approved && approved.status) || (isManager && submitted)) ?
        <Aux>
          <Header as="h4">
            Manager
            {approved && approved.status && submitted &&
            <Button.Group floated="right" size="mini">
              <Button as="span" className="time-stamp">
                <Icon className="ns-check-circle" color="green" />
                Submitted By {submitted.by} on {moment(submitted.date).format('MM/DD/YYYY')}
              </Button>
              <Button as="span" className="time-stamp">
                <Icon className="ns-check-circle" color="green" />
                Approved By {approved.by} on {moment(approved.date).format('MM/DD/YYYY')}
              </Button>
              {isManager && approved && approved.status && applicationStatus
              !== BUSINESS_APPLICATION_STATUS.APPLICATION_SUCCESSFUL &&
              <Button className="relaxed" loading={inProgress} inverted color="red" type="button" onClick={() => saveReviewForms(formName, 'REVIEW_APPROVED', false)}>Decline</Button>
              }
            </Button.Group>
            }
            {!isReadonly && isManager && submitted &&
              <Button.Group floated="right" size="mini">
                {submitted &&
                  <Button as="span" className="time-stamp">
                    <Icon className="ns-check-circle" color="green" />
                    Submitted By {submitted.by} on {moment(submitted.date).format('MM/DD/YYYY')}
                  </Button>
                }
                <Button loading={inProgress} disabled={!MANAGERS_FRM.meta.isValid || !this.props.isValid} className="relaxed" inverted color="red" type="button" onClick={() => saveReviewForms(formName, 'REVIEW_APPROVED', false)}>Decline</Button>
                <Button loading={inProgress} disabled={stepStatus || !MANAGERS_FRM.meta.isValid || !this.props.isValid} primary className="relaxed">Save</Button>
                <Button loading={inProgress} disabled={stepStatus || !MANAGERS_FRM.meta.isValid || !this.props.isValid} primary className="relaxed" type="button" onClick={() => saveReviewForms(formName, 'REVIEW_APPROVED')}>{title || 'Approve'}</Button>
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
