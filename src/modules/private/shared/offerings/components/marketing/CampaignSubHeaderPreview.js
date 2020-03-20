import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Container, Button, Visibility, List } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import Helper from '../../../../../../helper/utility';

const isMobile = document.documentElement.clientWidth < 992;

@inject('offeringsStore', 'manageOfferingStore')
@withRouter
@observer
export default class CampaignSubHeaderPreview extends Component {
  render() {
    const { manageOfferingStore, offeringsStore } = this.props;
    const { offer } = offeringsStore;
    const { SUB_HEADER_BASIC_FRM, TOMBSTONE_HEADER_META_FRM, campaignStatus } = manageOfferingStore;
    const {
      isClosed, isInProcessing, collected, maxFlagStatus,
      countDown, diffForProcessing, investmentSummary,
    } = campaignStatus;
    const toggleMeta = SUB_HEADER_BASIC_FRM.fields.toggleMeta.value;
    const showInvestorCount = toggleMeta.includes('INVESTOR_COUNT');
    const showDaysLeft = toggleMeta.includes('DAYS_LEFT');
    const showRaisedAmount = toggleMeta.includes('RAISED_AMOUNT');
    const subHeaderMeta = TOMBSTONE_HEADER_META_FRM.fields.meta;
    return (
      <Visibility offset={[72, 10]} continuous className="campaign-secondary-header">
        <div className="active">
          <Container fluid={!isMobile}>
            <List size={isMobile && 'tiny'} bulleted={!isMobile} floated="right" horizontal={!isMobile}>
              {!isMobile
                && (
                  <>
                    {showInvestorCount && <List.Item>{get(offer, 'closureSummary.totalInvestorCount') || 0} Investors</List.Item>}
                    {(showDaysLeft && diffForProcessing.value > 0)
                      && <List.Item>{countDown.valueToShow} {' '} {countDown.labelToShow}</List.Item>
                    }
                    {isClosed && get(offer, 'closureSummary.repayment.count')
                      ? <List.Item>{get(offer, 'closureSummary.repayment.count')} Payments made</List.Item>
                      : (get(offer, 'closureSummary.hardCloseDate') && get(offer, 'closureSummary.hardCloseDate') !== 'Invalid date' && get(offer, 'closureSummary.repayment.count') === 0) ? <List.Item><b>Funded</b></List.Item> : ''
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
                <List.Header>{get(offer, 'keyTerms.shorthandBusinessName')}</List.Header>
              </List.Item>
              {showRaisedAmount
              && (
              <List.Item>
                <List.Header>
                  <span className="highlight-text">{Helper.CurrencyFormat(collected, 0)}</span>
                  {!isClosed && (campaignStatus.isTermNote || maxFlagStatus || get(offer, 'stage') === 'LIVE' || get(offer, 'stage') === 'PROCESSING' || get(offer, 'stage') === 'LOCK') ? ' raised' : ' invested'}
                </List.Header>
              </List.Item>
              )}
              {subHeaderMeta.map(row => (
                <List.Item>
                  {row.keyLabel.value ? `${row.keyLabel.value}:` : ''} {row.keyType.value === 'custom' ? row.keyValue.value : Helper.formatValue(row.keyFormat.value, Helper.enumToText(row.keyValue.value, get(offer, row.keyValue.value), true))}
                </List.Item>
              ))}
            </List>
          </Container>
        </div>
      </Visibility>
    );
  }
}
