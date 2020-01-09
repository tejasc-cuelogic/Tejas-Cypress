import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Divider, Button, Grid } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { DropZoneConfirm as DropZone, FormCheckbox, MaskedInput } from '../../../../../../../theme/form';

const isMobile = document.documentElement.clientWidth < 768;
@inject('uiStore', 'accreditationStore')
@withRouter
@observer
export default class UploadDocument extends Component {
componentDidMount() {
    const { changeRuleAsPerFilingStatus, FILLING_STATUS_FORM } = this.props.accreditationStore;
    changeRuleAsPerFilingStatus(FILLING_STATUS_FORM.fields.method.value);
}

  onFileDrop = (files, field) => {
    this.props.accreditationStore.setFileUploadData('INCOME_UPLOAD_DOC_FORM', field, files, this.props.accountType, 'Income', '', '', '');
  }

  handleDelCancel = () => {
    this.props.uiStore.setConfirmBox('');
  }

  confirmRemoveDoc = (e, name) => {
    this.props.uiStore.setConfirmBox(name);
  }

  handleDelDoc = (field, index) => {
    this.props.accreditationStore.removeUploadedData('INCOME_UPLOAD_DOC_FORM', field, index, this.props.accountType);
  }

  render() {
    const {
      INCOME_UPLOAD_DOC_FORM, formChange, FILLING_STATUS_FORM, maskChange,
    } = this.props.accreditationStore;
    const isFilling = FILLING_STATUS_FORM.fields.method.value;
    let docsToUpload = ['incomeDocSecondLastYear', 'incomeDocLastYear'];
    if (!isFilling) {
      docsToUpload = ['incomeDocThirdLastYear', 'incomeDocSecondLastYear'];
    }
    return (
      <div>
        <Header as="h3" textAlign="center">Upload documents</Header>
        <p className={isMobile ? 'left-align' : 'center-align'}>
        Upload your tax returns, Form W-2s, or other IRS or foreign tax authority documents evidencing your income for the past 2 years, or a letter from your personal lawyer, CPA, investment advisor or investment broker verifying your income for such years.
        </p>
        <Divider hidden />
        <Form>
          <Grid stackable columns={2} centered>
            {
              docsToUpload.map(field => (
                <Grid.Column key={field}>
                  <DropZone
                    multiple
                    name={field}
                    fielddata={INCOME_UPLOAD_DOC_FORM.fields[field]}
                    ondrop={this.onFileDrop}
                    onremove={this.handleDelDoc}
                    containerclassname="fluid"
                  />
                </Grid.Column>
              ))
            }
          {isFilling
          && (
            <Grid.Column>
              <MaskedInput
                name="estimateIncome"
                fielddata={INCOME_UPLOAD_DOC_FORM.fields.estimateIncome}
                changed={(values, name) => maskChange(values, 'INCOME_UPLOAD_DOC_FORM', name)}
                currency
                showerror
                prefix="$"
              />
            </Grid.Column>
          )
        }
        </Grid>
          <Divider hidden />
          {isFilling
          && (
          <p className={isMobile ? 'left-align' : 'center-align'}>
          <b>Note:</b> If you provide tax documents, W-2s, or other direct forms of income verification, your accredited investor status will be valid for the remainder of this calendar year. If you provide an upload of communication from a qualified advisor, your accredited investor status will be valid for 90 days from the date of your verifier`s confirmation.
          </p>
          )
          }
          <Divider hidden />
          <FormCheckbox
            fielddata={
              FILLING_STATUS_FORM.fields.method.value
              ? INCOME_UPLOAD_DOC_FORM.fields.isAcceptedForfilling
              : INCOME_UPLOAD_DOC_FORM.fields.isAcceptedForUnfilling
            }
            name={FILLING_STATUS_FORM.fields.method.value ? 'isAcceptedForfilling' : 'isAcceptedForUnfilling'}
            changed={(e, result) => formChange(e, result, 'INCOME_UPLOAD_DOC_FORM')}
            defaults
            disabled={
              (INCOME_UPLOAD_DOC_FORM.fields.incomeDocSecondLastYear.fileId === ''
                || INCOME_UPLOAD_DOC_FORM.fields.incomeDocLastYear.fileId === '')}
            containerclassname="ui relaxed list"
          />
          <div className="center-align">
            <Button fluid={isMobile} onClick={() => this.props.clicked('INCOME_UPLOAD_DOC_FORM')} primary size="large" disabled={!INCOME_UPLOAD_DOC_FORM.meta.isValid}>Submit</Button>
          </div>
        </Form>
      </div>
    );
  }
}
