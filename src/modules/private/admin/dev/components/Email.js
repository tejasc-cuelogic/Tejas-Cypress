import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import EmailList from './email/emailList';
import TriggerEmail from './email/triggerEmail';

import { InlineLoader } from '../../../../../theme/shared';


@inject('emailStore', 'nsUiStore')
@withRouter
@observer
export default class Email extends Component {
  constructor(props) {
    super(props);
    this.props.emailStore.fetchAdminListEmailTypesAndIdentifier().then(() => {
      this.props.emailStore.setInitiateSrch('emailType', 'DEV');
      this.props.emailStore.initRequest();
    });
  }

  render() {
    const { loadingArray } = this.props.nsUiStore;
    return (
      loadingArray.includes('adminListEmailType')
        ? <InlineLoader />
        : (
          <Grid>
            <Grid.Column>
              <TriggerEmail />
              <EmailList />
            </Grid.Column>
          </Grid>
        )
    );
  }
}
