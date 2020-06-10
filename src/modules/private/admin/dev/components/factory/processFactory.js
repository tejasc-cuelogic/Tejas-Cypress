import React, { useEffect, useState } from 'react';
import { Card, Button, Form, Grid, Divider } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import formHOC from '../../../../../../theme/form/formHOC';
import ShowResponseModal from './showResponseModal';
import DynamicFormInput from './dynamicFormInput';

const metaInfo = {
  store: 'factoryStore',
  form: 'PROCESSFACTORY_FRM',
};

function ProcessFactory(props) {
  const [prev, setPrev] = useState(false);
  const [visibleProp, setVisibleProp] = useState(false);

  useEffect(() => {
    props.factoryStore.resetForm('PROCESSFACTORY_FRM');
    props.factoryStore.setFieldValue('inProgress', false, 'processFactory');
    props.factoryStore.setFieldValue('DYNAMCI_PAYLOAD_FRM', {}, 'PROCESSFACTORY');
    props.factoryStore.setFieldValue('factoryResponse', {});
  }, []);

  function onSubmit() {
    props.factoryStore.processFactoryPluginTrigger()
      .then(() => {
        setVisibleProp(true);
      });
  }

  function handleCloseModel(e, val) {
    e.preventDefault();
    setPrev(val);
    setVisibleProp(false);
    props.factoryStore.setFieldValue('factoryResponse', {});
  }

  function showModel(e, val) {
    e.preventDefault();
    setPrev(val);
  }

  const { factoryStore, smartElement } = props;
  const {
    PROCESSFACTORY_FRM, pluginObj, formChangeForPlugin, inProgress, factoryResponse, DYNAMCI_PAYLOAD_FRM, currentPluginSelected,
  } = factoryStore;

  return (
    <>
      <ShowResponseModal open={prev} factoryResponse={factoryResponse} handleCloseModel={handleCloseModel} />
      <Card fluid className="elastic-search">
        <Card.Content header="Trigger Process Factory Plugin" />
        <Card.Content>
          <Card.Description>
            <Form onSubmit={PROCESSFACTORY_FRM.meta.isValid && onSubmit}>
              <Form.Group>
                <Grid className="full-width mlr-0" stackable>
                  <Grid.Column width={8}>
                    {smartElement.FormDropDown('method', {
                      onChange: (e, result) => formChangeForPlugin(e, result, 'PROCESSFACTORY_FRM'),
                      containerclassname: 'dropdown-field mlr-0',
                      placeholder: 'Choose here',
                      containerwidth: 16,
                      search: true,
                      options: PROCESSFACTORY_FRM.fields.method.values,
                      className: 'mb-80',
                    })}
                    <Divider section hidden />
                    <Button className="mt-80 ml-10" primary content="Submit" disabled={inProgress.processFactory || !PROCESSFACTORY_FRM.meta.isValid || !DYNAMCI_PAYLOAD_FRM.PROCESSFACTORY.meta.isValid} loading={inProgress.processFactory} />
                    {visibleProp && <Link as={Button} className="mt-80 ml-10 ui button inverted green" to="/" onClick={e => showModel(e, true)} title="Show Response"> Show Response </Link>}
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <DynamicFormInput {...props} pluginObj={pluginObj} listType="adminListProcessorPlugins" formPayload={DYNAMCI_PAYLOAD_FRM.PROCESSFACTORY} formObj={{ parentForm: 'DYNAMCI_PAYLOAD_FRM', childForm: 'PROCESSFACTORY' }} selectedPlugin={currentPluginSelected} />
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

export default (withRouter(formHOC(observer(ProcessFactory), metaInfo)));
