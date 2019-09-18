import React, { Component } from 'react';
import { Card, Button, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { FormDropDown, FormTextarea } from '../../../../../../theme/form';

@inject('factoryStore')
@withRouter
@observer
export default class RequestFactory extends Component {
  constructor(props) {
    super(props);
    this.props.factoryStore.resetForm('REQUESTFACTORY_FRM');
    this.props.factoryStore.inProgress.requestFactory = false;
  }

  onSubmit = () => {
    this.props.factoryStore.requestFactoryPluginTrigger();
  }

  render() {
    const { factoryStore } = this.props;
    const {
      REQUESTFACTORY_FRM, formChange, inProgress,
    } = factoryStore;
    return (
      <Card fluid className="elastic-search">
        <Card.Content header="Request Factory Plugin Trigger" />
        <Card.Content>
          <Card.Description>
            <Form onSubmit={this.onSubmit}>
              <Form.Group className="bottom-aligned">
                <FormDropDown
                  fielddata={REQUESTFACTORY_FRM.fields.plugin}
                  selection
                  containerclassname="dropdown-field mlr-0"
                  options={REQUESTFACTORY_FRM.fields.plugin.values}
                  placeholder="Choose here"
                  name="plugin"
                  onChange={(e, result) => formChange(e, result, 'REQUESTFACTORY_FRM')}
                  containerwidth="8"
                />
                <FormDropDown
                  fielddata={REQUESTFACTORY_FRM.fields.invocationType}
                  selection
                  containerclassname="dropdown-field mlr-0"
                  options={REQUESTFACTORY_FRM.fields.invocationType.values}
                  placeholder="Choose here"
                  name="invocationType"
                  onChange={(e, result) => formChange(e, result, 'REQUESTFACTORY_FRM')}
                  containerwidth="8"
                />
                <FormTextarea
                  name="payload"
                  fielddata={REQUESTFACTORY_FRM.fields.payload}
                  changed={(e, result) => formChange(e, result, 'REQUESTFACTORY_FRM')}
                  containerclassname="secondary eight wide huge"
                />
                <Form.Field width={16}>
                  <Button primary content="Submit" disabled={inProgress.requestFactory || !REQUESTFACTORY_FRM.meta.isValid} loading={inProgress.requestFactory} />
                </Form.Field>
              </Form.Group>
            </Form>
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}
