import React, { Component } from 'react';
import { Card, Button, Form, Grid, Divider, Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { FormDropDown } from '../../../../../../theme/form';
import DynamicFormInput from './dynamicFormInput';

@inject('factoryStore')
@withRouter
@observer
export default class RequestFactory extends Component {
  constructor(props) {
    super(props);
    this.props.factoryStore.setFieldValue('DYNAMCI_PAYLOAD_FRM', {}, 'REQUESTFACTORY');
    this.props.factoryStore.resetForm('REQUESTFACTORY_FRM');
    this.props.factoryStore.inProgress.requestFactory = false;
  }

  onSubmit = () => {
    this.props.factoryStore.requestFactoryPluginTrigger();
  }

  render() {
    const { factoryStore } = this.props;
    const {
      REQUESTFACTORY_FRM, formChangeForPlugin, inProgress, DYNAMCI_PAYLOAD_FRM, currentPluginSelected,
    } = factoryStore;
    return (
      <Card fluid className="elastic-search">
        <Card.Content header="Trigger Request Factory Plugin" />
        <Card.Content>
          <Card.Description>
            <Form onSubmit={this.onSubmit}>
              <Form.Group>
                <Grid className="full-width mlr-0" stackable>
                  <Grid.Column width={8}>
                    <FormDropDown
                      fielddata={REQUESTFACTORY_FRM.fields.plugin}
                      selection
                      containerclassname="dropdown-field mlr-0"
                      options={REQUESTFACTORY_FRM.fields.plugin.values}
                      placeholder="Choose here"
                      name="plugin"
                      onChange={(e, result) => formChangeForPlugin(e, result, 'REQUESTFACTORY_FRM')}
                    />
                    <FormDropDown
                      fielddata={REQUESTFACTORY_FRM.fields.invocationType}
                      selection
                      containerclassname="dropdown-field mlr-0"
                      options={REQUESTFACTORY_FRM.fields.invocationType.values}
                      placeholder="Choose here"
                      name="invocationType"
                      onChange={(e, result) => formChangeForPlugin(e, result, 'REQUESTFACTORY_FRM')}
                    />
                    <Divider section hidden />
                    <Button className="mt-80 ml-10" primary content="Submit" disabled={inProgress.requestFactory || !REQUESTFACTORY_FRM.meta.isValid || !DYNAMCI_PAYLOAD_FRM.REQUESTFACTORY.meta.isValid} loading={inProgress.requestFactory} />
                  </Grid.Column>
                  <Grid.Column width={8}>
                  <Header as="h5">Payload</Header>
                    <DynamicFormInput {...this.props} formPayload={DYNAMCI_PAYLOAD_FRM.REQUESTFACTORY} formObj={{ parentForm: 'DYNAMCI_PAYLOAD_FRM', childForm: 'REQUESTFACTORY' }} selectedPlugin={currentPluginSelected} />
                  </Grid.Column>
                </Grid>
              </Form.Group>
            </Form>
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}
