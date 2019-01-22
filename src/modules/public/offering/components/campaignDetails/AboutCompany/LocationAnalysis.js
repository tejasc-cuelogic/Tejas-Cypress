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
    // const locationImage = campaign && campaign.media && campaign.media.locationHeroImage &&
    //   campaign.media.locationHeroImage.url ? campaign.media.locationHeroImage.url : null;
    return (
      <Aux>
        <Header as="h3" id="location-analysis">Location Analysis</Header>
        {
          campaign && campaign.offering
            && campaign.offering.about
            && campaign.offering.about.locationAnalysis ?
              <p>
                {Parser(campaign.offering.about.locationAnalysis)}
              </p>
              :
              <InlineLoader text="No data found" className="bg-offwhite" />
        }
        {/* {<Image64 fluid srcUrl={locationImage} />} */}
      </Aux>
    );
  }
}

export default LocationAnalysis;
