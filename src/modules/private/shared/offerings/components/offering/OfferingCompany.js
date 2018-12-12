import React, { Component } from 'react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Form, Divider, Header } from 'semantic-ui-react';
import HtmlEditor from '../../../../../shared/HtmlEditor';
import { FormTextarea, FormInput } from '../../../../../../theme/form';
import ButtonGroup from '../ButtonGroup';

@inject('offeringCreationStore', 'userStore', 'offeringsStore')
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
  handleFormSubmit = (isApproved = null) => {
    const {
      OFFERING_COMPANY_FRM,
      updateOffering,
      currentOfferingId,
    } = this.props.offeringCreationStore;
    updateOffering(currentOfferingId, OFFERING_COMPANY_FRM.fields, 'offering', 'about', true, undefined, isApproved);
  }
  editorChange =
  (field, value, form) => this.props.offeringCreationStore.rtEditorChange(field, value, form);
  render() {
    const {
      OFFERING_COMPANY_FRM,
      formArrayChange,
      rtEditorChange,
    } = this.props.offeringCreationStore;
    const formName = 'OFFERING_COMPANY_FRM';
    const { isIssuer } = this.props.userStore;
    const { offer } = this.props.offeringsStore;
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    const isManager = access.asManager;
    const submitted = (offer && offer.offering && offer.offering.about &&
      offer.offering.about.submitted) ? offer.offering.about.submitted : null;
    const approved = (offer && offer.offering && offer.offering.about &&
      offer.offering.about.approved) ? offer.offering.about.approved : null;
    const issuerSubmitted = (offer && offer.offering && offer.offering.about &&
      offer.offering.about.issuerSubmitted) ? offer.offering.about.issuerSubmitted : null;
    const isReadonly = ((isIssuer && issuerSubmitted) || (submitted && !isManager && !isIssuer) ||
      (isManager && approved && approved.status));
    return (
      <Form>
        <Header as="h4">About the Company</Header>
        <HtmlEditor
          readOnly={isReadonly}
          changed={this.editorChange}
          name="theCompany"
          form="OFFERING_COMPANY_FRM"
          overrides={{ height: '244px' }}
          content={OFFERING_COMPANY_FRM.fields.theCompany.value}
        />
        <Divider section />
        <Header as="h4">
          History
          {!isReadonly &&
          <Link to={this.props.match.url} className="link" onClick={e => this.addNewMileStone(e, formName, 'history')}><small>+ Add another milestone</small></Link>
          }
        </Header>
        {
          OFFERING_COMPANY_FRM.fields.history.map((history, index) => (
            <Aux>
              <Header as="h6">{`Milestone ${index + 1}`}</Header>
              <div className="featured-section">
                <FormInput
                  displayMode={isReadonly}
                  name="date"
                  fielddata={history.date}
                  changed={(e, result) => formArrayChange(e, result, formName, 'history', index)}
                />
                <FormTextarea
                  readOnly={isReadonly}
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
                readOnly={isReadonly}
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
        <ButtonGroup
          isIssuer={isIssuer}
          submitted={submitted}
          isManager={isManager}
          formValid={OFFERING_COMPANY_FRM.meta.isValid}
          approved={approved}
          updateOffer={this.handleFormSubmit}
          issuerSubmitted={issuerSubmitted}
        />
      </Form>
    );
  }
}
