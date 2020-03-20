import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Container, Button, Visibility, List } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import Helper from '../../../../helper/utility';

const isMobile = document.documentElement.clientWidth < 992;

@inject('campaignStore', 'navStore', 'accreditationStore')
@withRouter
@observer
export default class CampaignSecondaryMenu extends Component {
  handleUpdate = (e, { calculations }) => {
    this.props.navStore.setNavStatus(calculations, false, true);
  }

  handleInvestNowClick = () => {
    this.props.accreditationStore.setFieldVal('disabeleElement', false);
    this.props.campaignStore.setFieldValue('isInvestBtnClicked', true);
    this.props.history.push(`${this.props.match.url}/invest-now`);
  }

  render() {
    const { campaign, campaignStatus } = this.props.campaignStore;
    const {
      isClosed, isInProcessing, collected, maxFlagStatus,
      countDown, diffForProcessing, investmentSummary,
    } = campaignStatus;
    const { navStatus, subNavStatus } = this.props.navStore;
    const { newLayout } = this.props;
    const isTemplate2 = campaignStatus.campaignTemplate === 2;
    const toggleMeta = get(campaign, 'subHeader.toggleMeta') || [];
    const showInvestorCount = (isTemplate2 && toggleMeta.includes('INVESTOR_COUNT'));
    const showDaysLeft = (isTemplate2 && toggleMeta.includes('DAYS_LEFT'));
    const showRaisedAmount = ((isTemplate2 && toggleMeta.includes('RAISED_AMOUNT')) || !isTemplate2);
    return (
      <Visibility offset={[72, 10]} onUpdate={this.handleUpdate} continuous className="campaign-secondary-header">
        <div className={`menu-secondary-fixed ${navStatus && navStatus === 'sub' && 'active'} ${subNavStatus} ${newLayout && isMobile ? 'campaign-secondary-menu-v2' : ''}`}>
          <Container fluid={!isMobile}>
            <List size={isMobile && 'tiny'} bulleted={!isMobile} floated="right" horizontal={!isMobile}>
              {!isMobile
                && (
                  <>
                    {(showInvestorCount || (!isTemplate2 && !campaignStatus.isFund)) && <List.Item>{get(campaign, 'closureSummary.totalInvestorCount') || 0} Investors</List.Item>}
                    {((showDaysLeft || !isClosed) && diffForProcessing.value > 0)
                      && <List.Item>{countDown.valueToShow} {' '} {countDown.labelToShow}</List.Item>
                    }
                    {isClosed && get(campaign, 'closureSummary.repayment.count')
                      ? <List.Item>{get(campaign, 'closureSummary.repayment.count')} Payments made</List.Item>
                      : (get(campaign, 'closureSummary.hardCloseDate') && get(campaign, 'closureSummary.hardCloseDate') !== 'Invalid date' && get(campaign, 'closureSummary.repayment.count') === 0) ? <List.Item><b>Funded</b></List.Item> : ''
                    }
                  </>
                )
              }
              {!isClosed && (!get(investmentSummary, 'isInvestedInOffering') || (get(investmentSummary, 'isInvestedInOffering') && (!get(investmentSummary, 'tranche') || get(investmentSummary, 'tranche') < 1)))
                && <Button compact primary={!isInProcessing} content={`${isInProcessing ? 'Processing' : maxFlagStatus ? 'Fully Reserved' : get(investmentSummary, 'isInvestedInOffering') ? 'Change Investment' : 'Invest Now'}`} disabled={maxFlagStatus || isInProcessing} onClick={this.handleInvestNowClick} />
              }
            </List>
            <List size={isMobile && 'tiny'} bulleted={!isMobile} horizontal={!isMobile}>
              <List.Item>
                <List.Header>{get(campaign, 'keyTerms.shorthandBusinessName')}</List.Header>
              </List.Item>
              {showRaisedAmount
              && (
              <List.Item>
                <List.Header>
                  <span className="highlight-text">{Helper.CurrencyFormat(collected, 0)}</span>
                  {!isClosed && (campaignStatus.isTermNote || maxFlagStatus || get(campaign, 'stage') === 'LIVE' || get(campaign, 'stage') === 'PROCESSING' || get(campaign, 'stage') === 'LOCK') ? ' raised' : ' invested'}
                </List.Header>
              </List.Item>
              )}
              {!isTemplate2 && !isMobile && !campaignStatus.isFund
                && <List.Item>{campaignStatus.isRealEstate ? 'Commercial Real Estate' : campaignStatus.isSafe ? `${get(campaign, 'keyTerms.valuationCap') || ''} Valuation Cap` : campaignStatus.isTermNote ? `${get(campaign, 'keyTerms.interestRate') || ''}% Interest Rate` : campaignStatus.isPreferredEquity ? `${get(campaign, 'keyTerms.premoneyValuation') ? Helper.CurrencyFormat(get(campaign, 'keyTerms.premoneyValuation'), 0) : ''} Pre-Money Valuation` : `${get(campaign, 'keyTerms.investmentMultiple') || ''} Investment Multiple`}</List.Item>
              }
              {isTemplate2 && get(campaign, 'subHeader.meta[0]') && get(campaign, 'subHeader.meta').map(row => (
                <List.Item>
                  {row.keyLabel ? `${row.keyLabel}:` : ''} {row.keyType === 'custom' ? row.keyValue : Helper.formatValue(row.keyFormat, Helper.enumToText(row.keyValue, get(campaign, row.keyValue)))}
                </List.Item>
              ))
              }
            </List>
          </Container>
        </div>
      </Visibility>
    );
  }
}
