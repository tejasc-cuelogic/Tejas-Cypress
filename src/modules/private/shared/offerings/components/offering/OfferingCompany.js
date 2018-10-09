import React, { Component } from 'react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Form, Divider, Button, Header, Icon } from 'semantic-ui-react';
import HtmlEditor from '../../../../../shared/HtmlEditor';
import { FormTextarea, FormInput } from '../../../../../../theme/form';

@inject('offeringCreationStore', 'userStore')
@observer
export default class OfferingCompany extends Component {
  componentWillMount() {
    this.props.offeringCreationStore.setFormData('OFFERING_COMPANY_FRM', 'offering.about');
    this.props.offeringCreationStore.setFormData('COMPANY_LAUNCH_FRM', 'offering.launch');
    this.props.offeringCreationStore.setFormData('OFFERING_OVERVIEW_FRM', 'offering.overview');
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
  editorChange =
  (field, value, form) => this.props.offeringCreationStore.rtEditorChange(field, value, form);
  render() {
    const {
      OFFERING_COMPANY_FRM,
      formArrayChange,
      rtEditorChange,
    } = this.props.offeringCreationStore;
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    const formName = 'OFFERING_COMPANY_FRM';
    return (
      <Form onSubmit={this.handleFormSubmit}>
        <Header as="h4">About the Company</Header>
        <HtmlEditor
          changed={this.editorChange}
          name="theCompany"
          form="OFFERING_COMPANY_FRM"
          overrides={{ height: '244px' }}
          content={OFFERING_COMPANY_FRM.fields.theCompany.value}
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
              <Header as="h6">{OFFERING_COMPANY_FRM.fields[field].label}</Header>
              <HtmlEditor
                changed={rtEditorChange}
                name={field}
                form="OFFERING_COMPANY_FRM"
                overrides={{ height: '244px' }}
                content={OFFERING_COMPANY_FRM.fields[field].value}
              />
            </Aux>
          ))
        }
        <Divider hidden />
        <div className="clearfix">
          <Button as="span" className="time-stamp">
            <Icon className="ns-check-circle" color="green" />
            Submitted by USER_NAME on 2/3/2018
          </Button>
          <Button.Group floated="right">
            {access.asManager ? (
              <Aux>
                <Button inverted color="red" content="Decline" disabled={!OFFERING_COMPANY_FRM.meta.isValid} />
                <Button color="green" className="relaxed" disabled={!OFFERING_COMPANY_FRM.meta.isValid}>Approve</Button>
              </Aux>
            ) : (
              <Button primary color="green" className="relaxed" disabled={!OFFERING_COMPANY_FRM.meta.isValid}>Save</Button>
            )}
          </Button.Group>
        </div>
      </Form>
    );
  }
}
