import React, { Component } from 'react';
import { Card, Button, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
// import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
// import Aux from 'react-aux';
import { FormInput, FormCheckbox } from '../../../../../../theme/form';

@inject('dataStore')
@withRouter
@observer
export default class ProcessFullAccount extends Component {
  componentWillMount() {
    // this.props.dataStore.resetOfferingAudit();
  }
  onSubmit = () => {
    this.props.dataStore.processFullInvestorAccountMeta();
  }
  render() {
    const { dataStore } = this.props;
    const {
      PROCESS_FULL_ACCOUNT_META_FRM, formChange,
    } = dataStore;
    return (
      <Card fluid className="elastic-search">
        <Card.Content header="Process Full account" />
        <Card.Content>
          <Card.Description>
            <Form onSubmit={this.onSubmit}>
              <Form.Group className="bottom-aligned">
                {
                    ['userId', 'accountId'].map(field => (
                      <FormInput
                        type="text"
                        key={field}
                        name={field}
                        showerror
                        fielddata={PROCESS_FULL_ACCOUNT_META_FRM.fields[field]}
                        changed={(e, result) => formChange(e, result, 'PROCESS_FULL_ACCOUNT_META_FRM')}
                      />))
                }
                <FormCheckbox
                  name="options"
                  defaults
                  fielddata={PROCESS_FULL_ACCOUNT_META_FRM.fields.options}
                  changed={(e, result) => formChange(e, result, 'PROCESS_FULL_ACCOUNT_META_FRM')}
                />
                <Form.Field width={4}>
                  <Button primary fluid content="Submit" disabled={!PROCESS_FULL_ACCOUNT_META_FRM.meta.isValid} />
                </Form.Field>
              </Form.Group>
            </Form>
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}
