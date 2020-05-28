import React from 'react';
import { observer } from 'mobx-react';
import { Grid, Header, Button, Divider, Icon } from 'semantic-ui-react';
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

  const deleteFilter = (e, type, index) => {
    e.preventDefault();
    props.rdsPluginStore.removeOne(metaInfo.form, type, index);
  };

  const { smartElement } = props;
  const { QUERY_BUILDER_FRM } = props.rdsPluginStore;
  const { where, orderBy } = QUERY_BUILDER_FRM.fields;

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
              {smartElement.FormDropDown('name', { multiForm: [metaInfo.form, 'where', index], options: where[index].name.values, containerwidth: 16 })}
            </Grid.Column>
            <Grid.Column>
              {smartElement.FormDropDown('operator', { multiForm: [metaInfo.form, 'where', index] })}
            </Grid.Column>
            <Grid.Column>
              {smartElement.Input('value', { multiForm: [metaInfo.form, 'where', index] })}
              <Button className="link-button mt-5" onClick={e => deleteFilter(e, 'where', index)}><Icon className="ns-trash" /></Button>
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
          <Grid.Column width={8}>
            <Button size="small" color="blue" className="link-button mt-5" onClick={e => addMore(e, 'orderBy')} floated="right">
              + Add more
          </Button>
          </Grid.Column>
        </Grid>
        {orderBy.map((_order, index) => (
          <Grid columns="2">
            <Grid.Column>
              {smartElement.FormDropDown('column', {
                multiForm: ['QUERY_BUILDER_FRM', 'orderBy', index],
                options: QUERY_BUILDER_FRM.fields.orderBy[index].column.values,
              })}
            </Grid.Column>
            <Grid.Column>
              {smartElement.FormDropDown('order', {
                multiForm: ['QUERY_BUILDER_FRM', 'orderBy', index],
                options: QUERY_BUILDER_FRM.fields.orderBy[index].order.values,
              })}
              <Button className="link-button mt-5" onClick={e => deleteFilter(e, 'orderBy', index)}><Icon className="ns-trash" /></Button>
            </Grid.Column>
          </Grid>
        ))}
      </>
      }
    </div>
  );
}
export default (withRouter(formHOC(observer(QueryBuilder), metaInfo)));
