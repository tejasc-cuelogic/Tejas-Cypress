import React, { Component } from 'react';
import { Card, Button, Form, Grid, Divider } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { FormInput, FormCheckbox } from '../../../../../../theme/form';

@inject('dataStore')
@withRouter
@observer
export default class ProcessFullAccount extends Component {
  componentWillMount() {
    this.props.dataStore.resetForm('PROCESS_FULL_ACCOUNT_META_FRM');
  }
  onSubmit = () => {
    this.props.dataStore.processFullInvestorAccountMeta();
  }
  render() {
    const { dataStore } = this.props;
    const {
      PROCESS_FULL_ACCOUNT_META_FRM, formChange, inProgress,
    } = dataStore;
    return (
      <Card fluid className="elastic-search">
        <Card.Content header="Process Full account" />
        <Card.Content>
          <Form onSubmit={this.onSubmit}>
            <Grid>
              <Grid.Column width="16">
                <FormCheckbox
                  name="options"
                  defaults
                  fielddata={PROCESS_FULL_ACCOUNT_META_FRM.fields.options}
                  changed={(e, result) => formChange(e, result, 'PROCESS_FULL_ACCOUNT_META_FRM')}
                  containerclassname="ui list horizontal"
                />
              </Grid.Column>
            </Grid>
            <Divider hidden />
            <Form.Group className="bottom-aligned">
              {['userId', 'accountId'].map(field => (
                <FormInput
                  type="text"
                  key={field}
                  name={field}
                  containerwidth="6"
                  showerror
                  fielddata={PROCESS_FULL_ACCOUNT_META_FRM.fields[field]}
                  changed={(e, result) => formChange(e, result, 'PROCESS_FULL_ACCOUNT_META_FRM')}
                />))
              }
              <Form.Field width={4}>
                <Button primary fluid content="Submit" disabled={!PROCESS_FULL_ACCOUNT_META_FRM.meta.isValid || inProgress.processFullAccount} loading={inProgress.processFullAccount} />
              </Form.Field>
            </Form.Group>
          </Form>
        </Card.Content>
      </Card>
    );
  }
}