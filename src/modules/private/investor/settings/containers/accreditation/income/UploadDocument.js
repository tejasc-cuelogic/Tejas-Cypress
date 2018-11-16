import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Divider, Button, Grid } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { DropZoneConfirm as DropZone } from '../../../../../../../theme/form';

@inject('uiStore', 'accreditationStore')
@withRouter
@observer
export default class UploadDocument extends Component {
  componentWillMount() {
    const { accountType } = this.props.match.params;
    this.props.accreditationStore.setFormData('INCOME_UPLOAD_DOC_FORM', 'accreditation', accountType);
  }
  onFileDrop = (files, field) => {
    this.props.accreditationStore.setFileUploadData('INCOME_UPLOAD_DOC_FORM', field, files);
  }
  handleDelCancel = () => {
    this.props.uiStore.setConfirmBox('');
  }
  confirmRemoveDoc = (e, name) => {
    this.props.uiStore.setConfirmBox(name);
  }
  handleDelDoc = (field) => {
    this.props.accreditationStore.removeUploadedData('INCOME_UPLOAD_DOC_FORM', field);
  }

  render() {
    const { INCOME_UPLOAD_DOC_FORM } = this.props.accreditationStore;
    return (
      <div>
        <Header as="h3" textAlign="center">Upload documents</Header>
        <p className="center-align">Upload your W2, 1040, or other IRS or foreign tax authority documents containing your salary for the past 2 years, or a letter from your lawyer, CPA, investment advisor or investment broker verifying your income.</p>
        <Divider hidden />
        <Form error>
          <Grid stackable columns="equal">
            {
              ['incomeDocSecondLastYear', 'incomeDocLastYear'].map(field => (
                <Grid.Column>
                  <DropZone
                    name={field}
                    fielddata={INCOME_UPLOAD_DOC_FORM.fields[field]}
                    ondrop={this.onFileDrop}
                    onremove={this.handleDelDoc}
                    containerclassname="fluid"
                  />
                </Grid.Column>
              ))
            }
          </Grid>
          <Divider hidden />
          <div className="center-align">
            <Button onClick={() => this.props.clicked('INCOME_UPLOAD_DOC_FORM')} primary size="large" disabled={!INCOME_UPLOAD_DOC_FORM.meta.isValid}>Submit</Button>
          </div>
        </Form>
      </div>
    );
  }
}
