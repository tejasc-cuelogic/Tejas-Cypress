import React, { Component } from 'react';
import { Card, Button, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import beautify from 'json-beautify';
import { withRouter } from 'react-router-dom';
import Aux from 'react-aux';
import { FormInput, FormDropDown, MaskedInput } from '../../../../../../theme/form';

@inject('dataStore', 'uiStore')
@withRouter
@observer
export default class AuditBoxFolder extends Component {
  componentWillMount() {
    this.setState({ result: '' });
    this.props.dataStore.resetForm('AUDITBOXFOLDER_FRM');
    this.props.dataStore.inProgress.auditBoxFolder = false;
  }

  onSubmit = () => {
    this.props.dataStore.auditBoxFolder().then((res) => {
      this.setState({ result: res });
    }).catch(() => {
      this.setState({ result: '' });
    });
  }

  render() {
    const { dataStore } = this.props;
    const {
      AUDITBOXFOLDER_FRM, formChange, inProgress, formDataChange,
    } = dataStore;
    return (
      <Card fluid className="elastic-search">
        <Card.Content header="Audit Box Folder" />
        <Card.Content>
          <Card.Description>
            <Form onSubmit={this.onSubmit}>
              <Form.Group className="bottom-aligned">
                <FormDropDown
                  fielddata={AUDITBOXFOLDER_FRM.fields.role}
                  selection
                  containerclassname="dropdown-field mlr-0"
                  options={AUDITBOXFOLDER_FRM.fields.role.values}
                  placeholder="Choose here"
                  name="role"
                  onChange={(e, result) => formChange(e, result, 'AUDITBOXFOLDER_FRM')}
                  containerwidth="8"
                />
                <FormInput
                  type="text"
                  name="userId"
                  showerror
                  fielddata={AUDITBOXFOLDER_FRM.fields.userId}
                  changed={(e, result) => formChange(e, result, 'AUDITBOXFOLDER_FRM')}
                  containerwidth="8"
                />
                {['waitingTime', 'concurrency', 'queueLimit'].map(field => (
                  <MaskedInput
                    key={field}
                    name={field}
                    allowNegative={false}
                    label={AUDITBOXFOLDER_FRM.fields[field].label}
                    number
                    containerwidth="8"
                    showerror
                    fielddata={AUDITBOXFOLDER_FRM.fields[field]}
                    changed={(e, result) => formDataChange(e, result, 'AUDITBOXFOLDER_FRM', 'mask')}
                    disabled={inProgress.auditBoxFolder}
                  />
                ))
                }
                <FormInput
                  type="text"
                  name="jobId"
                  containerwidth="8"
                  showerror
                  fielddata={AUDITBOXFOLDER_FRM.fields.jobId}
                  changed={(e, result) => formChange(e, result, 'AUDITBOXFOLDER_FRM')}
                />
                <Form.Field width={16}>
                  <Button primary content="Submit" disabled={inProgress.auditBoxFolder || !AUDITBOXFOLDER_FRM.meta.isValid} loading={inProgress.auditBoxFolder} />
                </Form.Field>
              </Form.Group>
            </Form>
            {this.state.result
              ? (
                <Aux>
                  <b>Result:</b>
                  <p className="break-text">{beautify(this.state.result)}</p>
                </Aux>
              )
              : ''}
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}
