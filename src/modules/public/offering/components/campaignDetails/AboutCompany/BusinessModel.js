import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import Parser from 'html-react-parser';
import { InlineLoader } from '../../../../../../theme/shared';

@inject('campaignStore')
@observer
class BusinessModel extends Component {
  render() {
    const { campaign } = this.props.campaignStore;
    return (
      <Aux>
        <Header as="h3" className="anchor-wrap mb-30">
          Business Model
          <span className="anchor" id="business-model" />
        </Header>
        {campaign && campaign.offering && campaign.offering.about &&
          campaign.offering.about.businessModel ?
            <p>{Parser(campaign.offering.about.businessModel)}</p> :
            <InlineLoader text="No data found" className="bg-offwhite" />
        }
      </Aux>
    );
  }
}

export default BusinessModel;
