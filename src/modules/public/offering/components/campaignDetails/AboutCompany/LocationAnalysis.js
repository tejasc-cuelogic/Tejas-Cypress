import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import Aux from 'react-aux';
import Parser from 'html-react-parser';
import { inject, observer } from 'mobx-react';
import { InlineLoader } from '../../../../../../theme/shared';

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
            <p>{Parser(campaign.offering.about.locationAnalysis)}</p> :
            <InlineLoader text="No data found" className="bg-offwhite" />
        }
      </Aux>
    );
  }
}

export default LocationAnalysis;
