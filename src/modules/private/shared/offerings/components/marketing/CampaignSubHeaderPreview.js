import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Container, Button, Visibility, List } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import Helper from '../../../../../../helper/utility';
import { DataFormatter } from '../../../../../../helper';

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
      isClosed, isInProcessing, maxFlagStatus,
      investmentSummary,
      // countDown, diffForProcessing
    } = campaignStatus;
    const subHeaderBasicFields = SUB_HEADER_BASIC_FRM.fields;
    const toggleMeta = subHeaderBasicFields.toggleMeta.value;
    const showInvestorCount = toggleMeta.includes('INVESTOR_COUNT');
    const showDaysLeft = toggleMeta.includes('DAYS_LEFT');
    const showRaisedAmount = toggleMeta.includes('RAISED_AMOUNT');
    const showRepaymentMade = toggleMeta.includes('REPAYMENT_COUNT');
    const subHeaderMeta = TOMBSTONE_HEADER_META_FRM.fields.meta;
    const diffForProcessingText = DataFormatter.getDateDifferenceInHoursOrMinutes(subHeaderBasicFields.closeDate.value, true, true);
    const diff = DataFormatter.diffDays(subHeaderBasicFields.closeDate.value || null, false, true);
    const countDown = (['Minute Left', 'Minutes Left'].includes(diffForProcessingText.label) && diffForProcessingText.value > 0) || diffForProcessingText.value <= 48 ? { valueToShow: diffForProcessingText.value, labelToShow: diffForProcessingText.label } : { valueToShow: diff, labelToShow: diff === 1 ? 'Day Left' : 'Days Left' };
    return (
      <Visibility offset={[72, 10]} continuous className="campaign-secondary-header menu-secondary-fixed bg-offwhite pt-0 pb-0 plr-0">
        <div className="active">
          <Container fluid={!isMobile}>
            <List size={isMobile && 'tiny'} bulleted={!isMobile} floated="right" horizontal={!isMobile}>
              {!isMobile
                && (
                  <>
                    {showInvestorCount && <List.Item>{subHeaderBasicFields.investorCount.value || 0} Investors</List.Item>}
                    {(showDaysLeft)
                      && <List.Item>{countDown.valueToShow || 'X'} {' '} {countDown.labelToShow || 'Days Left'}</List.Item>
                    }
                    {showRepaymentMade
                      && <List.Item>{subHeaderBasicFields.repaymentCount.value || 0} Payments made</List.Item>
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
                  <span className="highlight-text">{subHeaderBasicFields.raisedAmount.value || '$ 0'}</span>
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
