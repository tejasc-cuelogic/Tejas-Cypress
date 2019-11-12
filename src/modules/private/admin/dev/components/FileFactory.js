import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { InlineLoader } from '../../../../../theme/shared';
import TriggerFileFactory from './factory/fileFactory';

@inject('factoryStore', 'nsUiStore')
@withRouter
@observer
export default class FileFactory extends Component {
  constructor(props) {
    super(props);
    this.props.factoryStore.fetchPlugins();
    this.props.factoryStore.setFieldValue('selectedFactory', 'PROCESS');
  }

  componentDidMount() {
    // this.props.factoryStore.fetchPlugins();
    this.props.factoryStore.fetchPluginsForFileFactory();
  }

  render() {
    const { loadingArray } = this.props.nsUiStore;
    return (
      loadingArray.includes('getPluginList')
        ? <InlineLoader />
        : (
          <Grid>
            <Grid.Column>
              <TriggerFileFactory />
            </Grid.Column>
          </Grid>
        )
    );
  }
}
