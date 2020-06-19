import React, { Component } from 'react';
import { get, capitalize } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import { Icon, Popup, Table, Header, Button } from 'semantic-ui-react';
import { CAMPAIGN_KEYTERMS_SECURITIES, CAMPAIGN_OFFERED_BY, CAMPAIGN_REGULATION_DETAILED } from '../../../../../../constants/offering';

const isMobile = document.documentElement.clientWidth < 768;
const isTablet = document.documentElement.clientWidth < 992;

@withRouter
@inject('campaignStore')
@observer
class KeyTerms extends Component {
  handleViewInvestmentDetails = (e) => {
    e.preventDefault();
    this.props.history.push(`${this.props.refLink}/investment-details`);
  }

  render() {
    const { campaign } = this.props;
    const { offerStructure, campaignStatus } = this.props.campaignStore;
    const maturityMonth = campaign && campaign.keyTerms && campaign.keyTerms.maturity ? `${campaign.keyTerms.maturity} months` : 'N/A';
    const maturityStartupPeriod = campaign && campaign.keyTerms && campaign.keyTerms.startupPeriod ? `, including a ${campaign.keyTerms.startupPeriod}-month startup period for ramp up` : '';
    return (
      <>
        <Header as="h3" className={`${isMobile ? 'mb-10' : 'mb-30'} anchor-wrap`}>
          Investment Highlights
          <span className="anchor" id="investment-highlights" />
        </Header>
        <Table basic className="key-terms-table neutral-text">
          <Table.Body>
            <Table.Row verticalAlign="top">
              <Table.Cell><b>Issuer</b>
              </Table.Cell>
              <Table.Cell className="grey-header">
                {get(campaign, 'keyTerms.legalBusinessName')
                  ? get(campaign, 'keyTerms.legalBusinessName') : '-'}
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell><b>Type of Offering {' '}</b>
                { get(campaign, 'regulation')
                  && CAMPAIGN_REGULATION_DETAILED.TOOLTIP[campaign.regulation]
                  ? (
                  <Popup
                    trigger={<Icon name="help circle" color="green" />}
                    content={
                        CAMPAIGN_REGULATION_DETAILED.TOOLTIP[campaign.regulation]
                      }
                    hoverable
                    position="top center"
                  />
                  ) : ''
                }
              </Table.Cell>
              <Table.Cell className="grey-header">
                {get(campaign, 'regulation')
                  ? CAMPAIGN_REGULATION_DETAILED.REGULATION[campaign.regulation] : '-'}
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell><b>Type of Securities</b></Table.Cell>
              <Table.Cell className="grey-header">
                {offerStructure
                  ? CAMPAIGN_KEYTERMS_SECURITIES[offerStructure]
                  : '-'}
              </Table.Cell>
            </Table.Row>
            {campaignStatus.isTermNote
            && (
            <>
              <Table.Row verticalAlign="top">
                <Table.Cell width={5} className="neutral-text"><b>Interest Rate{' '}</b>
                  <Popup
                    trigger={<Icon name="help circle" color="green" />}
                    content={campaignStatus.isTermNote
                      ? (<>This is the gross annualized interest rate used to calculate monthly payments to investors. <a target="_blank" href="/resources/education-center/investor/how-term-notes-work">Learn more</a></>)
                      : campaignStatus.isConvertibleNotes ? (<>This is the gross annualized interest rate used to calculate monthly payments to investors.</>) : ''}
                    position="top center"
                  />
                </Table.Cell>
                <Table.Cell>
                  {campaign && campaign.keyTerms && campaign.keyTerms.interestRate
                    ? `${campaign.keyTerms.interestRate}%`
                    : 'NA'
                }
                </Table.Cell>
              </Table.Row>
            </>
            )
            }
            {campaignStatus.isRevenueShare
            && (
            <>
              <Table.Row verticalAlign="top">
                <Table.Cell><b>Multiple</b>{' '}
                  <Popup
                    hoverable
                    trigger={<Icon name="help circle" color="green" />}
                    content={(<span>The business will pay you a percent of its gross revenues until a multiple of your investment is paid back to you. See the <Link to={`${this.props.refLink}/investment-details/#key-terms`}>Key Terms</Link> for more details.</span>)}
                    position="top center"
                  />
                </Table.Cell>
                <Table.Cell className="grey-header">
                  {campaign && campaign.keyTerms && campaign.keyTerms.investmentMultiple ? campaign.keyTerms.investmentMultiple : '-'}
                </Table.Cell>
              </Table.Row>
              <Table.Row verticalAlign="top">
                <Table.Cell collapsing><b>Revenue Sharing Percentage</b>{' '}
                  <Popup
                    hoverable
                    trigger={<Icon name="help circle" color="green" />}
                    content={(<span>To learn more about how Revenue Sharing works, check out the <Link to="/resources/education-center/investor/how-revenue-sharing-notes-work">Education Center</Link>.</span>)}
                    position="top center"
                  />
                </Table.Cell>
                <Table.Cell className="grey-header">
                  {campaign && campaign.keyTerms && campaign.keyTerms.revSharePercentage ? `${get(campaign, 'keyTerms.revSharePercentage')}${get(campaign, 'keyTerms.revSharePercentage').includes('%') ? '' : '%'}` : '-'}
                </Table.Cell>
              </Table.Row>
            </>
            )
            }
            {!campaignStatus.isPreferredEquity
              ? (
              <Table.Row verticalAlign="top">
                <Table.Cell width={5}><b>Maturity</b>{' '}
                  <Popup
                    trigger={<Icon name="help circle" color="green" />}
                    content={<>This is the deadline by which the issuer is obligated to make payment in full to investors.</>}
                    position="top center"
                  />
                </Table.Cell>
                <Table.Cell className="grey-header">
                  {maturityMonth
                    ? `${maturityMonth} ${maturityStartupPeriod && maturityStartupPeriod}`
                    : '-'
                  }
                </Table.Cell>
              </Table.Row>
              )
              : (
                <>
                {get(campaign, 'keyTerms.priceCopy')
                && (
                <Table.Row verticalAlign="top">
                  <Table.Cell width={5} className="neutral-text"><b>{`${capitalize(get(campaign, 'keyTerms.equityUnitType'))} Price`}{' '}</b>
                  </Table.Cell>
                  <Table.Cell>
                    <p>
                      {get(campaign, 'keyTerms.priceCopy') || ' NA'}
                    </p>
                  </Table.Cell>
                </Table.Row>
                )
                }
                </>
              )}
            <Table.Row verticalAlign="top">
              <Table.Cell><b>Offered By</b></Table.Cell>
              <Table.Cell className="grey-header">
                {campaign && get(campaign, 'regulation')
                  ? CAMPAIGN_OFFERED_BY[get(campaign, 'regulation')]
                  : CAMPAIGN_OFFERED_BY[get(campaign, 'keyTerms.regulation')]}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <Button fluid={isTablet} onClick={this.handleViewInvestmentDetails} basic compact className="highlight-text mt-40">
          View Investment Details
          <Icon size="small" className="ns-chevron-right right" color="white" />
        </Button>
      </>
    );
  }
}

export default KeyTerms;
