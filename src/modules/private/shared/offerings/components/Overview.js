/*  eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { withRouter, Route } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Form, Header, Button } from 'semantic-ui-react';
import Contingency from './overview/Contingency';
import AddNewContingency from './overview/AddNewContingency';
import { FormInput } from '../../../../../theme/form';

@withRouter
@inject('offeringCreationStore', 'userStore')
@observer
export default class Overview extends Component {
  handleSubmitOfferingDetails = () => {
    const {
      OFFERING_DETAILS_FRM,
      updateOffering,
      currentOfferingId,
    } = this.props.offeringCreationStore;
    updateOffering(currentOfferingId, OFFERING_DETAILS_FRM.fields);
  }
  render() {
    const {
      LAUNCH_CONTITNGENCIES_FRM,
      CLOSING_CONTITNGENCIES_FRM,
      OFFERING_DETAILS_FRM,
      formChange,
      formArrayChange,
    } = this.props.offeringCreationStore;
    const { isIssuer } = this.props.userStore;
    const { match } = this.props;
    return (
      <div className={isIssuer ? 'ui card fluid form-card' : 'inner-content-spacer'}>
        <Form>
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
          <Button primary disabled={!OFFERING_DETAILS_FRM.meta.isValid} content="Save" className="relaxed pull-right" onClick={this.handleSubmitOfferingDetails} />
          <Contingency formArrayChange={formArrayChange} form={LAUNCH_CONTITNGENCIES_FRM} formName="LAUNCH_CONTITNGENCIES_FRM" />
          <Contingency formArrayChange={formArrayChange} form={CLOSING_CONTITNGENCIES_FRM} formName="CLOSING_CONTITNGENCIES_FRM" />
        </Form>
      </div>
    );
  }
}
