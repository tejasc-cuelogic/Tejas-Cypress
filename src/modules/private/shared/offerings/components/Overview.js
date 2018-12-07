/*  eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Form, Header, Button } from 'semantic-ui-react';
import Contingency from './overview/Contingency';
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
    return (
      <div className={isIssuer ? 'ui card fluid form-card' : 'inner-content-spacer'}>
        <Form>
          <Header as="h4">Offering Details</Header>
          <Form.Group widths={3}>
            {
              ['offeringSlug', 'previewPassword', 'referralCode'].map(field => (
                <FormInput
                  name={field}
                  fielddata={OFFERING_DETAILS_FRM.fields[field]}
                  changed={(e, result) => formChange(e, result, 'OFFERING_DETAILS_FRM')}
                />
              ))
            }
          </Form.Group>
          <div className="clearfix">
            <Button primary disabled={!OFFERING_DETAILS_FRM.meta.isValid} content="Save" className="relaxed pull-right" onClick={this.handleSubmitOfferingDetails} />
          </div>
          <Contingency formArrayChange={formArrayChange} form={LAUNCH_CONTITNGENCIES_FRM} formName="LAUNCH_CONTITNGENCIES_FRM" />
          <Contingency formArrayChange={formArrayChange} form={CLOSING_CONTITNGENCIES_FRM} formName="CLOSING_CONTITNGENCIES_FRM" />
        </Form>
      </div>
    );
  }
}
