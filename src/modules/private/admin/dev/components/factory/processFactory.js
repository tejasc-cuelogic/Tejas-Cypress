import React, { useEffect, useState } from 'react';
import beautify from 'json-beautify';
import { isEmpty } from 'lodash';
import { Card, Button, Form, Grid, Divider, Modal, Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { FormDropDown, FormTextarea } from '../../../../../../theme/form';

function ProcessFactory(props) {
  const [prev, setPrev] = useState(false);
  const [visibleProp, setVisibleProp] = useState(false);

  useEffect(() => {
    props.factoryStore.resetForm('PROCESSACTORY_FRM');
    props.factoryStore.setFieldValue('inProgress', false, 'processFactory');
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

  const { factoryStore } = props;
  const {
    PROCESSACTORY_FRM, formChange, inProgress, processFactoryResponse,
  } = factoryStore;

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
            <Form onSubmit={PROCESSACTORY_FRM.meta.isValid && onSubmit}>
              <Form.Group>
                <Grid className="full-width mlr-0" stackable>
                  <Grid.Column width={8}>
                    <FormDropDown
                      fielddata={PROCESSACTORY_FRM.fields.method}
                      selection
                      containerclassname="dropdown-field mlr-0"
                      options={PROCESSACTORY_FRM.fields.method.values}
                      placeholder="Choose here"
                      name="method"
                      onChange={(e, result) => formChange(e, result, 'PROCESSACTORY_FRM')}
                      className="mb-80"
                    />
                    <Divider section hidden />
                    <Button className="mt-80 ml-10" primary content="Submit" disabled={inProgress.processFactory || !PROCESSACTORY_FRM.meta.isValid} loading={inProgress.processFactory} />
                    {visibleProp && <Link as={Button} className="mt-80 ml-10 ui button inverted green" to="/" onClick={e => showModel(e, true)} title="Show Response"> Show Response </Link>}
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <FormTextarea
                      name="payload"
                      fielddata={PROCESSACTORY_FRM.fields.payload}
                      changed={(e, result) => formChange(e, result, 'PROCESSACTORY_FRM')}
                      containerclassname="secondary huge"
                    />
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

export default inject('factoryStore')(withRouter(observer(ProcessFactory)));
