import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';

@inject('userStore')
@withRouter
@observer
export default class BusinessApplication extends Component {
  render() {
    const { isIssuer } = this.props.userStore;
    const { match } = this.props;
    return (
      <div className={!isIssuer || (isIssuer && match.url.includes('offering-creation')) ? 'inner-content-spacer' : ''}>
        <Grid>
          <div>Cooming Soon BusinessApplication</div>
        </Grid>
      </div>
    );
  }
}
