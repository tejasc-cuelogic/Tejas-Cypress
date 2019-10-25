import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Container, Button, Visibility, List } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import Helper from '../../../../helper/utility';

const isMobile = document.documentElement.clientWidth < 992;

@inject('campaignStore', 'navStore')
@withRouter
@observer
export default class CampaignSecondaryMenu extends Component {
  handleUpdate = (e, { calculations }) => {
    this.props.navStore.setNavStatus(calculations, false, true);
  }

  handleInvestNowClick = () => {
    this.props.campaignStore.setFieldValue('isInvestBtnClicked', true);
    this.props.history.push(`${this.props.match.url}/invest-now`);
  }

  render() {
    const { campaign, campaignStatus } = this.props.campaignStore;
    const {
      isClosed, isInProcessing, collected, maxFlagStatus,
      countDown, diffForProcessing,
    } = campaignStatus;
    const { navStatus, subNavStatus } = this.props.navStore;
    const { newLayout } = this.props;
    return (
      <Visibility offset={[72, 10]} onUpdate={this.handleUpdate} continuous className="campaign-secondary-header">
        <div className={`menu-secondary-fixed ${navStatus && navStatus === 'sub' && 'active'} ${subNavStatus} ${newLayout && isMobile ? 'campaign-secondary-menu-v2' : ''}`}>
          <Container fluid={!isMobile}>
            <List size={isMobile && 'tiny'} bulleted={!isMobile} floated="right" horizontal={!isMobile}>
              {!isMobile
                && (
<>
                  <List.Item>{get(campaign, 'closureSummary.totalInvestorCount') || 0} Investors</List.Item>
                  {!isClosed && diffForProcessing.value > 0
                    && <List.Item>{countDown.valueToShow} {' '} {countDown.labelToShow}</List.Item>
                  }
                  {isClosed && get(campaign, 'closureSummary.repayment.count')
                    ? <List.Item>{get(campaign, 'closureSummary.repayment.count')} Payments made</List.Item>
                    : (get(campaign, 'closureSummary.hardCloseDate') && get(campaign, 'closureSummary.hardCloseDate') !== 'Invalid date' && get(campaign, 'closureSummary.repayment.count') === 0) ? <List.Item><b>Funded</b></List.Item> : ''
                  }
                </>
                )
            }
              {!isClosed
                && <Button compact primary={!isInProcessing} content={`${isInProcessing ? 'Processing' : maxFlagStatus ? 'Fully Reserved' : 'Invest Now'}`} disabled={maxFlagStatus || isInProcessing} onClick={this.handleInvestNowClick} />
              }
            </List>
            <List size={isMobile && 'tiny'} bulleted={!isMobile} horizontal={!isMobile}>
              <List.Item>
                <List.Header>{get(campaign, 'keyTerms.shorthandBusinessName')}</List.Header>
              </List.Item>
              <List.Item>
                <List.Header>
                  <span className="highlight-text">{Helper.CurrencyFormat(collected, 0)}</span>
                  {!isClosed && (get(campaign, 'keyTerms.securities') === 'TERM_NOTE' || maxFlagStatus || get(campaign, 'stage') === 'LIVE' || get(campaign, 'stage') === 'PROCESSING' || get(campaign, 'stage') === 'LOCK') ? ' raised' : ' invested'}
                </List.Header>
              </List.Item>
              {!isMobile && (get(campaign, 'keyTerms.interestRate') || get(campaign, 'keyTerms.investmentMultiple') || get(campaign, 'keyTerms.premoneyValuation'))
              && <List.Item>{get(campaign, 'keyTerms.securities') === 'TERM_NOTE' ? `${get(campaign, 'keyTerms.interestRate') || ''}% Interest Rate` : get(campaign, 'keyTerms.securities') === 'PREFERRED_EQUITY_506C' ? `${get(campaign, 'keyTerms.premoneyValuation') ? Helper.CurrencyFormat(get(campaign, 'keyTerms.premoneyValuation'), 0) : ''} Pre-Money Valuation` : `${get(campaign, 'keyTerms.investmentMultiple') || ''} Investment Multiple`}</List.Item>
            }
            </List>
          </Container>
        </div>
      </Visibility>
    );
  }
}
