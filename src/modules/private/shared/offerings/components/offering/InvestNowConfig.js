import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import ConfigDetails from './investNowConfig/configDetails';
import { InlineLoader } from '../../../../../../theme/shared';

@inject('offeringsStore', 'nsUiStore', 'manageOfferingStore')
@withRouter
@observer
class InvestNowConfig extends Component {
  constructor(props) {
    super(props);
    this.props.manageOfferingStore.setFormData('INVEST_NOW_CONFIG_FRM', 'investNow.config');
  }

  render() {
    const { loadingArray } = this.props.nsUiStore;
    const { offer, offerDataLoading } = this.props.offeringsStore;
    const regulation = get(offer, 'regulation');
    const securities = get(offer, 'keyTerms.securities');
    const showWarningMsg = (!regulation || !securities);
    return (
      (loadingArray.includes('adminListFilePlugins') || offerDataLoading)
        ? <InlineLoader />
        : showWarningMsg
          ? (
            <div className="inner-content-spacer">
              <span className="negative-text mt-10 ml-10">Please select and verify the offering Regulation and Security (and equity class for Equity).</span>
            </div>
          )
          : (
            <ConfigDetails />
          )
    );
  }
}

export default InvestNowConfig;
