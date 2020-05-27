import React, { useEffect, useState } from 'react';
import beautify from 'json-beautify';
import { isEmpty } from 'lodash';
import { Card, Button, Form, Grid, Divider, Modal, Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import formHOC from '../../../../../../theme/form/formHOC';
import DynamicFormInput from '../factory/dynamicFormInput';

const metaInfo = {
  store: 'factoryStore',
  form: 'EMAILFACTORY_FRM',
};

function TriggerEmail(props) {
  const [prev, setPrev] = useState(false);
  const [visibleProp, setVisibleProp] = useState(false);

  useEffect(() => {
    props.factoryStore.resetForm('EMAILFACTORY_FRM');
    props.factoryStore.setFieldValue('inProgress', false, 'emailFactory');
    props.factoryStore.setFieldValue('DYNAMCI_PAYLOAD_FRM', {}, 'EMAIL_LIST');
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

  const { factoryStore, smartElement, emailStore } = props;
  const {
    EMAILFACTORY_FRM, formChangeForPlugin, inProgress, processFactoryResponse, DYNAMCI_PAYLOAD_FRM, currentPluginSelected,
  } = factoryStore;
  const {
    emailPlugin,
  } = emailStore;

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
        <Card.Content header="Trigger Email" />
        <Card.Content>
          <Card.Description>
            <Form onSubmit={EMAILFACTORY_FRM.meta.isValid && onSubmit}>
              <Form.Group>
                <Grid className="full-width mlr-0" stackable>
                  <Grid.Column width={8}>
                    {smartElement.FormDropDown('method', {
                      onChange: (e, result) => formChangeForPlugin(e, result, 'EMAILFACTORY_FRM'),
                      containerclassname: 'dropdown-field mlr-0',
                      placeholder: 'Choose here',
                      containerwidth: 16,
                      options: EMAILFACTORY_FRM.fields.method.values,
                      className: 'mb-80',
                    })}
                    <Divider section hidden />
                    <Button className="mt-80 ml-10" primary content="Submit" disabled={inProgress.emailFactory || !EMAILFACTORY_FRM.meta.isValid || !DYNAMCI_PAYLOAD_FRM.EMAIL_LIST.meta.isValid} loading={inProgress.emailFactory} />
                    {visibleProp && <Link as={Button} className="mt-80 ml-10 ui button inverted green" to="/" onClick={e => showModel(e, true)} title="Show Response"> Show Response </Link>}
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <DynamicFormInput {...props} pluginObj={emailPlugin} formPayload={DYNAMCI_PAYLOAD_FRM.EMAIL_LIST} formObj={{ parentForm: 'DYNAMCI_PAYLOAD_FRM', childForm: 'EMAIL_LIST' }} selectedPlugin={currentPluginSelected} />
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

export default inject('emailStore')(withRouter(formHOC(observer(TriggerEmail), metaInfo)));
