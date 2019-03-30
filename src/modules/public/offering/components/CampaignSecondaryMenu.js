import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Container, Button, Visibility, List } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import { DataFormatter } from '../../../../helper';
import Helper from '../../../../helper/utility';

const isMobile = document.documentElement.clientWidth < 991;

@inject('campaignStore', 'navStore')
@withRouter
@observer
export default class CampaignSecondaryMenu extends Component {
  handleUpdate = (e, { calculations }) => {
    this.props.navStore.setNavStatus(calculations);
  }
  handleInvestNowClick = () => {
    this.props.campaignStore.setFieldValue('isInvestBtnClicked', true);
    this.props.history.push(`${this.props.match.url}/invest-now`);
  }
  render() {
    const { campaign } = this.props.campaignStore;
    const processingDate = campaign && campaign.closureSummary
    && campaign.closureSummary.processingDate;
    const diff = DataFormatter.diffDays(processingDate);
    const diffForProcessing = DataFormatter.diffDays(processingDate, false, true);
    const isInProcessing = diffForProcessing === 0 && !get(campaign, 'closureSummary.hardCloseDate');
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
                  {!isClosed && diff > 0 &&
                    <List.Item>{diff} days left</List.Item>
                  }
                  {isClosed && get(campaign, 'closureSummary.repayment.count') ?
                    <List.Item>{get(campaign, 'closureSummary.repayment.count')} Payments made</List.Item> :
                    (get(campaign, 'closureSummary.hardCloseDate') && get(campaign, 'closureSummary.repayment.count') === 0) ? <List.Item><b>Funded</b></List.Item> : ''
                  }
                </Aux>
            }
              {(!isClosed && diffForProcessing >= 0) &&
                <Button compact primary={!isInProcessing} content={`${isInProcessing ? 'Processing' : maxFlagStatus ? 'Fully Reserved' : 'Invest Now'}`} disabled={maxFlagStatus || isInProcessing} onClick={this.handleInvestNowClick} />
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
              {!isMobile && (get(campaign, 'keyTerms.interestRate') || get(campaign, 'keyTerms.investmentMultiple')) &&
              <List.Item>{get(campaign, 'keyTerms.securities') === 'TERM_NOTE' ? `${get(campaign, 'keyTerms.interestRate') || ''}% Interest Rate` : `Up to ${get(campaign, 'keyTerms.investmentMultiple') || ''}x Investment Multiple`}</List.Item>
            }
            </List>
          </Container>
        </div>
      </Visibility>
    );
  }
}
