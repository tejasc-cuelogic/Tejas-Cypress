/* eslint-disable react/jsx-indent */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Header } from 'semantic-ui-react';
import { get } from 'lodash';
import { DataFormatter } from '../../../../../helper';
import Disclosure from './DataRoom/Disclosure';
import { InlineLoader } from '../../../../../theme/shared';

@inject('campaignStore', 'accreditationStore')
@withRouter
@observer
export default class TermsOfUse extends Component {
  componentWillMount() {
    if (this.props.campaignStore.docsWithBoxLink.length === 0) {
      const { campaign } = this.props.campaignStore;
      const regulation = get(campaign, 'regulation');
      const offeringRegulationArr = (regulation && regulation.split('_')) || '';
      const regulationType = get(offeringRegulationArr, '[0]');
      const accountType = regulationType === 'BD' ? 'SECURITIES' : 'SERVICES';
      this.props.campaignStore.getAllBoxLinks(accountType);
      this.props.accreditationStore.getUserAccreditation();
    }
  }
  componentDidMount() {
    const sel = 'anchor';
    document.querySelector(`.${sel}`).scrollIntoView(true);
  }
  module = name => DataFormatter.upperCamelCase(name);
  dataRoomHeader = (
    <Header as="h3" className="mt-20 mb-30 anchor-wrap">
      Data Room
      <span className="anchor" />
    </Header>
  )
  render() {
    const { campaign } = this.props.campaignStore;
    const campaignCreatedBy = get(campaign, 'created.id') || null;
    const { dataRoomDocs, sortedDocswithBoxLink } = this.props.campaignStore;
    if (!dataRoomDocs.length) {
      return (
        <div className="campaign-content-wrapper">
        {this.dataRoomHeader}
      <InlineLoader text="No Documents to Display" className="bg-offwhite" />
        </div>);
    }
    if (dataRoomDocs.length !== sortedDocswithBoxLink.length) {
      return (
        <div className="campaign-content-wrapper">
          {this.dataRoomHeader}
          <InlineLoader />
        </div>);
    }
    const index = (this.props.location.hash || '#1').substr(1);
    return (
      <div className="campaign-content-wrapper">
        {this.dataRoomHeader}
        <Header as="h4" className="mb-20 grey-header">{sortedDocswithBoxLink[index - 1].name}</Header>
        <Disclosure campaignCreatedBy={campaignCreatedBy} doc={sortedDocswithBoxLink[index - 1]} />
      </div>
    );
  }
}
