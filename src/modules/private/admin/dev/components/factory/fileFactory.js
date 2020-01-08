import React, { useEffect } from 'react';
import { Card, Button, Form, Grid, Divider, Header } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import formHOC from '../../../../../../theme/form/formHOC';
import DynamicFormInput from './dynamicFormInput';

const metaInfo = {
  store: 'factoryStore',
  form: 'FILEFACTORY_FRM',
};

function FileFactory(props) {
  useEffect(() => {
    props.factoryStore.resetForm('FILEFACTORY_FRM');
    props.factoryStore.setFieldValue('inProgress', false, 'fileFactory');
    props.factoryStore.setFieldValue('DYNAMCI_PAYLOAD_FRM', {}, 'FILEFACTORY');
  }, []);

  function onSubmit() {
    props.factoryStore.fileFactoryPluginTrigger();
  }

  const { factoryStore, smartElement } = props;
  const {
    FILEFACTORY_FRM, formChangeForPlugin, inProgress, DYNAMCI_PAYLOAD_FRM, currentPluginSelected,
  } = factoryStore;

  return (
    <>
      <Card fluid className="elastic-search">
        <Card.Content header="Trigger File Factory" />
        <Card.Content>
          <Card.Description>
            <Form onSubmit={FILEFACTORY_FRM.meta.isValid && onSubmit}>
              <Form.Group>
                <Grid className="full-width mlr-0" stackable>
                  <Grid.Column width={8}>
                    {smartElement.FormDropDown('method', {
                      onChange: (e, result) => formChangeForPlugin(e, result, 'FILEFACTORY_FRM'),
                      containerclassname: 'dropdown-field mlr-0',
                      placeholder: 'Choose here',
                      options: FILEFACTORY_FRM.fields.method.values,
                      className: 'mb-80',
                    })}
                    <Divider section hidden />
                    <Button className="mt-80 ml-10" primary content="Submit" disabled={inProgress.fileFactory || !FILEFACTORY_FRM.meta.isValid || !DYNAMCI_PAYLOAD_FRM.FILEFACTORY.meta.isValid} loading={inProgress.fileFactory} />
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <Header as="h5">Payload</Header>
                    <DynamicFormInput {...props} formPayload={DYNAMCI_PAYLOAD_FRM.FILEFACTORY} formObj={{ parentForm: 'DYNAMCI_PAYLOAD_FRM', childForm: 'FILEFACTORY' }} selectedPlugin={currentPluginSelected} />
                  </Grid.Column>
                </Grid>
              </Form.Group>
            </Form>
          </Card.Description>
        </Card.Content>
      </Card>
    </>
  );
}

export default (withRouter(formHOC(observer(FileFactory), metaInfo)));
