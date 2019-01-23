import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Header, Divider } from 'semantic-ui-react';
import Aux from 'react-aux';
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
  componentDidMount() {
    if (this.props.location.hash && this.props.location.hash !== '') {
      document.querySelector(`${this.props.location.hash}`).scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });
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
      <div className="campaign-content-wrapper">
        <Header as="h3" className="mb-30">Data Rooms</Header>
        {docsWithBoxLink && docsWithBoxLink.map((item, index) => (
          <Aux>
            <Header id={`doc-${index}`} as="h3" className="mb-20 grey-header">{item.name}</Header>
            <Disclosure doc={item} />
            <Divider section hidden />
          </Aux>
        ))}
      </div>
    );
  }
}
