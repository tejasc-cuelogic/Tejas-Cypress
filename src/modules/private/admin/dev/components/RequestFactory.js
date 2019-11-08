import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { InlineLoader } from '../../../../../theme/shared';
import TriggerRequestFactory from './factory/requestFactory';
import RequestFactoryLogs from './factory/requestFactoryLogs';

@inject('factoryStore', 'nsUiStore')
@withRouter
@observer
export default class RequestFactory extends Component {
  constructor(props) {
    super(props);
    this.props.factoryStore.fetchPlugins();
    this.props.factoryStore.setFieldValue('selectedFactory', 'REQUEST');
  }

  componentDidMount() {
    this.props.factoryStore.fetchPlugins();
  }

  render() {
    const { loadingArray } = this.props.nsUiStore;
    return (
      loadingArray.includes('getPluginList')
        ? <InlineLoader />
        : (
          <Grid>
            <Grid.Column>
              <TriggerRequestFactory />
              <RequestFactoryLogs />
            </Grid.Column>
          </Grid>
        )
    );
  }
}
