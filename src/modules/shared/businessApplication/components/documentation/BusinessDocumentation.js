import React, { Component } from 'react';
import { Grid, Divider, Button } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import { FormRadioGroup, DropZoneConfirm as DropZone } from '../../../../../theme/form';
import FormElementWrap from '../FormElementWrap';

@inject('businessAppStore', 'userStore', 'uiStore')
@observer
export default class BusinessDocumentation extends Component {
  constructor(props) {
    super(props);
    this.props.businessAppStore.setFieldvalue('applicationStep', 'documentation');
  }

  render() {
    const {
      BUSINESS_DOC_FRM,
      businessDocChange,
      businessAppUploadFiles,
      businessAppRemoveFiles,
      getBusinessTypeCondtion,
      getPersonalGuaranteeCondition,
      formReadOnlyMode,
      businessAppParitalSubmit,
      enableSave,
      businessApplicationDetailsAdmin,
    } = this.props.businessAppStore;
    const { fields } = BUSINESS_DOC_FRM;
    const { hideFields } = this.props;
    const userAccess = this.props.userStore.myAccessForModule('APPLICATIONS');
    const statementFileList = getBusinessTypeCondtion ? ['bankStatements', 'leaseAgreementsOrLOIs'] : ['leaseAgreementsOrLOIs'];
    const taxFileList = getBusinessTypeCondtion ? ['personalTaxReturn', 'businessTaxReturn'] : ['personalTaxReturn'];
    const { inProgress } = this.props.uiStore;
    let disableFileUpload = true;
    if (this.props.userStore.isAdmin && this.props.userStore.isApplicationManager) {
      disableFileUpload = false;
    }
    return (
      <>
        <FormElementWrap
          hideFields={hideFields}
          header="Statements & Agreements"
        >
          <Grid stackable columns="equal">
            {
              statementFileList.map(field => (
                <Grid.Column key={field}>
                  <DropZone
                    sharableLink
                    blockDownload={get(userAccess, 'asSupport')}
                    hideFields={hideFields}
                    disabled={formReadOnlyMode && disableFileUpload}
                    multiple
                    key={field}
                    name={field}
                    asterisk="true"
                    fielddata={fields[field]}
                    ondrop={(files, fieldName) => businessAppUploadFiles(files, fieldName, 'BUSINESS_DOC_FRM', null, this.props.userStore.isApplicationManager)}
                    onremove={(fieldName, index) => businessAppRemoveFiles(fieldName, 'BUSINESS_DOC_FRM', index)}
                    tooltip={fields[field].tooltip}
                    toolTipClassName="left-align justify-text"
                  />
                </Grid.Column>
              ))
            }
          </Grid>
        </FormElementWrap>
        <FormElementWrap
          hideFields={hideFields}
          header="Tax Returns"
          subHeader={(
            <span>Tax returns are used as part of NextSeed’s diligence process.<br />For new entities, please submit your personal tax returns and, if
            available, tax returns of a different business entity that you currently own.<br />For existing entities, please submit tax returns for the entity.</span>
          )}
        >
          <Divider hidden />
          <div className="or-divider">
            {
              taxFileList.map(field => (
                <DropZone
                  sharableLink
                  blockDownload={get(userAccess, 'asSupport')}
                  hideFields={hideFields}
                  disabled={formReadOnlyMode && disableFileUpload}
                  multiple
                  asterisk="true"
                  key={field}
                  name={field}
                  fielddata={fields[field]}
                  ondrop={(files, fieldName) => businessAppUploadFiles(files, fieldName, 'BUSINESS_DOC_FRM', null, this.props.userStore.isApplicationManager)}
                  onremove={(fieldName, index) => businessAppRemoveFiles(fieldName, 'BUSINESS_DOC_FRM', index)}
                />
              ))
            }
          </div>
        </FormElementWrap>
        <FormElementWrap
          hideFields={hideFields}
          header="Will you accept a blanket lien on the business if your campaign is successfully funded?*"
          subHeader="This is a NextSeed requirement for Debt products only. (Note that if you have existing debt with liens attached, a second lien will be accepted.)"
        >
          <FormRadioGroup
            disabled={formReadOnlyMode}
            fielddata={fields.blanketLien}
            name="blanketLien"
            changed={businessDocChange}
            containerclassname="button-radio"
          />
        </FormElementWrap>
        <FormElementWrap
          hideFields={hideFields}
          noDivider={hideFields || formReadOnlyMode}
          header="Are you willing to provide a personal guarantee?*"
          subHeader="This is applicable for Debt products only."
        >
          <FormRadioGroup
            disabled={formReadOnlyMode}
            fielddata={fields.personalGuarantee}
            name="personalGuarantee"
            changed={businessDocChange}
            containerclassname="button-radio"
          />
          {getPersonalGuaranteeCondition
            && (
            <div>
              {!hideFields
              && (
              <p>
                Please <a href="https://nextseed.box.com/shared/static/cnru75v5lv5akiz5p7fap0d7nqljwuy9.pdf" className="link"><b>download</b></a>, fill out and upload the
                Personal Guarantee Form along with any supporting documentation
              </p>
              )
              }
              <DropZone
                sharableLink
                blockDownload={get(userAccess, 'asSupport')}
                hideFields={hideFields}
                disabled={formReadOnlyMode && disableFileUpload}
                asterisk="true"
                multiple
                name="personalGuaranteeForm"
                fielddata={fields.personalGuaranteeForm}
                ondrop={(files, fieldName) => businessAppUploadFiles(files, fieldName, 'BUSINESS_DOC_FRM', null, this.props.userStore.isApplicationManager)}
                onremove={(fieldName, index) => businessAppRemoveFiles(fieldName, 'BUSINESS_DOC_FRM', index)}
              />
            </div>
            )
          }
        </FormElementWrap>
        {this.props.userStore.isAdmin && this.props.userStore.isApplicationManager
          ? (
<div className="right aligned">
            <Button
              inverted
              type="button"
              onClick={() => businessAppParitalSubmit(true)}
              className="align-right right-align"
              color="green"
              content="Save"
              disabled={!(businessApplicationDetailsAdmin.applicationStage === 'COMPLETED' ? enableSave && BUSINESS_DOC_FRM.meta.isValid : enableSave)}
              loading={inProgress}
            />
          </div>
          )
          : ''}
      </>
    );
  }
}
