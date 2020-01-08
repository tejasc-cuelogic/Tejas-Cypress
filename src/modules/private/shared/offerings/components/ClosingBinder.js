import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import DataRoom from './legal/DataRoom';

@inject('uiStore', 'offeringCreationStore')
@observer
export default class ClosingBinder extends Component {
  constructor(props) {
    super(props);
    const { setFormData } = this.props.offeringCreationStore;
    setFormData('CLOSING_BINDER_FRM', '');
  }

  render() {
    return (
      <div>
        <DataRoom offeringClose closingBinder />
      </div>
    );
  }
}
