/*  eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { withRouter, Route } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import Aux from 'react-aux';
import { Form, Header } from 'semantic-ui-react';
import Contingency from './overview/Contingency';
import AddNewContingency from './overview/AddNewContingency';
import { FormInput } from '../../../../../theme/form';

@withRouter
@inject('offeringCreationStore', 'userStore')
@observer
export default class Overview extends Component {
  render() {
    const { roles } = this.props.userStore.currentUser;
    const {
      LAUNCH_CONTITNGENCIES_FRM,
      CLOSING_CONTITNGENCIES_FRM,
      OFFERING_DETAILS_FRM,
      formChange,
      formChangeWithIndex,
    } = this.props.offeringCreationStore;
    const { match } = this.props;
    return (
      <Form>
        <div className="inner-content-spacer">
          <Route exact path={`${match.url}/add-new-contingency`} render={props => <AddNewContingency refLink={match.url} {...props} />} />
          {(roles && (roles.includes('support') || roles.includes('admin'))) &&
          <Aux>
            <Header as="h4">
            Offering Details
            </Header>
            <Form.Group widths={2}>
              {
                ['offeringUrl', 'offeringReferralCode'].map(field => (
                  <FormInput
                    name={field}
                    fielddata={OFFERING_DETAILS_FRM.fields[field]}
                    changed={(e, result) => formChange(e, result, 'OFFERING_DETAILS_FRM')}
                  />
                ))
              }
            </Form.Group>
          </Aux>
          }
          <Contingency formChangeWithIndex={formChangeWithIndex} form={LAUNCH_CONTITNGENCIES_FRM} formName="LAUNCH_CONTITNGENCIES_FRM" />
          <Contingency formChangeWithIndex={formChangeWithIndex} form={CLOSING_CONTITNGENCIES_FRM} formName="CLOSING_CONTITNGENCIES_FRM" />
        </div>
      </Form>
    );
  }
}
