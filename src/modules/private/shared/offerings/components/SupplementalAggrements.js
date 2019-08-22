import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import DataRoom from './legal/DataRoom';

@inject('uiStore')
@observer
export default class SupplementalAggrements extends Component {
  render() {
    return (
      <div>
        <DataRoom offeringClose />
      </div>
    );
  }
}
