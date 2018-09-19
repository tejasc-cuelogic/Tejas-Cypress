import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Form, Divider, Button, Header, Icon } from 'semantic-ui-react';
import { FormTextarea, MaskedInput } from '../../../../../../theme/form';

@inject('offeringCreationStore')
@observer
export default class OfferingCompany extends Component {
  componentWillMount() {
    this.props.offeringCreationStore.setFormData('OFFERING_COMPANY_FRM', 'offering', 'about');
    this.props.offeringCreationStore.setFormData('COMPANY_HISTORY_FRM', 'offering', 'about', 'history');
  }
  addNewMileStone = (e) => {
    e.preventDefault();
    this.props.offeringCreationStore.addMore('COMPANY_HISTORY_FRM');
  }
  render() {
    const {
      OFFERING_COMPANY_FRM,
      COMPANY_HISTORY_FRM,
      formChange,
      formChangeWithIndex,
      maskChangeWithIndex,
    } = this.props.offeringCreationStore;
    const formName = 'OFFERING_COMPANY_FRM';
    return (
      <Aux>
        <Form>
          <Header as="h4">
            About the Company
          </Header>
          <FormTextarea
            name="theCompany"
            fielddata={OFFERING_COMPANY_FRM.fields.theCompany}
            changed={(e, result) => formChange(e, result, formName)}
            containerclassname="secondary"
          />
          <Divider section />
          <Header as="h4">
            History
          </Header>
          {
            COMPANY_HISTORY_FRM.fields.data.map((history, index) => (
              <Aux>
                <Header as="h4">
                  {`Milestone ${index + 1}`}
                </Header>
                <MaskedInput
                  name="date"
                  fielddata={history.date}
                  changed={(values, field) => maskChangeWithIndex(values, 'COMPANY_HISTORY_FRM', field, index)}
                  dateOfBirth
                />
                <FormTextarea
                  name="description"
                  fielddata={history.description}
                  changed={(e, result) => formChangeWithIndex(e, result, 'COMPANY_HISTORY_FRM', index)}
                  containerclassname="secondary"
                />
              </Aux>
            ))
          }
          <Button type="button" size="small" color="blue" className="link-button" onClick={e => this.addNewMileStone(e)}>+ Add another milestone</Button>
          {
            ['businessModel', 'locationAnalysis'].map(field => (
              <Aux>
                <Divider section />
                <FormTextarea
                  name={field}
                  fielddata={OFFERING_COMPANY_FRM.fields[field]}
                  changed={(e, result) => formChange(e, result, formName)}
                  containerclassname="secondary"
                />
              </Aux>
            ))
          }
          <div className="clearfix mb-20">
            <Button as="span" className="time-stamp">
              <Icon className="ns-check-circle" color="green" />
              Submitted by ISSUER_NAME on 2/3/2018
            </Button>
            <Button.Group floated="right">
              <Button inverted color="red" content="Decline" disabled={!(OFFERING_COMPANY_FRM.meta.isValid && COMPANY_HISTORY_FRM.meta.isValid)} />
              <Button color="green" className="relaxed" disabled={!(OFFERING_COMPANY_FRM.meta.isValid && COMPANY_HISTORY_FRM.meta.isValid)} >Approve</Button>
            </Button.Group>
          </div>
          <div className="clearfix">
            <Button as="span" className="time-stamp">
              <Icon className="ns-check-circle" color="green" />
              Approved by MANAGER_NAME on 2/3/2018
            </Button>
            <Button.Group floated="right">
              <Button primary type="button" className="relaxed pull-right" disabled={!(OFFERING_COMPANY_FRM.meta.isValid && COMPANY_HISTORY_FRM.meta.isValid)} >Save</Button>
            </Button.Group>
          </div>
        </Form>
      </Aux>
    );
  }
}
