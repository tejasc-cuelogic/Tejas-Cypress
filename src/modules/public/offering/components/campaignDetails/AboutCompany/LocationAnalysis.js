import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { InlineLoader } from '../../../../../../theme/shared';
import HtmlEditor from '../../../../../shared/HtmlEditor';

@inject('campaignStore')
@observer
class LocationAnalysis extends Component {
  render() {
    const { campaign } = this.props.campaignStore;
    return (
      <Aux>
        <Header as="h3" className="anchor-wrap mb-30">
          Location Analysis
          <span className="anchor" id="location-analysis" />
        </Header>
        {campaign && campaign.offering
          && campaign.offering.about
          && campaign.offering.about.locationAnalysis ?
            <HtmlEditor readOnly content={campaign.offering.about.locationAnalysis} /> :
            <InlineLoader text="No data found" className="bg-offwhite" />
        }
      </Aux>
    );
  }
}

export default LocationAnalysis;
