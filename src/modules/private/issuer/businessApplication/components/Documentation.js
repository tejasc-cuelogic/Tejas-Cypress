import React, { Component } from 'react';
import { Grid, Form, Popup, Icon, List } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FormRadioGroup, DropZone } from '../../../../../theme/form';
import FormElementWrap from './FormElementWrap';
import AppNavigation from './AppNavigation';

@inject('businessAppStore')
@observer
export default class Documentation extends Component {
  componentWillMount() {
    this.props.businessAppStore.setApplicationStep('documentation');
  }
  submit = () => {
    // e.preventDefault();
    console.log(111);
    // this.props.history.push(`/app/business-application/${APP_STATUS}`);
  }
  render() {
    const {
      BUSINESS_DOC_FRM,
      businessDocChange,
      businessAppUploadFiles,
      businessAppRemoveFiles,
      canSubmitApp,
      getBusinessTypeCondtion,
      getPersonalGuaranteeCondtion,
    } = this.props.businessAppStore;
    const { fields } = BUSINESS_DOC_FRM;
    const statementFileList = getBusinessTypeCondtion ? ['bankStatements', 'leaseAgreementsOrLOIs'] : ['leaseAgreementsOrLOIs'];
    const taxFileList = getBusinessTypeCondtion ? ['personalTaxReturn', 'businessTaxReturn'] : ['personalTaxReturn'];
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
                  Provide the most recent 6 months of bank statements for
                  your business accounts. For new entities, provide if
                  statements are available.<br />
                  Also provide the lease for your location. If only an LOIwith the landlord
                  is currently available, please upload the LOI for review purposes.
                  <Popup
                    trigger={<Icon name="help circle outline" />}
                    content="If your campaign is successfully funded, an executed lease will be required at closing in order for you to receive funds."
                    position="top center"
                    className="center-align"
                  />
                </span>
              }
            >
              <Grid stackable columns="equal">
                {
                  statementFileList.map(field => (
                    <Grid.Column>
                      <DropZone
                        multiple
                        key={field}
                        name={field}
                        fielddata={fields[field]}
                        ondrop={(files, fieldName) =>
                          businessAppUploadFiles(files, fieldName, 'BUSINESS_DOC_FRM')}
                        onremove={(e, fieldName, index) =>
                          businessAppRemoveFiles(e, fieldName, 'BUSINESS_DOC_FRM', index)}
                        tooltip={fields[field].tooltip}
                      />
                    </Grid.Column>
                  ))
                }
              </Grid>
            </FormElementWrap>
            <FormElementWrap
              header="Tax Returns"
              subHeader="Tax returns are used as part of NextSeed’s diligence process."
            >
              <List bulleted>
                <List.Item>
                  <b>For new entities</b>, please submit your personal tax returns and,
                  if available,
                  tax returns of a different business entity that you currently own.
                </List.Item>
                <List.Item>
                  <b>For existing entities</b>, please submit tax returns for the entity.
                </List.Item>
              </List>
              <Grid stackable columns="equal">
                {
                  taxFileList.map(field => (
                    <Grid.Column>
                      <DropZone
                        multiple
                        key={field}
                        name={field}
                        fielddata={fields[field]}
                        ondrop={(files, fieldName) =>
                          businessAppUploadFiles(files, fieldName, 'BUSINESS_DOC_FRM')}
                        onremove={(e, fieldName, index) =>
                          businessAppRemoveFiles(e, fieldName, 'BUSINESS_DOC_FRM', index)}
                      />
                    </Grid.Column>
                  ))
                }
              </Grid>
            </FormElementWrap>
            <FormElementWrap
              header="Will you accept a blanket lien on the business if your campaign is successfully funded?"
              subHeader="NextSeed will require it. (Note that if you have existing debt with liens attached, a second lien will be accepted.)"
            >
              <FormRadioGroup
                fielddata={fields.blanketLien}
                name="blanketLien"
                changed={businessDocChange}
                containerclassname="button-radio"
              />
            </FormElementWrap>
            <FormElementWrap
              header="Are you willing to provide a personal guarantee?"
              subHeader="(This is not a requirement, but a personal guarantee can positively impact the terms provided.)"
            >
              <FormRadioGroup
                fielddata={fields.personalGuarantee}
                name="personalGuarantee"
                changed={businessDocChange}
                containerclassname="button-radio"
              />
              {getPersonalGuaranteeCondtion &&
                <div>
                  <p>
                    Please <a href="https://nextseed.box.com/shared/static/cnru75v5lv5akiz5p7fap0d7nqljwuy9.pdf" className="link"><b>download</b></a>, fill out and upload the
                    Personal Guarantee Form along with any supporting documentation
                  </p>
                  <DropZone
                    multiple
                    name="personalGuaranteeForm"
                    fielddata={fields.personalGuaranteeForm}
                    ondrop={(files, fieldName) =>
                      businessAppUploadFiles(files, fieldName, 'BUSINESS_DOC_FRM')}
                    onremove={(e, fieldName, index) =>
                      businessAppRemoveFiles(e, fieldName, 'BUSINESS_DOC_FRM', index)}
                  />
                </div>
              }
            </FormElementWrap>
            <AppNavigation canSubmitApp={canSubmitApp} action={this.submit} />
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
}
