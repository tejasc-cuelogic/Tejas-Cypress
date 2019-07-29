import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { InlineLoader } from '../../../../../../theme/shared';
import HtmlEditor from '../../../../../shared/HtmlEditor';

const isMobile = document.documentElement.clientWidth < 992;
@inject('campaignStore')
@observer
class LocationAnalysis extends Component {
  render() {
    const { campaign } = this.props.campaignStore;
    return (
      <>
        <Header as="h3" className={`${(this.props.newLayout && isMobile) ? 'mb-10' : this.props.newLayout ? 'mt-50 mb-30' : 'mt-20 mb-30'} anchor-wrap`}>
          Location Analysis
          <span className="anchor" id="location-analysis" />
        </Header>
        {campaign && campaign.offering
          && campaign.offering.about
          && campaign.offering.about.locationAnalysis
          ? <HtmlEditor readOnly content={campaign.offering.about.locationAnalysis} />
          : <InlineLoader text="No data found" className="bg-offwhite" />
        }
      </>
    );
  }
}

export default LocationAnalysis;
