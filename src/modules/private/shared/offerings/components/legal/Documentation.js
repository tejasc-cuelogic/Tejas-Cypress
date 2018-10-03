import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

@inject('offeringCreationStore', 'userStore')
@observer
export default class Documentation extends Component {
  render() {
    const { isIssuer } = this.props.userStore;
    const { match } = this.props;
    return (
      <div className={!isIssuer || (isIssuer && match.url.includes('offering-creation')) ? '' : 'ui card fluid form-card'}>
        <Header as="h4" textAlign="center">In Documentation page!</Header>
      </div>
    );
  }
}
