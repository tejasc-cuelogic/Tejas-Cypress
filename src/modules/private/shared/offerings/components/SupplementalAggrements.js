import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import DataRoom from './legal/DataRoom';

@inject('uiStore', 'offeringCreationStore')
@observer
export default class SupplementalAggrements extends Component {
  constructor(props) {
    super(props);
    const { setFormData } = this.props.offeringCreationStore;
    setFormData('DATA_ROOM_FRM', 'closureSummary.keyTerms.supplementalAgreements');
  }

  render() {
    return (
      <div>
        <DataRoom offeringClose />
      </div>
    );
  }
}
