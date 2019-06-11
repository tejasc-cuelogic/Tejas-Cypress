import React, { Component } from 'react';
import { Card, Button, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import beautify from 'json-beautify';
import { withRouter } from 'react-router-dom';
import Aux from 'react-aux';
import { FormInput, FormDropDown } from '../../../../../../theme/form';

@inject('dataStore', 'uiStore')
@withRouter
@observer
export default class AuditBoxFolder extends Component {
  componentWillMount() {
    this.setState({ result: '' });
    this.props.dataStore.resetForm('AUDITBOXFOLDER_FRM');
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
      AUDITBOXFOLDER_FRM, formChange, inProgress,
    } = dataStore;
    return (
      <Card fluid className="elastic-search">
        <Card.Content header="Audit Box Folder" />
        <Card.Content>
          <Card.Description>
            <Form onSubmit={this.onSubmit}>
              <Form.Group className="bottom-aligned">
                {['waitingTime', 'concurrency', 'queueLimit', 'jobId'].map(field => (
                  <FormInput
                    type="text"
                    key={field}
                    name={field}
                    containerwidth="8"
                    showerror
                    fielddata={AUDITBOXFOLDER_FRM.fields[field]}
                    changed={(e, result) => formChange(e, result, 'AUDITBOXFOLDER_FRM')}
                  />))
                }
                <Form.Field width={8}>
                  <FormDropDown
                    fielddata={AUDITBOXFOLDER_FRM.fields.userType}
                    selection
                    containerclassname="dropdown-field"
                    options={AUDITBOXFOLDER_FRM.fields.userType.values}
                    placeholder="Choose here"
                    name="userType"
                    onChange={(e, result) => formChange(e, result, 'AUDITBOXFOLDER_FRM')}
                  />
                </Form.Field>
                <Form.Field width={16}>
                  <Button primary content="Submit" disabled={inProgress.auditBoxFolder} loading={inProgress.auditBoxFolder} />
                </Form.Field>
              </Form.Group>
            </Form>
            {this.state.result ?
              <Aux>
                <b>Result:</b>
                <p className="break-text">{beautify(this.state.result)}</p>
              </Aux>
              : ''}
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}
