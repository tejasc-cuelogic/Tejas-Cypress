import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { InlineLoader } from '../../../../../theme/shared';
import RequestFactory from './factory/requestFactory';

@inject('factoryStore')
@withRouter
@observer
export default class Factory extends Component {
  constructor(props) {
    super(props);
    this.props.factoryStore.fetchPlugins();
  }

  render() {
    const { pluginListOutputLoading } = this.props.factoryStore;
    return (
      pluginListOutputLoading
        ? <InlineLoader />
        : (
          <Grid>
            <Grid.Column>
              <RequestFactory />
            </Grid.Column>
          </Grid>
        )
    );
  }
}
