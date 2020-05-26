import React, { useEffect } from 'react';
import { pick } from 'lodash';
import { Card, Button, Form, Grid, Divider } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import formHOC from '../../../../../../theme/form/formHOC';
import QueryFilters from './queryFilters';

const metaInfo = {
  store: 'rdsPluginStore',
  form: 'TABLE_FRM',
};

function QueryBuilder(props) {
  useEffect(() => {
    props.rdsPluginStore.resetForm('TABLE_FRM');
  }, []);

  function onSubmit() {
    props.rdsPluginStore.fileFactoryPluginTrigger();
  }

  const { rdsPluginStore, smartElement } = props;
  const {
    TABLE_FRM, formChangeForTable,
  } = rdsPluginStore;

  return (
    <>
      <Card fluid className="elastic-search">
        <Card.Content header="Trigger File Factory" />
        <Card.Content>
          <Card.Description>
            <Form onSubmit={TABLE_FRM.meta.isValid && onSubmit}>
              <Form.Group>
                <Grid className="full-width mlr-0" stackable>
                  <Grid.Column width={8}>
                    {smartElement.FormDropDown('table', {
                      onChange: (e, result) => formChangeForTable(e, result, 'TABLE_FRM'),
                      containerclassname: 'dropdown-field mlr-0',
                      placeholder: 'Choose here',
                      containerwidth: 16,
                      options: TABLE_FRM.fields.table.values.map(t => ({ ...pick(t, ['key', 'value']), text: t.value })),
                      className: 'mb-80',
                    })}
                    <Divider section hidden />
                    <Button className="mt-80 ml-10" primary content="Submit" disabled={!TABLE_FRM.meta.isValid} />
                  </Grid.Column>
                  <Grid.Column width={8}>
                    {TABLE_FRM.fields.table.value !== ''
                      && <QueryFilters />
                    }
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

export default (withRouter(formHOC(observer(QueryBuilder), metaInfo)));
