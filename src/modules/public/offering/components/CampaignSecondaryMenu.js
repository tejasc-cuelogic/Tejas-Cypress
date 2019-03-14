import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Container, Button, Visibility, List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import { DataFormatter } from '../../../../helper';
import Helper from '../../../../helper/utility';

const isMobile = document.documentElement.clientWidth < 991;

@inject('campaignStore', 'navStore')
@observer
export default class CampaignSecondaryMenu extends Component {
  handleUpdate = (e, { calculations }) => {
    this.props.navStore.setNavStatus(calculations);
  }
  render() {
    const { campaign } = this.props.campaignStore;
    const terminationDate = campaign && campaign.offering && campaign.offering.launch
    && campaign.offering.launch.terminationDate;
    const diff = DataFormatter.diffDays(terminationDate);
    const collected = get(campaign, 'closureSummary.totalInvestmentAmount') || 0;
    const maxOffering = get(campaign, 'keyTerms.maxOfferingAmountCF') || 0;
    const { navStatus, subNavStatus } = this.props.navStore;
    const maxFlagStatus = (collected && maxOffering) && collected >= maxOffering;
    const isClosed = campaign.stage !== 'LIVE';
    return (
      <Visibility offset={[72, 10]} onUpdate={this.handleUpdate} continuous className="campaign-secondary-header">
        <div className={`menu-secondary-fixed ${navStatus && navStatus === 'sub' && 'active'} ${subNavStatus}`}>
          <Container fluid={!isMobile}>
            <List size={isMobile && 'tiny'} bulleted={!isMobile} floated="right" horizontal={!isMobile}>
              {!isMobile &&
                <Aux>
                  <List.Item>{get(campaign, 'closureSummary.totalInvestorCount') || 0} Investors</List.Item>
                  {!isClosed &&
                    <List.Item>{diff} days left</List.Item>
                  }
                  {isClosed && get(campaign, 'closureSummary.repayment.count') &&
                    <List.Item>{get(campaign, 'closureSummary.repayment.count')} Payments made</List.Item>
                  }
                </Aux>
            }
              {!isClosed &&
                <Button compact primary content={`${maxFlagStatus ? 'Fully Reserved' : 'Invest Now'}`} disabled={maxFlagStatus} as={Link} to={`${this.props.match.url}/invest-now`} />
              }
            </List>
            <List size={isMobile && 'tiny'} bulleted={!isMobile} horizontal={!isMobile}>
              <List.Item>
                <List.Header>{get(campaign, 'keyTerms.shorthandBusinessName')}</List.Header>
              </List.Item>
              <List.Item>
                <List.Header>
                  <span className="highlight-text">{Helper.CurrencyFormat(collected)}</span>
                  {!isClosed && (get(campaign, 'keyTerms.securities') === 'TERM_NOTE' || maxFlagStatus || get(campaign, 'stage') === 'LIVE' || get(campaign, 'stage') === 'PROCESSING' || get(campaign, 'stage') === 'LOCK') ? ' raised' : ' invested'}
                </List.Header>
              </List.Item>
              {!isMobile &&
              <List.Item>{!isClosed && get(campaign, 'keyTerms.securities') === 'TERM_NOTE' ? `${get(campaign, 'keyTerms.interestRate')}% Interest Rate` : `${get(campaign, 'keyTerms.investmentMultiple')}x Investment Multiple`}</List.Item>
            }
            </List>
          </Container>
        </div>
      </Visibility>
    );
  }
}
