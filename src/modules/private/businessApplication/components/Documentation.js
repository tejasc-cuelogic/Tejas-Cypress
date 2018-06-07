import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FormRadioGroup, FileUploader } from '../../../../theme/form/FormElements';
import FormElementWrap from './FormElementWrap';
import AppNavigation from './AppNavigation';

@inject('newBusinessStore')
@observer
export default class Documentation extends Component {
  submit = () => {
    // e.preventDefault();
    console.log(111);
    // this.props.history.push(`/app/business-application/${APP_STATUS}`);
  }
  render() {
    const {
      BUSINESS_DOC_FRM, businessDocChange, docuFiles, docuReset, canSubmitApp,
    } = this.props.newBusinessStore;
    const { fields } = BUSINESS_DOC_FRM;
    return (
      <Grid container>
        <Grid.Column>
          <Form className="issuer-signup">
            <FormElementWrap
              as="h1"
              header="Documentation"
              subHeader="Quickly, safely and accurately submit your business information."
            />
            <FormElementWrap
              header="Statements & Agreements"
              subHeader={
                <span>
                  Tax returns are used as part of NextSeed’s diligence process.<br />
                  For new entities, please submit your personal tax returns and, if available,
                  tax returns of a different business entity that you currently own.<br />
                  For existing entities, please submit tax returns for the entity.
                </span>
              }
            >
              <Grid stackable columns="equal">
                <Grid.Column>
                  <FileUploader
                    name="bankStatements"
                    fielddata={fields.bankStatements}
                    uploadDocument={docuFiles}
                    removeUploadedDocument={docuReset}
                  />
                </Grid.Column>
                <Grid.Column>
                  <FileUploader
                    name="leaseAgreement"
                    fielddata={fields.leaseAgreement}
                    uploadDocument={docuFiles}
                    removeUploadedDocument={docuReset}
                  />
                </Grid.Column>
                <Grid.Column>
                  NextSeed requires a lease or LOI prior to launching your campaign. Before
                  disbursing funds, the executed lease is required. If you are currently still
                  in negotiations with your lease, please submit a draft of the current terms.
                </Grid.Column>
              </Grid>
            </FormElementWrap>
            <FormElementWrap
              header="Do you accept Blanket Lien on the Business if your campain is successfully funded?."
              subHeader="NextSeed will require it. (Note that if you have existing debt with liens attached, a second lien will be accepted.)"
            >
              <FormRadioGroup
                fielddata={fields.blanketLien}
                name="blanketLien"
                iconic
                changed={businessDocChange}
                containerclassname="button-radio"
              />
            </FormElementWrap>
            <FormElementWrap
              header="Are you willing to provide a personal quarantee?"
              subHeader="(This is not a requirement, but a personal guarantee can positively impact the terms provided.)"
            >
              <FormRadioGroup
                fielddata={fields.personalGuarantee}
                name="personalGuarantee"
                iconic
                changed={businessDocChange}
                containerclassname="button-radio"
              />
              <p>
                Please <Link to="/" className="link"><b>download</b></Link>, fill out and upload the
                Personal Guarantee Form along with any supporting documentation
              </p>
              <FileUploader
                name="personalGuaranteeForm"
                fielddata={fields.personalGuaranteeForm}
                uploadDocument={docuFiles}
                removeUploadedDocument={docuReset}
              />
            </FormElementWrap>
            <AppNavigation canSubmitApp={canSubmitApp} action={this.submit} />
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
}
