import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Card, Form, Grid, Button } from 'semantic-ui-react';
import formHOC from '../../../../../../../theme/form/formHOC';
// import DynamicFormInput from './dynamicFormInput';

const metaInfo = {
  store: 'factoryStore',
  form: 'FILEFACTORY_FRM',
};
/* constructor(props) {
  super(props);
  this.props.businessAppReviewStore.setFormData('APPLICATION_MAPPED_OFFERING_FORM');
}

componentWillUnmount() {
  this.props.businessAppReviewStore.resetBusinessApplicationMappingForm('APPLICATION_MAPPED_OFFERING_FORM');
} */
function GenerateDocuments(props) {
  useEffect(() => {
    props.factoryStore.resetForm('FILEFACTORY_FRM');
    props.factoryStore.setFieldValue('inProgress', false, 'fileFactory');
    props.factoryStore.setFieldValue('DYNAMCI_PAYLOAD_FRM', {}, 'FILEFACTORY');
  }, []);

  const onSubmit = () => {
    props.factoryStore.fileFactoryPluginTrigger(true);
  };

  const { factoryStore, smartElement } = props;
  const {
    FILEFACTORY_FRM, formChangeForPlugin, inProgress, DYNAMCI_PAYLOAD_FRM,
  } = factoryStore;
  return (
    <>
      <Grid>
        <Grid.Column>
          <Card fluid className="elastic-search">
            <Card.Content header="Generate Document" />
            <Card.Content>
              <Card.Description>
                <Form onSubmit={FILEFACTORY_FRM.meta.isValid && onSubmit}>
                  <Form.Group className="bottom-aligned">
                    <Form.Field width={8}>
                      {smartElement.FormDropDown('method', {
                        onChange: (e, result) => formChangeForPlugin(e, result, 'FILEFACTORY_FRM'),
                        containerclassname: 'dropdown-field mlr-0',
                        placeholder: 'Choose here',
                        options: FILEFACTORY_FRM.fields.method.values,
                        className: 'mb-80',
                        containerwidth: 14,
                      })}
                    </Form.Field>
                    <Form.Field width={4}>
                      <Button primary content="Generate" disabled={inProgress.fileFactory || !FILEFACTORY_FRM.meta.isValid || !DYNAMCI_PAYLOAD_FRM.FILEFACTORY.meta.isValid} loading={inProgress.fileFactory} />
                    </Form.Field>
                  </Form.Group>
                </Form>
              </Card.Description>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    </>
  );
}

export default (withRouter(formHOC(observer(GenerateDocuments), metaInfo)));
