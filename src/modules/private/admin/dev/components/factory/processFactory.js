import React, { useEffect, useState } from 'react';
import beautify from 'json-beautify';
import { isEmpty, get } from 'lodash';
import { Card, Button, Form, Grid, Divider, Modal, Header } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import formHOC from '../../../../../../theme/form/formHOC';
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
    props.factoryStore.setFieldValue('processFactoryResponse', {});
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
    props.factoryStore.setFieldValue('processFactoryResponse', {});
  }

  function showModel(e, val) {
    e.preventDefault();
    setPrev(val);
  }

  const { factoryStore, smartElement } = props;
  const {
    PROCESSFACTORY_FRM, pluginObj, formChangeForPlugin, inProgress, processFactoryResponse, DYNAMCI_PAYLOAD_FRM, currentPluginSelected,
  } = factoryStore;
  const isExtraInfoVisible = !!(DYNAMCI_PAYLOAD_FRM.PROCESSFACTORY && DYNAMCI_PAYLOAD_FRM.PROCESSFACTORY.fields && !isEmpty(DYNAMCI_PAYLOAD_FRM.PROCESSFACTORY.fields));
  return (
    <>
      <Modal open={prev} size="small" closeOnDimmerClick={false} closeIcon onClose={e => handleCloseModel(e, false)}>
        <Modal.Content>
          <Header as="h3">Response Payload</Header>
          {processFactoryResponse && !isEmpty(processFactoryResponse)
            ? (
              <pre className="no-updates bg-offwhite padded json-text">
                {beautify(processFactoryResponse, null, 2, 100)}
              </pre>
            )
            : (
              <section className="bg-offwhite mb-20 center-align">
                <Header as="h5">No Response Available.</Header>
              </section>
            )
          }
        </Modal.Content>
      </Modal>
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
                      options: PROCESSFACTORY_FRM.fields.method.values,
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
