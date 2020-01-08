import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import EmailList from './email/emailList';

@inject('emailStore')
@withRouter
@observer
export default class Email extends Component {
  render() {
    return (
      <Grid>
        <Grid.Column>
          <EmailList />
        </Grid.Column>
      </Grid>
    );
  }
}
