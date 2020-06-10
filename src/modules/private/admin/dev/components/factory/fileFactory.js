import React, { useEffect, useState } from 'react';
import { Card, Button, Form, Grid, Divider } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import formHOC from '../../../../../../theme/form/formHOC';
import DynamicFormInput from './dynamicFormInput';
import ShowResponseModal from './showResponseModal';

const metaInfo = {
  store: 'factoryStore',
  form: 'FILEFACTORY_FRM',
};

function FileFactory(props) {
  const [prev, setPrev] = useState(false);
  const [visibleProp, setVisibleProp] = useState(false);
  useEffect(() => {
    props.factoryStore.resetForm('FILEFACTORY_FRM');
    props.factoryStore.setFieldValue('inProgress', false, 'fileFactory');
    props.factoryStore.setFieldValue('DYNAMCI_PAYLOAD_FRM', {}, 'FILEFACTORY');
  }, []);

  function onSubmit() {
    props.factoryStore.fileFactoryPluginTrigger();
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
    FILEFACTORY_FRM, formChangeForPlugin, inProgress, pluginObj, factoryResponse, DYNAMCI_PAYLOAD_FRM, currentPluginSelected,
  } = factoryStore;

  return (
    <>
      <ShowResponseModal open={prev} factoryResponse={factoryResponse} handleCloseModel={handleCloseModel} />
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
                      containerwidth: 16,
                      search: true,
                      options: FILEFACTORY_FRM.fields.method.values,
                      className: 'mb-80',
                    })}
                    <Divider section hidden />
                    <Button className="mt-80 ml-10" primary content="Submit" disabled={inProgress.fileFactory || !FILEFACTORY_FRM.meta.isValid || !DYNAMCI_PAYLOAD_FRM.FILEFACTORY.meta.isValid} loading={inProgress.fileFactory} />
                    {visibleProp && <Link as={Button} className="mt-80 ml-10 ui button inverted green" to="/" onClick={e => showModel(e, true)} title="Show Response"> Show Response </Link>}
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <DynamicFormInput {...props} listType="adminListFilePlugins" pluginObj={pluginObj} formPayload={DYNAMCI_PAYLOAD_FRM.FILEFACTORY} formObj={{ parentForm: 'DYNAMCI_PAYLOAD_FRM', childForm: 'FILEFACTORY' }} selectedPlugin={currentPluginSelected} />
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
