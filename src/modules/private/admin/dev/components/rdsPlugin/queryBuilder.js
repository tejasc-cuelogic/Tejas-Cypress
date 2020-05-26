import React from 'react';
import { observer } from 'mobx-react';
import { Grid, Header, Button, Divider } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import formHOC from '../../../../../../theme/form/formHOC';

const metaInfo = {
  store: 'rdsPluginStore',
  form: 'QUERY_BUILDER_FRM',
};

function QueryBuilder(props) {
  const addMore = (e) => {
    e.preventDefault();
    props.rdsPluginStore.addMore(metaInfo.form, 'where');
  };

  const { smartElement } = props;
  const { QUERY_BUILDER_FRM } = props.rdsPluginStore;
  const { where } = QUERY_BUILDER_FRM.fields;

  return (
    <div className="featured-section full-width">
      {smartElement.FormDropDown('selectColumns', {
        multiForm: ['QUERY_BUILDER_FRM', '', -1],
        fielddata: QUERY_BUILDER_FRM.fields.selectColumns,
        options: QUERY_BUILDER_FRM.fields.selectColumns.values,
        multiple: true,
        search: true,
      })}
      {<>
        <Grid className="mt-20">
          <Grid.Column width={8}>
            <Header as="h5" className="mb-0">
              Filters
            </Header>
          </Grid.Column>
          <Grid.Column width={8}>
            <Button size="small" color="blue" className="link-button mt-5" onClick={e => addMore(e)} floated="right">
              + Add more
          </Button>
          </Grid.Column>
        </Grid>
        {where.map((_fiter, index) => (
          <Grid columns="3">
            <Grid.Column>
              {smartElement.FormDropDown('name', { multiForm: [metaInfo.form, 'where', index], options: where[index].name.values })}
            </Grid.Column>
            <Grid.Column>
              {smartElement.FormDropDown('operator', { multiForm: [metaInfo.form, 'where', index], containerwidth: 16 })}
            </Grid.Column>
            <Grid.Column>
              {smartElement.Input('value', { multiForm: [metaInfo.form, 'where', index] })}
            </Grid.Column>
          </Grid>
        ))
        }
        <Divider hidden />
        {smartElement.FormDropDown('groupByColumns', {
          multiForm: ['QUERY_BUILDER_FRM', '', -1],
          fielddata: QUERY_BUILDER_FRM.fields.groupByColumns,
          options: QUERY_BUILDER_FRM.fields.groupByColumns.values,
          multiple: true,
          search: true,
        })}
        <Grid className="mt-20">
          <Grid.Column width={8}>
            <Header as="h5" className="mb-0">
              Order By
            </Header>
          </Grid.Column>
        </Grid>
        <Grid columns="2">
          <Grid.Column>
            {smartElement.FormDropDown('column', {
              multiForm: ['QUERY_BUILDER_FRM', 'orderBy', 0],
              options: QUERY_BUILDER_FRM.fields.orderBy[0].column.values,
            })}
          </Grid.Column>
          <Grid.Column>
            {smartElement.FormDropDown('order', {
              multiForm: ['QUERY_BUILDER_FRM', 'orderBy', 0],
              options: QUERY_BUILDER_FRM.fields.orderBy[0].order.values,
            })}
          </Grid.Column>
        </Grid>
      </>
      }
    </div>
  );
}
export default (withRouter(formHOC(observer(QueryBuilder), metaInfo)));
