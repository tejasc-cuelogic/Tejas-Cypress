import React from 'react';
import { Header, Card, Icon, Button } from 'semantic-ui-react';
import { get } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import { CAMPAIGN_OFFERING_STAGE } from '../../../../../../constants/offering';
import { DateTimeFormat } from '../../../../../../theme/shared';
import { DataFormatter } from '../../../../../../helper';

const { clientWidth } = document.documentElement;
const isTablet = clientWidth >= 768 && clientWidth < 1300;
const isMobile = clientWidth < 768;

const CampaignCards = (props) => {
  const { offeringsStore, businessAppStore } = props;
  const handleHeaderClick = id => props.history.push(`/app/offering/${id}/overview`);
  const getCampaignName = b => (get(b, 'keyTerms.shorthandBusinessName') || get(b, 'keyTerms.legalBusinessName') || 'N/A');
  if (!offeringsStore.offerings.length || businessAppStore.businessApplicationsList.loading) {
    return (null);
  }
  return (
    <>
      <Header as="h3" className={isMobile ? 'mb-30' : ''}>Campaigns</Header>
      <Card.Group stackable itemsPerRow={isTablet ? '2' : '3'} className="application-cards">
        {offeringsStore.offerings.map(campaign => (
          <Card fluid key={campaign.id}>
            <Card.Content style={{ cursor: 'pointer' }} onClick={() => handleHeaderClick(campaign.id)}>
            <Header as="h4">
              <Icon color="green" name="ns-reload-circle-line" />
            {getCampaignName(campaign)}</Header>
            </Card.Content>
            <Card.Content>
            <dl className="dl-horizontal">
              <dt>Campaign status</dt>
              <dd>{CAMPAIGN_OFFERING_STAGE[campaign.stage]}</dd>
              <dt>Started on</dt>
              <dd> {campaign.created ? <DateTimeFormat isCSTFormat datetime={DataFormatter.getDateAsPerTimeZone(campaign.created.date, true, false, false)} /> : '--'} </dd>
              {campaign.stage === 'CREATION'
                ? (
                <>
                  {get(campaign, 'closureSummary.launchDate')
                  && (
                  <>
                    <dt>Target Launch Date</dt>
                  <dd>{get(campaign, 'closureSummary.launchDate') || '--'}</dd>
                  </>
                  )
                  }
                </>
                ) : (
                <>
                <dt>Offering Close Date</dt>
                <dd>{get(campaign, 'closureSummary.hardCloseDate') || get(campaign, 'closureSummary.launchDate') || '--'}</dd>
                </>
                )
              }
            </dl>
            <Button inverted color="green" as={Link} to={`/offerings/${campaign.offeringSlug}`}>View Campaign</Button>
            </Card.Content>
          </Card>
        ))
        }
      </Card.Group>
    </>
  );
};

export default inject('offeringsStore', 'businessAppStore')(withRouter(observer(CampaignCards)));
