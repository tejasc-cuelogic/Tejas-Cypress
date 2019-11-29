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
                {['FAILED', 'LIVE', 'COMPLETE'].includes(campaign.stage)
                  ? (
                    <>
                      <dt>Launch Date</dt>
                      <dd> {get(campaign, 'closureSummary.launchDate') ? <DateTimeFormat isCSTFormat datetime={DataFormatter.getDateAsPerTimeZone(get(campaign, 'closureSummary.launchDate'), true, false, false)} /> : get(campaign, 'offering.launch.targetDate') ? <DateTimeFormat isCSTFormat datetime={DataFormatter.getDateAsPerTimeZone(get(campaign, 'offering.launch.targetDate'), true, false, false)} /> : '--'} </dd>
                    </>
                  )
                  : (
                    <>
                      <dt>Started on</dt>
                      <dd> {campaign.created ? <DateTimeFormat isCSTFormat datetime={DataFormatter.getDateAsPerTimeZone(campaign.created.date, true, false, false)} /> : '--'} </dd>
                    </>
                  )
                }
                {campaign.stage === 'CREATION'
                  ? (
                    <>
                      {get(campaign, 'offering.launch.targetDate')
                        && (
                          <>
                            <dt>Target Launch Date</dt>
                            <dd>{get(campaign, 'offering.launch.targetDate') || '--'}</dd>
                          </>
                        )
                      }
                    </>
                  ) : (
                    <>
                      <dt>Close Date</dt>
                      <dd>
                        {campaign.stage === 'LIVE'
                          ? get(campaign, 'closureSummary.processingDate')
                            ? <DateTimeFormat isCSTFormat datetime={DataFormatter.getDateAsPerTimeZone(get(campaign, 'closureSummary.processingDate'), true, false, false)} />
                            : get(campaign, 'offering.launch.terminationDate')
                              ? <DateTimeFormat isCSTFormat datetime={DataFormatter.getDateAsPerTimeZone(get(campaign, 'offering.launch.terminationDate'), true, false, false)} />
                              : ['FAILED', 'COMPLETE'].includes(campaign.stage) && get(campaign, 'closureSummary.hardCloseDate')
                                ? <DateTimeFormat isCSTFormat datetime={DataFormatter.getDateAsPerTimeZone(get(campaign, 'closureSummary.hardCloseDate'), true, false, false)} />
                                : '--' : '--'
                        }
                      </dd>
                    </>
                  )
                }
              </dl>
              <Button inverted color="green" as={Link} to={`/offerings/${campaign.offeringSlug}`}>View Campaign</Button>
              {['CREATION', 'STARTUP_PERIOD', 'LIVE', 'COMPLETE'].includes(campaign.stage)
              && <Button inverted color="green" as={Link} to={`/app/offering/${campaign.id}/overview`}>Manage</Button>
              }
            </Card.Content>
          </Card>
        ))
        }
      </Card.Group>
    </>
  );
};

export default inject('offeringsStore', 'businessAppStore')(withRouter(observer(CampaignCards)));
