import React, { Component } from 'react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Form, Divider, Button, Header, Icon } from 'semantic-ui-react';
import { FormTextarea, FormInput } from '../../../../../../theme/form';

@inject('offeringCreationStore', 'userStore')
@observer
export default class OfferingCompany extends Component {
  componentWillMount() {
    this.props.offeringCreationStore.setFormData('OFFERING_COMPANY_FRM', 'offering.about');
  }
  addNewMileStone = (e, formName, arrayName) => {
    e.preventDefault();
    this.props.offeringCreationStore.addMore(formName, arrayName);
  }
  handleFormSubmit = () => {
    const {
      OFFERING_COMPANY_FRM,
      updateOffering,
      currentOfferingId,
    } = this.props.offeringCreationStore;
    updateOffering(currentOfferingId, OFFERING_COMPANY_FRM.fields, 'offering', 'about');
  }
  render() {
    const {
      OFFERING_COMPANY_FRM,
      formArrayChange,
    } = this.props.offeringCreationStore;
    const { isIssuer } = this.props.userStore;
    const formName = 'OFFERING_COMPANY_FRM';
    return (
      <div className={isIssuer ? 'ui card fluid form-card' : ''}>
        <Form onSubmit={this.handleFormSubmit}>
          <Header as="h4">About the Company</Header>
          <FormTextarea
            name="theCompany"
            fielddata={OFFERING_COMPANY_FRM.fields.theCompany}
            changed={(e, result) => formArrayChange(e, result, formName)}
            containerclassname="secondary"
          />
          <Divider section />
          <Header as="h4">
            History
            <Link to={this.props.match.url} className="link" onClick={e => this.addNewMileStone(e, formName, 'history')}><small>+ Add another milestone</small></Link>
          </Header>
          {
            OFFERING_COMPANY_FRM.fields.history.map((history, index) => (
              <Aux>
                <Header as="h6">{`Milestone ${index + 1}`}</Header>
                <div className="featured-section">
                  <FormInput
                    name="date"
                    fielddata={history.date}
                    changed={(e, result) => formArrayChange(e, result, formName, 'history', index)}
                  />
                  <FormTextarea
                    name="description"
                    fielddata={history.description}
                    changed={(e, result) => formArrayChange(e, result, formName, 'history', index)}
                    containerclassname="secondary"
                  />
                </div>
              </Aux>
            ))
          }
          {
            ['businessModel', 'locationAnalysis'].map(field => (
              <Aux>
                <Divider section />
                <FormTextarea
                  name={field}
                  fielddata={OFFERING_COMPANY_FRM.fields[field]}
                  changed={(e, result) => formArrayChange(e, result, formName)}
                  containerclassname="secondary"
                />
              </Aux>
            ))
          }
          <Divider hidden />
          <div className="clearfix mb-20">
            <Button as="span" className="time-stamp">
              <Icon className="ns-check-circle" color="green" />
              Submitted by ISSUER_NAME on 2/3/2018
            </Button>
            <Button.Group floated="right">
              <Button inverted color="red" content="Decline" className="relaxed" disabled={!OFFERING_COMPANY_FRM.meta.isValid} />
              <Button color="green" content="Approve" className="relaxed" disabled={!OFFERING_COMPANY_FRM.meta.isValid} />
            </Button.Group>
          </div>
          <div className="clearfix">
            <Button as="span" className="time-stamp">
              <Icon className="ns-check-circle" color="green" />
              Approved by MANAGER_NAME on 2/3/2018
            </Button>
            <Button primary content="Save" floated="right" className="relaxed" disabled={!OFFERING_COMPANY_FRM.meta.isValid} />
          </div>
        </Form>
      </div>
    );
  }
}
