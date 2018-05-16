import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

@inject('accountStore')
@observer
export default class LinkBankAccount extends Component {
  render() {
    return (
      <div>
        <Header as="h1" textAlign="center">Link Bank Account</Header>
      </div>
    );
  }
}
