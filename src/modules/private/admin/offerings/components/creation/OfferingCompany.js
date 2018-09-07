import React, { Component } from 'react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Form, Divider, Button, Header } from 'semantic-ui-react';
import { FormTextarea, MaskedInput } from '../../../../../../theme/form';

@inject('offeringCreationStore')
@observer
export default class OfferingCompany extends Component {
  addNewMileStone = (e) => {
    e.preventDefault();
    this.props.offeringCreationStore.addMore('COMPANY_HISTORY_FRM');
  }
  render() {
    const {
      OFFERING_COMPANY_FRM,
      COMPANY_HISTORY_FRM,
      formChange,
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
            name="aboutCompany"
            fielddata={OFFERING_COMPANY_FRM.fields.aboutCompany}
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
                  changed={(e, result) => formChange(e, result, 'COMPANY_HISTORY_FRM')}
                  containerclassname="secondary"
                />
              </Aux>
            ))
          }
          <Link to={this.props.match.url} className="link" onClick={e => this.addNewMileStone(e)}><small>+ Add another milestone</small></Link>
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
          <Button.Group className="pull-right">
            <Button inverted color="red" content="Decline" disabled={!(OFFERING_COMPANY_FRM.meta.isValid && COMPANY_HISTORY_FRM.meta.isValid)} />
            <Button secondary className="relaxed" disabled={!(OFFERING_COMPANY_FRM.meta.isValid && COMPANY_HISTORY_FRM.meta.isValid)} >Approve</Button>
          </Button.Group>
          <Button primary type="button" className="relaxed pull-right" disabled={!(OFFERING_COMPANY_FRM.meta.isValid && COMPANY_HISTORY_FRM.meta.isValid)} >Save</Button>
        </Form>
      </Aux>
    );
  }
}
