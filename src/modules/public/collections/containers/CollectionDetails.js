import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { find, get, filter } from 'lodash';
import { withRouter } from 'react-router-dom';
import { Header, Divider, Container } from 'semantic-ui-react';
import CollectionHeader from '../components/CollectionHeader';
import CollectionInsights from '../components/CollectionInsights';
import CustomContent from '../../offering/components/campaignDetails/CustomContent';
import CampaignList from '../../offering/components/listing/CampaignList';
import { InlineLoader } from '../../../../theme/shared';

@inject('collectionStore', 'uiStore', 'nsUiStore')
@withRouter
@observer
class CollectionDetails extends Component {
  componentDidMount() {
    const { slug } = this.props.match.params;
    this.props.collectionStore.getCollection(slug);
  }

  render() {
    const { collectionStore, uiStore, nsUiStore } = this.props;
    const { loadingArray } = nsUiStore;
    const { collectionDetails, getInsightsList, getPastOfferingsList, getActiveOfferingsList } = collectionStore;
    const { responsiveVars } = uiStore;
    const { isTablet, isMobile } = responsiveVars;
    const collectionHeader = find((get(collectionDetails, 'marketing.content') || []), c => c.contentType === 'HEADER');
    const activeInvestment = find((get(collectionDetails, 'marketing.content') || []), c => c.contentType === 'ACTIVE_INVESTMENTS');
    const completedInvestment = find((get(collectionDetails, 'marketing.content') || []), c => c.contentType === 'COMPLETE_INVESTMENTS');
    const collectionInsight = find((get(collectionDetails, 'marketing.content') || []), c => c.contentType === 'INSIGHTS');
    const customContent = filter((get(collectionDetails, 'marketing.content') || []), c => c.contentType === 'CUSTOM');
    if (loadingArray.includes('getCollection')) {
      return <InlineLoader />;
    }
    return (
      <>
        <CollectionHeader data={collectionHeader} />
        <div className="ui container">
          {customContent.map(c => <CustomContent title={c.title} content={c.customValue} isTablet={isTablet} />)}
        </div>
        <CampaignList
          refLink={this.props.match.url}
          loading={loadingArray.includes('getCollectionMapping')}
          campaigns={getActiveOfferingsList}
          heading={get(activeInvestment, 'title') && <Header as="h2" textAlign={isMobile ? '' : 'center'} caption className={isMobile ? 'mb-20 mt-20' : 'mt-50 mb-30'}>{get(activeInvestment, 'title')}</Header>}
        />
        <Divider section hidden />
        <Divider section as={Container} />
        <CampaignList
          refLink={this.props.match.url}
          loading={loadingArray.includes('getCollectionMapping')}
          campaigns={getPastOfferingsList}
          heading={get(completedInvestment, 'title') && <Header as="h2" textAlign={isMobile ? '' : 'center'} caption className={isMobile ? 'mb-20 mt-20' : 'mt-50 mb-30'}>{get(completedInvestment, 'title')}</Header>}
          // subheading={<p className={isMobile ? 'mb-40' : 'center-align mb-80'}>Browse the newest investment opportunities on NextSeed. {!isMobile && <br /> }The next big thing may be inviting you to participate.</p>}
        />
        <Divider section hidden />
        <Divider section as={Container} />
        <CollectionInsights
          heading={get(collectionInsight, 'title') && <Header as="h2" textAlign={isMobile ? '' : 'center'} caption className={isMobile ? 'mb-20 mt-20' : 'mt-50 mb-30'}>{get(collectionInsight, 'title')}</Header>}
          loading={loadingArray.includes('getCollectionMapping')}
          InsightArticles={getInsightsList}
        />
        <Divider section hidden />
      </>
    );
  }
}

export default CollectionDetails;
