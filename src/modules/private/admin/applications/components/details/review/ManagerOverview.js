import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Header, Button, Divider } from 'semantic-ui-react';
import { FormTextarea } from '../../../../../../../theme/form';

@inject('businessAppReviewStore', 'userStore')
@observer
export default class ManagerOverview extends Component {
  render() {
    const { formChange, MANAGERS_FRM, saveReviewForms } = this.props.businessAppReviewStore;
    const { roles } = this.props.userStore.currentUser;
    const { isReadonly, approved, formName } = this.props;
    if (roles && !roles.includes('manager')) {
      return null;
    }
    return (
      <Aux>
        <Divider section />
        <Header as="h4">Manager</Header>
        <FormTextarea
          name="managerOverview"
          fielddata={MANAGERS_FRM.fields.managerOverview}
          changed={(e, result) => formChange(e, result, 'MANAGERS_FRM')}
          disabled={isReadonly}
          containerclassname={isReadonly ? 'display-only secondary' : 'secondary'}
        />
        {!isReadonly &&
        <div className="right-align">
          <Button.Group>
            <Button disabled={!MANAGERS_FRM.meta.isValid} className="relaxed" inverted color="red" type="button" onClick={() => saveReviewForms(formName, 'REVIEW_APPROVED', false)}>Send Back</Button>
            <Button disabled={!MANAGERS_FRM.meta.isValid || !this.props.isValid} primary className="relaxed" type="button" onClick={() => saveReviewForms(formName, 'REVIEW_APPROVED')}>Approve</Button>
          </Button.Group>
        </div>
        }
        {approved &&
          <span>Approved By {approved.by}</span>
        }
      </Aux>
    );
  }
}
