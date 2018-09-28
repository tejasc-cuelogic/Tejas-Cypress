import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Header, Button, Divider, Icon } from 'semantic-ui-react';
import { FormTextarea } from '../../../../../../../theme/form';

@inject('businessAppReviewStore')
@observer
export default class ManagerOverview extends Component {
  render() {
    const { formChange, MANAGERS_FRM, saveReviewForms } = this.props.businessAppReviewStore;
    const {
      isReadonly, approved, formName, isManager,
    } = this.props;
    return (
      <Aux>
        {((!isManager && isReadonly && approved && approved.status) || isManager) &&
        <Aux>
          <Header as="h4">
            Manager
            {approved && approved.status &&
            <Button.Group floated="right">
              <Button as="span" className="time-stamp">
                <Icon className="ns-check-circle" color="green" />
                Approved By {approved.by}
              </Button>
              {isManager &&
              <Button className="relaxed" inverted color="red" type="button" onClick={() => saveReviewForms(formName, 'REVIEW_APPROVED', false)}>Decline</Button>
              }
            </Button.Group>
            }
            {!isReadonly && isManager &&
              <div className="right-align">
                <Button.Group>
                  <Button disabled={!MANAGERS_FRM.meta.isValid} className="relaxed" inverted color="red" type="button" onClick={() => saveReviewForms(formName, 'REVIEW_APPROVED', false)}>Decline</Button>
                  <Button disabled={!MANAGERS_FRM.meta.isValid || !this.props.isValid} primary className="relaxed" type="button" onClick={() => saveReviewForms(formName, 'REVIEW_APPROVED')}>Approve</Button>
                </Button.Group>
              </div>
              }
          </Header>
          <FormTextarea
            name="managerOverview"
            fielddata={MANAGERS_FRM.fields.managerOverview}
            changed={(e, result) => formChange(e, result, 'MANAGERS_FRM')}
            disabled={isReadonly}
            containerclassname={isReadonly ? 'display-only secondary' : 'secondary'}
          />
          <Divider section />
        </Aux>
        }
      </Aux>
    );
  }
}
