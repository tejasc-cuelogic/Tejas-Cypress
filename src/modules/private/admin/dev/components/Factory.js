import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { InlineLoader } from '../../../../../theme/shared';
import CronFactory from './factory/cronFactory';

@inject('factoryStore', 'nsUiStore')
@withRouter
@observer
export default class Factory extends Component {
  constructor(props) {
    super(props);
    this.props.factoryStore.fetchPlugins();
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
              <CronFactory />
            </Grid.Column>
          </Grid>
        )
    );
  }
}
