import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { InlineLoader } from '../../../../../theme/shared';
import QueryBuilderContainer from './rdsPlugin/queryBuilderContainer';
@inject('rdsPluginStore', 'nsUiStore')
@withRouter
@observer
export default class RdsPlugin extends Component {
  constructor(props) {
    super(props);
    this.props.rdsPluginStore.fetchPlugins();
  }

  componentDidMount() {
    this.props.rdsPluginStore.fetchPlugins();
  }

  render() {
    const { loadingArray } = this.props.nsUiStore;
    return (
      loadingArray.includes('adminListRdsPlugins')
        ? <InlineLoader />
        : (
          <Grid>
            <Grid.Column>
              <QueryBuilderContainer />
            </Grid.Column>
          </Grid>
        )
    );
  }
}
