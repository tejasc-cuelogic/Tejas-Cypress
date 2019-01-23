import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Grid } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { DataFormatter } from '../../../../../helper';
import Disclosure from './DataRoom/Disclosure';
import { InlineLoader } from '../../../../../theme/shared';

@inject('campaignStore', 'accreditationStore')
@withRouter
@observer
export default class TermsOfUse extends Component {
  componentWillMount() {
    if (this.props.campaignStore.docsWithBoxLink.length === 0) {
      const offeringRegulationArr = this.props.campaignStore.campaign.regulation.split('_');
      const regulationType = offeringRegulationArr[0];
      const accountType = regulationType === 'BD' ? 'SECURITIES' : 'SERVICES';
      this.props.campaignStore.getAllBoxLinks(accountType);
      this.props.accreditationStore.getUserAccreditation();
    }
  }
  module = name => DataFormatter.upperCamelCase(name);
  render() {
    const { docsWithBoxLink, dataRoomDocs } = this.props.campaignStore;
    if (!dataRoomDocs.length) {
      return <InlineLoader text="No Documents to Display" />;
    }
    if (!docsWithBoxLink.length) {
      return <InlineLoader />;
    }
    return (
      <Aux>
        <div className="campaign-content-wrapper">
          <Grid>
            <Grid.Column widescreen={13} computer={13} tablet={12} mobile={16}>
              {docsWithBoxLink && docsWithBoxLink.map(item => (
                <Disclosure doc={item} />
              ))
              }
            </Grid.Column>
          </Grid>
        </div>
      </Aux>
    );
  }
}
