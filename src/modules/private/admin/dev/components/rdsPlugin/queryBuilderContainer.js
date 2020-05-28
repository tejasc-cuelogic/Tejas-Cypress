import React, { useEffect } from 'react';
import { pick } from 'lodash';
import { Card, Button, Form, Grid, Divider } from 'semantic-ui-react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import formHOC from '../../../../../../theme/form/formHOC';
import QueryBuilder from './queryBuilder';

const metaInfo = {
  store: 'rdsPluginStore',
  form: 'QUERY_BUILDER_FRM',
};

function QueryBuilderContainer(props) {
  useEffect(() => {
    props.rdsPluginStore.resetForm('QUERY_BUILDER_FRM');
  }, []);

  function onSubmit() {
    props.rdsPluginStore.initRequest();
  }

  const { rdsPluginStore, smartElement } = props;
  const {
    QUERY_BUILDER_FRM, formChangeForTable,
  } = rdsPluginStore;

  const { loadingArray } = props.nsUiStore;

  return (
    <>
      <Card fluid className="elastic-search">
        <Card.Content header="Trigger File Factory" />
        <Card.Content>
          <Card.Description>
            <Form onSubmit={QUERY_BUILDER_FRM.meta.isValid && onSubmit}>
              <Form.Group>
                <Grid className="full-width mlr-0" stackable>
                  <Grid.Column width={8}>
                    {smartElement.FormDropDown('table', {
                      onChange: (e, result) => formChangeForTable(e, result, {
                        multiForm: ['QUERY_BUILDER_FRM', '', -1],
                      }),
                      fielddata: QUERY_BUILDER_FRM.fields.table,
                      containerclassname: 'dropdown-field mlr-0',
                      placeholder: 'Choose here',
                      containerwidth: 16,
                      options: QUERY_BUILDER_FRM.fields.table.values.map(t => ({ ...pick(t, ['key', 'value', 'text']) })),
                      className: 'mb-80',
                    })}
                    <Divider section hidden />
                    <Button className="mt-80 ml-10" primary content="Submit" disabled={!QUERY_BUILDER_FRM.meta.isValid || loadingArray.includes('adminRunRdsQuery')} />
                  </Grid.Column>
                  <Grid.Column width={8}>
                    {QUERY_BUILDER_FRM.fields.table.value !== ''
                      && <QueryBuilder />
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

export default (inject('rdsPluginStore', 'nsUiStore')(withRouter(formHOC(observer(QueryBuilderContainer), metaInfo))));
