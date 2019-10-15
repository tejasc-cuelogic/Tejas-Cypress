import React, { Component } from 'react';
import { Card, Button, Form, Grid, Divider, Header } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import formHOC from '../../../../../../theme/form/formHOC';
import DynamicFormInput from './dynamicFormInput';

const metaInfo = {
  store: 'factoryStore',
  form: 'REQUESTFACTORY_FRM',
};

@withRouter
@observer
class RequestFactory extends Component {
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
    const { factoryStore, smartElement } = this.props;
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
                    {['plugin', 'invocationType'].map(field => (
                      smartElement.FormDropDown(field, {
                        onChange: (e, result) => formChangeForPlugin(e, result, 'REQUESTFACTORY_FRM'),
                        containerclassname: 'dropdown-field mlr-0',
                        placeholder: 'Choose here',
                        options: REQUESTFACTORY_FRM.fields[field].values,
                      })
                    ))}
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

export default formHOC(RequestFactory, metaInfo);
