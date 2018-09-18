import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';


@inject('offeringCreationStore')
@observer
export default class Leadership extends Component {
  render() {
    return (
      <Aux>
        Leadership
      </Aux>
    );
  }
}
