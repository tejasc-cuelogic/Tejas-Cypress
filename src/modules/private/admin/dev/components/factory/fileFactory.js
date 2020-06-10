import React, { useEffect, useState } from 'react';
import { Card, Button, Form, Grid, Divider, Header } from 'semantic-ui-react';
import { isEmpty, get } from 'lodash';
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
    props.factoryStore.fileFactoryPluginTrigger().then(() => {
      setVisibleProp(true);
    });
  }

  function handleCloseModel(e, val) {
    e.preventDefault();
    setPrev(val);
  }

  function showModel(e, val) {
    e.preventDefault();
    setPrev(val);
  }

  const { factoryStore, smartElement } = props;
  const {
    FILEFACTORY_FRM, formChangeForPlugin, inProgress, pluginObj, factoryResponse, DYNAMCI_PAYLOAD_FRM, currentPluginSelected,
  } = factoryStore;
  const isExtraInfoVisible = !!(DYNAMCI_PAYLOAD_FRM.FILEFACTORY && DYNAMCI_PAYLOAD_FRM.FILEFACTORY.fields && !isEmpty(DYNAMCI_PAYLOAD_FRM.FILEFACTORY.fields));
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
                    <Divider hidden />
                    {isExtraInfoVisible && get(pluginObj, 'note')
                      && (
                        <Header as="h6">Note: <span className="regular-text">{pluginObj.note}</span>
                        </Header>
                      )}

                    {isExtraInfoVisible && get(pluginObj, 'note')
                      && (
                        <Header as="h6">Description: <span className="regular-text">{pluginObj.description}</span>
                        </Header>
                      )}
                    <Divider section hidden />
                    <Button className="mt-80 ml-10" primary content="Submit" disabled={inProgress.fileFactory || !FILEFACTORY_FRM.meta.isValid || !DYNAMCI_PAYLOAD_FRM.FILEFACTORY.meta.isValid} loading={inProgress.fileFactory} />
                    {(visibleProp && factoryResponse) && <Link as={Button} className="mt-80 ml-10 ui button inverted green" to="/" onClick={e => showModel(e, true)} title="Show Response"> Show Response </Link>}
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
