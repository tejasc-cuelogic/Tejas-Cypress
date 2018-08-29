import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Header, Button, Divider } from 'semantic-ui-react';
import { FormTextarea } from '../../../../../../../theme/form';

@inject('businessAppReviewStore', 'userStore')
@observer
export default class ManagerOverview extends Component {
  render() {
    const { formChange } = this.props.businessAppReviewStore;
    const { form, formName } = this.props;
    const { roles } = this.props.userStore.currentUser;
    if (roles && !roles.includes('manager')) {
      return null;
    }
    return (
      <Aux>
        <Divider section />
        <Header as="h4">Manager</Header>
        <FormTextarea
          name="managerOverview"
          fielddata={form.fields.managerOverview}
          changed={(e, result) => formChange(e, result, formName)}
          containerclassname="secondary"
        />
        <div className="right-align">
          <Button.Group>
            <Button disabled={!form.meta.isValid} className="relaxed" secondary>Deny</Button>
            <Button disabled={!form.meta.isValid} primary className="relaxed" type="button">Approve</Button>
          </Button.Group>
        </div>
      </Aux>
    );
  }
}
