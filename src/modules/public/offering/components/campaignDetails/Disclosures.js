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
    if (this.props.location.hash && this.props.location.hash !== '') {
      this.props.navStore.setFieldValue('currentActiveHash', null);
      setTimeout(() => document.querySelector(`${this.props.location.hash}`).scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      }), 100);
    }
  }
  componentWillUnmount() {
    this.props.navStore.setFieldValue('currentActiveHash', null);
    window.removeEventListener('scroll', this.handleOnScroll);
  }
  handleOnScroll = () => {
    const { docsWithBoxLink } = this.props.campaignStore;
    docsWithBoxLink.map((item, index) => {
      if (document.getElementById(`doc-${index}`).getBoundingClientRect().top < 100 &&
      document.getElementById(item).getBoundingClientRect().top > 0) {
        this.props.navStore.setFieldValue('currentActiveHash', `#doc-${index}`);
      }
      return null;
    });
  }
  module = name => DataFormatter.upperCamelCase(name);
  render() {
    const { docsWithBoxLink, dataRoomDocs } = this.props.campaignStore;
    if (!dataRoomDocs.length) {
      return <InlineLoader text="No Documents to Display" className="bg-offwhite" />;
    }
    if (!docsWithBoxLink.length) {
      return <InlineLoader />;
    }
    return (
      <div className="campaign-content-wrapper">
        <Header as="h3" className="mb-30">Data Rooms</Header>
        {docsWithBoxLink && docsWithBoxLink.map((item, index) => (
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
