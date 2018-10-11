import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Form, Divider, Header, Button, Icon, Label } from 'semantic-ui-react';
import { FormInput, MaskedInput } from '../../../../../../theme/form';

@inject('offeringCreationStore', 'userStore')
@observer
export default class OfferingLaunch extends Component {
  componentWillMount() {
    this.props.offeringCreationStore.setFormData('OFFERING_COMPANY_FRM', 'offering.about');
    this.props.offeringCreationStore.setFormData('COMPANY_LAUNCH_FRM', 'offering.launch');
    this.props.offeringCreationStore.setFormData('OFFERING_OVERVIEW_FRM', 'offering.overview');
  }
  handleFormSubmit = () => {
    const {
      COMPANY_LAUNCH_FRM,
      updateOffering,
      currentOfferingId,
    } = this.props.offeringCreationStore;
    updateOffering(currentOfferingId, COMPANY_LAUNCH_FRM.fields, 'offering', 'launch');
  }
  render() {
    const {
      COMPANY_LAUNCH_FRM,
      SIGNED_LEGAL_DOCS_FRM,
      formChange,
      maskChange,
    } = this.props.offeringCreationStore;
    const formName = 'COMPANY_LAUNCH_FRM';
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    return (
      <Form onSubmit={this.handleFormSubmit}>
        <Header as="h4">Launch Timeline</Header>
        <Form.Group widths="equal">
          {
            ['targetDate', 'terminationDate', 'expectedOpsDate'].map(field => (
              <MaskedInput
                name={field}
                fielddata={COMPANY_LAUNCH_FRM.fields[field]}
                changed={(values, name) => maskChange(values, formName, name)}
                dateOfBirth
              />
            ))
          }
        </Form.Group>
        <Divider section />
        <Header as="h4">Signed Legal Documents</Header>
        <Form.Group widths={3}>
          {
            SIGNED_LEGAL_DOCS_FRM.fields.data.map(document => (
              <div className="field display-only" >
                <Label>{document.document.label}</Label>
                <div className="display-only">
                  <Link to={this.props.match.url}><Icon className="ns-file" /><b>{document.document.fileName}</b></Link>
                </div>
                <p>signed on {document.document.attachedDate}</p>
              </div>
            ))
          }
        </Form.Group>
        <Divider section />
        <Header as="h4">Escrow Key</Header>
        <Form.Group widths="equal">
          {
            ['escrowKey', 'escrowNumber'].map(field => (
              <FormInput
                name={field}
                fielddata={COMPANY_LAUNCH_FRM.fields[field]}
                changed={(e, result) => formChange(e, result, formName)}
              />
            ))
          }
        </Form.Group>
        <Header as="h4">Edgar Link</Header>
        <FormInput
          name="edgarLink"
          fielddata={COMPANY_LAUNCH_FRM.fields.edgarLink}
          changed={(e, result) => formChange(e, result, formName)}
        />
        <Divider hidden />
        <div className="clearfix">
          <Button as="span" className="time-stamp">
            <Icon className="ns-check-circle" color="green" />
            Submitted by USER_NAME on 2/3/2018
          </Button>
          {access.asManager ? (
            <Button floated="right" type="button" primary className="relaxed" disabled={!COMPANY_LAUNCH_FRM.meta.isValid} >Approve and Launch</Button>
          ) : (
            <Button floated="right" secondary className="relaxed" disabled={!COMPANY_LAUNCH_FRM.meta.isValid} >Submit for Approval</Button>
          )}
        </div>
      </Form>
    );
  }
}
