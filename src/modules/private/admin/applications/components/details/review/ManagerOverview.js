import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Header, Button, Divider, Icon } from 'semantic-ui-react';
import { FormTextarea } from '../../../../../../../theme/form';
import { BUSINESS_APPLICATION_STATUS } from '../../../../../../../services/constants/businessApplication';

@inject('businessAppReviewStore', 'uiStore')
@observer
export default class ManagerOverview extends Component {
  render() {
    const { formChange, MANAGERS_FRM, saveReviewForms } = this.props.businessAppReviewStore;
    const {
      isReadonly, approved, formName, isManager, stepStatus, uiStore, title, applicationStatus,
    } = this.props;
    const { inProgress } = uiStore;
    return (
      <Aux>
        {((!isManager && isReadonly && approved && approved.status) || isManager) &&
        <Aux>
          <Header as="h4">
            Manager
            {approved && approved.status &&
              <Button.Group floated="right" size="mini">
                <Button as="span" className="time-stamp">
                  <Icon className="ns-check-circle" color="green" />
                  Approved By {approved.by}
                </Button>
                {isManager && applicationStatus
                !== BUSINESS_APPLICATION_STATUS.APPLICATION_SUCCESSFUL &&
                <Button className="relaxed" loading={inProgress} inverted color="red" type="button" onClick={() => saveReviewForms(formName, 'REVIEW_APPROVED', false)}>Decline</Button>
                }
              </Button.Group>
            }
            {!isReadonly && isManager &&
              <Button.Group floated="right" size="mini">
                <Button loading={inProgress} disabled={!MANAGERS_FRM.meta.isValid || !this.props.isValid} className="relaxed" inverted color="red" type="button" onClick={() => saveReviewForms(formName, 'REVIEW_APPROVED', false)}>Decline</Button>
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
        </Aux>
        }
      </Aux>
    );
  }
}
