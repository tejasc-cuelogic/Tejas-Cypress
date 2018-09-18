import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Form, Header } from 'semantic-ui-react';

@inject('offeringCreationStore')
@observer
export default class AfIssuer extends Component {
  render() {
    const leaderNumber = this.props.index;
    const index = leaderNumber || 0;
    return (
      <Aux>
        <Form>
          <Header as="h4">
            {`Affiliated Issuer ${index + 1}`}
          </Header>
        </Form>
      </Aux>
    );
  }
}

