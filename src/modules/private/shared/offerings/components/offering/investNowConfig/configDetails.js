import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Card, Form, Grid, Button } from 'semantic-ui-react';
import formHOC from '../../../../../../../theme/form/formHOC';

const metaInfo = {
  store: 'manageOfferingStore',
  form: 'INVEST_NOW_CONFIG_FRM',
};

function ConfigDetails(props) {
  //   useEffect(() => {
  //     props.factoryStore.resetForm('INVEST_NOW_CONFIG_FRM');
  //     props.factoryStore.setFieldValue('inProgress', false, 'fileFactory');
  //   }, []);

  const onSubmit = () => {
    props.manageOfferingStore.updateConfig();
  };

  const { smartElement, manageOfferingStore, uiStore } = props;
  const { inProgress } = uiStore;
  const {
    INVEST_NOW_CONFIG_FRM,
  } = manageOfferingStore;
  const isReadOnly = false;
  return (
    <>
      <Grid>
        <Grid.Column>
          <Card fluid className="elastic-search">
            <Card.Content header="Generate Document" />
            <Card.Content>
              <Card.Description>
                <Form onSubmit={INVEST_NOW_CONFIG_FRM.meta.isValid && onSubmit}>
                  <Form.Group className="bottom-aligned">
                    <Form.Field width={12}>
                      {smartElement.RadioGroup('investmentType', {
                        readOnly: isReadOnly,
                      })
                      }
                    </Form.Field>
                    <Form.Field width={4}>
                      <Button primary content="Submit" disabled={!INVEST_NOW_CONFIG_FRM.meta.isValid || inProgress === 'save'} loading={inProgress === 'save'} />
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

export default inject('uiStore')(withRouter(formHOC(observer(ConfigDetails), metaInfo)));
