import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import moment from 'moment';
import { inject, observer } from 'mobx-react';
import { Form, Divider, Header, Icon, Label } from 'semantic-ui-react';
import { FormInput, MaskedInput } from '../../../../../../theme/form';
import ButtonGroupType2 from '../ButtonGroupType2';

@inject('offeringCreationStore', 'userStore', 'offeringsStore')
@observer
export default class OfferingLaunch extends Component {
  // componentWillMount() {
  //   this.props.offeringCreationStore.setFormData('OFFERING_COMPANY_FRM', 'offering.about');
  //   this.props.offeringCreationStore.setFormData('COMPANY_LAUNCH_FRM', 'offering.launch');
  //   this.props.offeringCreationStore.setFormData('OFFERING_OVERVIEW_FRM', 'offering.overview');
  // }
  handleFormSubmit = (isApproved = null) => {
    const {
      COMPANY_LAUNCH_FRM,
      updateOffering,
      currentOfferingId,
    } = this.props.offeringCreationStore;
    const successMsg = isApproved && isApproved.status === 'manager_approved' ? null : undefined;
    updateOffering(currentOfferingId, COMPANY_LAUNCH_FRM.fields, 'offering', 'launch', true, successMsg, isApproved);
  }
  launch = () => {
    const {
      updateOfferingMutation,
      currentOfferingId,
    } = this.props.offeringCreationStore;
    new Promise((res, rej) => {
      updateOfferingMutation(
        currentOfferingId, { stage: 'LIVE' }, false,
        true, 'Offering Launched successfully.', false, res, rej,
      );
    })
      .then(() => {
        this.props.history.push(`/app/offerings/live/edit/${currentOfferingId}/offering-creation/offering/launch`);
      });
  }
  render() {
    const {
      COMPANY_LAUNCH_FRM,
      ADMIN_DOCUMENTATION_FRM,
      formChange,
      maskChange,
    } = this.props.offeringCreationStore;
    const formName = 'COMPANY_LAUNCH_FRM';
    const { offer } = this.props.offeringsStore;
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    const isManager = access.asManager;
    const stage = offer ? offer.stage : '';
    const submitted = (offer && offer.offering && offer.offering.launch &&
      offer.offering.launch.submitted) ? offer.offering.launch.submitted : null;
    const approved = (offer && offer.offering && offer.offering.launch &&
      offer.offering.launch.approved) ? offer.offering.launch.approved : null;
    const isReadonly = ((submitted && !isManager) || (isManager && approved && approved.status));
    const legalDocs = offer && offer.legal && offer.legal.documentation &&
    offer.legal.documentation.admin;
    return (
      <Form>
        <Header as="h4">Launch Timeline</Header>
        <Form.Group widths="equal">
          {
            ['targetDate', 'terminationDate', 'expectedOpsDate'].map(field => (
              <MaskedInput
                displayMode={isReadonly}
                name={field}
                placeHolder={isReadonly ? '' : COMPANY_LAUNCH_FRM.fields[field].placeHolder}
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
            ['escrow', 'resolutionOfBorrowing', 'formC', 'npa', 'disclosure', 'securityAgreement', 'personalGuarantee'].map(document => (
              <div className="field">
                <Label>{ADMIN_DOCUMENTATION_FRM.fields[document].label}</Label>
                {legalDocs && legalDocs[document] && legalDocs[document].fileName ?
                  <Aux>
                    <div className="display-only">
                      <Link to={this.props.match.url} title={legalDocs[document].fileName}><Icon className="ns-file" /><b>{legalDocs[document].fileName}</b></Link>
                    </div>
                    <p>uploaded on{' '}
                      {
                        moment(legalDocs[document].fileHandle.created.date).format('MM/DD/YYYY')
                      }
                    </p>
                  </Aux> :
                  <div>Not Uploaded</div>
                }
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
                displayMode={isReadonly}
                name={field}
                fielddata={COMPANY_LAUNCH_FRM.fields[field]}
                changed={(e, result) => formChange(e, result, formName)}
              />
            ))
          }
          <MaskedInput
            displayMode={isReadonly}
            name="gsFees"
            fielddata={COMPANY_LAUNCH_FRM.fields.gsFees}
            changed={(values, name) => maskChange(values, formName, name)}
            currency
            prefix="$"
          />
        </Form.Group>
        <Header as="h4">Edgar Link</Header>
        <FormInput
          displayMode={isReadonly}
          name="edgarLink"
          fielddata={COMPANY_LAUNCH_FRM.fields.edgarLink}
          changed={(e, result) => formChange(e, result, formName)}
        />
        <Divider hidden />
        <ButtonGroupType2
          submitted={submitted}
          isManager={isManager}
          formValid={COMPANY_LAUNCH_FRM.meta.isValid}
          approved={approved}
          updateOffer={this.handleFormSubmit}
          launch={stage === 'CREATION' ? this.launch : false}
        />
      </Form>
    );
  }
}
