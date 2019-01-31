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
    const maxOffering = campaign && campaign.keyTerms &&
    campaign.keyTerms.minOfferingAmount ? campaign.keyTerms.maxOfferingAmount : 0;
    const { navStatus, subNavStatus } = this.props.navStore;
    const maxFlagStatus = (collected && maxOffering) && collected >= maxOffering;
    const isClosed = campaign.stage !== 'LIVE';
    return (
      <Visibility offset={[58, 10]} onUpdate={this.handleUpdate} continuous className="campaign-secondary-header">
        <div className={`menu-secondary-fixed ${navStatus && navStatus === 'sub' && 'active'} ${subNavStatus}`}>
          <Container fluid={!isMobile}>
            <List size={isMobile && 'tiny'} bulleted={!isMobile} floated="right" horizontal={!isMobile}>
              {!isMobile &&
                <Aux>
                  <List.Item>{get(campaign, 'closureSummary.totalInvestorCount') || 0} Investors</List.Item>
                  <List.Item>{diff} days left</List.Item>
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
                <List.Header><span className="highlight-text">{Helper.CurrencyFormat(collected)}</span> raised</List.Header>
              </List.Item>
              {!isMobile &&
              <List.Item>{get(campaign, 'keyTerms.investmentMultiple')} Investment Multiple</List.Item>
            }
            </List>
          </Container>
        </div>
      </Visibility>
    );
  }
}