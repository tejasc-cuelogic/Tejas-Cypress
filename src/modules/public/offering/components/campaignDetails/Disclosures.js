/* eslint-disable react/jsx-indent */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Header, Divider } from 'semantic-ui-react';
import { get } from 'lodash';
import Aux from 'react-aux';
import { DataFormatter } from '../../../../../helper';
import Disclosure from './DataRoom/Disclosure';
import { InlineLoader } from '../../../../../theme/shared';

@inject('campaignStore', 'accreditationStore', 'navStore')
@withRouter
@observer
export default class TermsOfUse extends Component {
  componentWillMount() {
    window.addEventListener('scroll', this.handleOnScroll);
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
    if (this.props.location.hash && this.props.location.hash !== '' && document.querySelector(`${this.props.location.hash}`)) {
      this.props.navStore.setFieldValue('currentActiveHash', null);
      document.querySelector(`${this.props.location.hash}`).scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });
    }
  }
  componentWillUnmount() {
    this.props.navStore.setFieldValue('currentActiveHash', null);
    window.removeEventListener('scroll', this.handleOnScroll);
  }
  handleOnScroll = () => {
    const { docsWithBoxLink } = this.props.campaignStore;
    docsWithBoxLink.map((item, index) => {
      if (document.getElementById(`doc-${index}`) && document.getElementById(`doc-${index}`).getBoundingClientRect().top < 200 &&
      document.getElementById(`doc-${index}`).getBoundingClientRect().top > -1) {
        this.props.navStore.setFieldValue('currentActiveHash', `#doc-${index}`);
      }
      return null;
    });
  }
  module = name => DataFormatter.upperCamelCase(name);
  dataRoomHeader = (<Header as="h3" className="mb-30 anchor-wrap">
                      Data Rooms
    <span className="anchor-scroll" />
                    </Header>)
  render() {
    const { dataRoomDocs, sortedDocswithBoxLink } = this.props.campaignStore;
    if (!dataRoomDocs.length) {
      return (
        <div className="campaign-content-wrapper">
        {this.dataRoomHeader}
      <InlineLoader text="No Documents to Display" className="bg-offwhite" />
        </div>);
    }
    if (!sortedDocswithBoxLink.length) {
      return <InlineLoader />;
    }
    return (
      <div className="campaign-content-wrapper">
        {this.dataRoomHeader}
        {sortedDocswithBoxLink && sortedDocswithBoxLink.map((item, index) => (
          <Aux>
            <Header id={`doc-${index}`} as="h4" className="mb-20 grey-header">{item.name}</Header>
            <Disclosure doc={item} />
            <Divider section hidden />
          </Aux>
        ))}
      </div>
    );
  }
}
