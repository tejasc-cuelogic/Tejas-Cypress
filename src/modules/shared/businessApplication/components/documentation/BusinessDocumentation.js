import React, { Component } from 'react';
import { Grid, Popup, Icon, List, Divider, Button } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import { FormRadioGroup, DropZoneConfirm as DropZone } from '../../../../../theme/form';
import FormElementWrap from '../FormElementWrap';

@inject('businessAppStore', 'userStore', 'uiStore')
@observer
export default class BusinessDocumentation extends Component {
  componentWillMount() {
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
          subHeader={(
<span>
              Provide the most recent 6 months of bank statements for
              your business accounts. For new entities, provide if
              statements are available.<br />
              Also provide the lease for your location. If only an LOIwith the landlord
              is currently available, please upload the LOI for review purposes.
              <Popup
                trigger={<Icon className="ns-help-circle" />}
                content="If your campaign is successfully funded, an executed lease will be required at closing in order for you to receive funds."
                position="top center"
                className="left-align justify-text"
                wide
              />
            </span>
)}
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
          subHeader="Tax returns are used as part of NextSeed’s diligence process."
        >
          {!hideFields
            && (
<List bulleted>
              <List.Item>
                <b>For new entities</b>, please submit your personal tax returns and, if
                available, tax returns of a different business entity that you currently own.
              </List.Item>
              <List.Item>
                <b>For existing entities</b>, please submit tax returns for the entity.
              </List.Item>
            </List>
            )
          }
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
          subHeader="NextSeed will require it. (Note that if you have existing debt with liens attached, a second lien will be accepted.)"
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
          subHeader="(This is not a requirement, but a personal guarantee can positively impact the terms provided.)"
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
