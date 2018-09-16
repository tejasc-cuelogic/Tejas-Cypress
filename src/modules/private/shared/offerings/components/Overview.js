/*  eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { withRouter, Route } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Form, Header } from 'semantic-ui-react';
import Contingency from './overview/Contingency';
import AddNewContingency from './overview/AddNewContingency';
import { FormInput } from '../../../../../theme/form';

@withRouter
@inject('offeringCreationStore')
@observer
export default class Overview extends Component {
  componentWillMount() {
    this.props.offeringCreationStore.setFormData('OFFERING_DETAILS_FRM', false);
  }
  render() {
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
          <Header as="h4">Offering Details</Header>
          <Form.Group widths={2}>
            {
              ['offeringUrl', 'referralCode'].map(field => (
                <FormInput
                  name={field}
                  fielddata={OFFERING_DETAILS_FRM.fields[field]}
                  changed={(e, result) => formChange(e, result, 'OFFERING_DETAILS_FRM')}
                />
              ))
            }
          </Form.Group>
          <Contingency formChangeWithIndex={formChangeWithIndex} form={LAUNCH_CONTITNGENCIES_FRM} formName="LAUNCH_CONTITNGENCIES_FRM" />
          <Contingency formChangeWithIndex={formChangeWithIndex} form={CLOSING_CONTITNGENCIES_FRM} formName="CLOSING_CONTITNGENCIES_FRM" />
        </div>
      </Form>
    );
  }
}
