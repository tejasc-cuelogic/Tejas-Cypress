import React, { Component } from 'react';
import { Header, Form, Icon, Label, List } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FILE_UPLOAD_HANDLE_URL } from '../../../../../../constants/common';
import { EmptyDataSet } from '../../../../../../theme/shared';

@inject('businessAppStore', 'uiStore')
@observer
export default class Documentation extends Component {
  render() {
    const { BUSINESS_DOC_FRM } = this.props.businessAppStore;
    const { fields } = BUSINESS_DOC_FRM;
    return (
      <Form>
        <div className="inner-content-spacer">
          <Header as="h4">Financial Statements</Header>
          <Form.Group widths={2}>
            {
              ['bankStatements', 'leaseAgreementsOrLOIs'].map(field => (
                <div className="field display-only" key={field}>
                  <Label>{fields[field].label}</Label>
                  <div className="display-only">
                    <List>
                      {fields[field].value.length ?
                      fields[field].value.map((item, index) => (
                        <List.Item>
                          <a target="_blank" rel="noopener noreferrer" href={`${FILE_UPLOAD_HANDLE_URL}${fields[field].fileId[index]}`}><Icon className="ns-file" /><b>{item}</b></a>
                        </List.Item>
                      )) : <EmptyDataSet title="No files uploaded yes." />}
                    </List>
                  </div>
                </div>
              ))
            }
          </Form.Group>
        </div>
        <div className="inner-content-spacer">
          <Header as="h4">Financial Statements</Header>
          <Form.Group widths={2}>
            {
              ['personalTaxReturn', 'businessTaxReturn'].map(field => (
                <div className="field display-only" key={field}>
                  <Label>{fields[field].label}</Label>
                  <div className="display-only">
                    <List>
                      {fields[field].value.length ?
                      fields[field].value.map((item, index) => (
                        <List.Item>
                          <a target="_blank" rel="noopener noreferrer" href={`${FILE_UPLOAD_HANDLE_URL}${fields[field].fileId[index]}`}><Icon className="ns-file" /><b>{item}</b></a>
                        </List.Item>
                      )) : <EmptyDataSet title="No files uploaded yes." />}
                    </List>
                  </div>
                </div>
              ))
            }
          </Form.Group>
        </div>
        <div className="inner-content-spacer">
          <Header as="h4">Do you accept Blanket Lien on the Business if your campain is successfully funded?</Header>
          <p>{fields.blanketLien ? 'Yes' : 'No'}</p>
        </div>
        <div className="inner-content-spacer">
          <Header as="h4">Are you willing to provide a personal quarantee?</Header>
          <p>{fields.personalGuarantee.value === 'true' ? 'Yes' : 'No'}</p>
          <List>
            {fields.personalGuaranteeForm.value.length ?
            fields.personalGuaranteeForm.value.map((item, index) => (
              <List.Item>
                <a target="_blank" rel="noopener noreferrer" href={`${FILE_UPLOAD_HANDLE_URL}${fields.personalGuaranteeForm.fileId[index]}`}><Icon className="ns-file" /><b>{item}</b></a>
              </List.Item>
            )) : fields.personalGuarantee.value === 'true' ? <EmptyDataSet title="No files uploaded yes." /> : null}
          </List>
        </div>
      </Form>
    );
  }
}
