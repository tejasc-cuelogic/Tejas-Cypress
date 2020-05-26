import React from 'react';
import { observer } from 'mobx-react';
import { Grid, Header, Button } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import formHOC from '../../../../../../theme/form/formHOC';

const metaInfo = {
  store: 'rdsPluginStore',
  form: 'QUERY_FILTER_FRM',
};

function QueryFilters(props) {
  const addMore = (e) => {
    e.preventDefault();
    props.rdsPluginStore.addMore(metaInfo.form, 'filters');
  };

  const { smartElement } = props;
  const { QUERY_FILTER_FRM, formChangeForColumns } = props.rdsPluginStore;
  return (
    <div className="featured-section full-width">
      {smartElement.FormDropDown('selectColumns', {
        onChange: (e, result) => formChangeForColumns(e, result, 'QUERY_FILTER_FRM'),
        fielddata: QUERY_FILTER_FRM.fields.selectColumns,
        options: QUERY_FILTER_FRM.fields.selectColumns.values,
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


        {QUERY_FILTER_FRM.fields.filters.map((_fiter, index) => (
          <Grid columns="3">
            <Grid.Column>
              {smartElement.Input('column', { multiForm: ['QUERY_FILTER_FRM', 'filters', index] })}
            </Grid.Column>
            <Grid.Column>
              {smartElement.FormDropDown('operator', { multiForm: ['QUERY_FILTER_FRM', 'filters', index] })}
            </Grid.Column>
            <Grid.Column>
              {smartElement.Input('columnValue', { multiForm: ['QUERY_FILTER_FRM', 'filters', index] })}
            </Grid.Column>
          </Grid>
        ))
        }
      </>
      }
    </div>
  );
}
export default (withRouter(formHOC(observer(QueryFilters), metaInfo)));
