/* eslint-disable react/jsx-indent */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Header } from 'semantic-ui-react';
import Aux from 'react-aux';
import { get, isEmpty } from 'lodash';
import { DataFormatter } from '../../../../../helper';
import Disclosure from './DataRoom/Disclosure';
import { InlineLoader } from '../../../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 992;

@inject('campaignStore', 'accreditationStore', 'authStore')
@withRouter
@observer
export default class TermsOfUse extends Component {
  dataRoomHeader = (
      <Header as="h3" className="mt-20 mb-30 anchor-wrap">
        Data Room
        <span className="anchor" />
      </Header>
  );

  componentWillMount() {
    const { docsWithBoxLink, isFetchedError } = this.props.campaignStore;
    if (docsWithBoxLink.length === 0 && !isFetchedError) {
      const { campaign } = this.props.campaignStore;
      const regulation = get(campaign, 'regulation');
      const offeringRegulationArr = (regulation && regulation.split('_')) || '';
      const regulationType = get(offeringRegulationArr, '[0]');
      const accountType = regulationType === 'BD' ? 'SECURITIES' : 'SERVICES';
      if (isMobile) {
        this.props.campaignStore.getAllBoxLinks(accountType);
      }
      if (this.props.authStore.isUserLoggedIn
        && isEmpty(this.props.accreditationStore.userData)) {
        this.props.accreditationStore.getUserAccreditation();
      }
    }
  }

  componentDidMount() {
    if (!isMobile) {
      const sel = 'anchor';
      document.querySelector(`.${sel}`).scrollIntoView(true);
    }
  }

  componentWillUnmount() {
    const { setFieldValue } = this.props.campaignStore;
    setFieldValue('isFetchedError', false);
  }

  module = name => DataFormatter.upperCamelCase(name);

  render() {
    const { campaign } = this.props.campaignStore;
    const campaignCreatedBy = get(campaign, 'created.id') || null;
    const { dataRoomDocs, sortedDocswithBoxLink } = this.props.campaignStore;
    if (!dataRoomDocs.length) {
      return (
        <div className="campaign-content-wrapper">
        {this.dataRoomHeader}
      <InlineLoader text="No Documents to Display" className="bg-offwhite" />
        </div>
      );
    }
    if (isMobile && dataRoomDocs.length !== sortedDocswithBoxLink.length) {
      return (
        <div className="campaign-content-wrapper">
          {this.dataRoomHeader}
          <InlineLoader />
        </div>
      );
    }
    const index = (this.props.location.hash || '#1').substr(1);
    return (
      <div className="campaign-content-wrapper">
        {this.dataRoomHeader}
        {isMobile
          ? sortedDocswithBoxLink.map(doc => (
          <Aux>
            <Header as="h4" className="mb-20 grey-header">{doc.name}</Header>
            <Disclosure campaignCreatedBy={campaignCreatedBy} doc={doc} />
          </Aux>
          ))
          : (
<Aux>
          <Header as="h4" className="mb-20 grey-header">{dataRoomDocs[index - 1].name}</Header>
          <Disclosure
            campaignCreatedBy={campaignCreatedBy}
            doc={dataRoomDocs[index - 1]}
            fileId={get(dataRoomDocs[index - 1], 'upload.fileHandle.boxFileId')}
          />
</Aux>
          )
        }
      </div>
    );
  }
}
