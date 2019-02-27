import React, { Component } from 'react';
import Aux from 'react-aux';
import { get } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import { Icon, Popup, Table, Header, Button } from 'semantic-ui-react';
import Helper from '../../../../../../helper/utility';
import { CAMPAIGN_KEYTERMS_SECURITIES, CAMPAIGN_KEYTERMS_SECURITIES_ENUM, CAMPAIGN_KEYTERMS_REGULATION } from '../../../../../../constants/offering';

const isTablet = document.documentElement.clientWidth < 991;

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
    const { offerStructure } = this.props.campaignStore;
    const maturityMonth = campaign && campaign.keyTerms && campaign.keyTerms.maturity ? `${campaign.keyTerms.maturity} Months` : '[XX] Months';
    const maturityStartupPeriod = campaign && campaign.keyTerms && campaign.keyTerms.startupPeriod ? ` including a ${campaign.keyTerms.startupPeriod} month startup period for ramp up` : '';
    return (
      <Aux>
        <Header as="h3" className="mb-30 anchor-wrap">
          Investment Highlights
          <span className="anchor" id="investment-highlights" />
        </Header>
        <Table basic="very" className="key-terms-table neutral-text">
          <Table.Body>
            <Table.Row verticalAlign="top">
              <Table.Cell><b>Issuer</b>
              </Table.Cell>
              <Table.Cell className="grey-header">
                {get(campaign, 'keyTerms.legalBusinessName') ?
                  get(campaign, 'keyTerms.legalBusinessName') : '-'}
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell><b>Type of Offering</b>
              </Table.Cell>
              <Table.Cell className="grey-header">
                {get(campaign, 'regulation') ?
                  CAMPAIGN_KEYTERMS_REGULATION[campaign.regulation] : '-'}
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell><b>Type of Securities</b></Table.Cell>
              <Table.Cell className="grey-header">
                {offerStructure ?
                  CAMPAIGN_KEYTERMS_SECURITIES[offerStructure]
                  :
                '-'}
              </Table.Cell>
            </Table.Row>
            {offerStructure === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.TERM_NOTE &&
            <Aux>
              <Table.Row verticalAlign="top">
                <Table.Cell width={5} className="neutral-text"><b>Interest Rate{' '}</b>
                  <Popup
                    trigger={<Icon name="help circle" color="green" />}
                    content="Interest payment is calculated at a gross annualized interest rate of 16.0% each month on the remaining balance of your investment from the prior month."
                    position="top center"
                  />
                </Table.Cell>
                <Table.Cell>
                  {get(campaign, 'keyTerms.interestRate') ?
                      `${get(campaign, 'keyTerms.interestRate')}%`
                    :
                    'NA'
                }
                </Table.Cell>
              </Table.Row>
            </Aux>
      }
            {offerStructure === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.REVENUE_SHARING_NOTE &&
            <Aux>
              <Table.Row verticalAlign="top">
                <Table.Cell><b>Multiple</b>{' '}
                  <Popup
                    hoverable
                    trigger={<Icon name="help circle" color="green" />}
                    content={(<span>The business will pay you a percent of its gross revenues until a multiple of your investment is paid back to you. See the <Link to={`${this.props.refLink}/investment-details`}>Key Terms</Link> for more details.</span>)}
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
                    content={(<span>To learn more about how Revenue Sharing works, check out the <Link to="/resources/education-center">Education Center</Link>.</span>)}
                    position="top center"
                  />
                </Table.Cell>
                <Table.Cell className="grey-header" >
                  {campaign && campaign.keyTerms && campaign.keyTerms.revSharePercentage ? campaign.keyTerms.revSharePercentage : '-'}
                </Table.Cell>
              </Table.Row>
            </Aux>
        }
            {offerStructure !== CAMPAIGN_KEYTERMS_SECURITIES_ENUM.PREFERRED_EQUITY_506C ?
              <Table.Row verticalAlign="top">
                <Table.Cell width={5}><b>Maturity</b>{' '}
                  <Popup
                    trigger={<Icon name="help circle" color="green" />}
                    content={`If the investors have not been paid in full within ${maturityMonth}, the Issuer is required to promptly pay the entire outstanding balance to the investors.`}
                    position="top center"
                  />
                </Table.Cell>
                <Table.Cell className="grey-header">
                  {maturityMonth ?
                    `${maturityMonth} ${maturityStartupPeriod && maturityStartupPeriod}`
                    :
                    '-'
                  }
                </Table.Cell>
              </Table.Row> :
              <Aux>
                <Table.Row verticalAlign="top">
                  <Table.Cell width={5} className="neutral-text"><b>Total Round Size{' '}</b>
                  </Table.Cell>
                  <Table.Cell>
                    -
                  </Table.Cell>
                </Table.Row>
                <Table.Row verticalAlign="top">
                  <Table.Cell width={5} className="neutral-text"><b>Pre-Money valuation{' '}</b>
                  </Table.Cell>
                  <Table.Cell>
                    <p>
                      {get(campaign, 'keyTerms.premoneyValuation') ? Helper.CurrencyFormat(get(campaign, 'keyTerms.premoneyValuation')) : ' NA'}
                    </p>
                  </Table.Cell>
                </Table.Row>
                <Table.Row verticalAlign="top">
                  <Table.Cell width={5} className="neutral-text"><b>Share Price{' '}</b>
                  </Table.Cell>
                  <Table.Cell>
                    <p>
                      {get(campaign, 'keyTerms.unitPrice') ? Helper.CurrencyFormat(get(campaign, 'keyTerms.unitPrice')) : ' NA'}
                    </p>
                  </Table.Cell>
                </Table.Row>
              </Aux>
            }
          </Table.Body>
        </Table>
        <Button fluid={isTablet} onClick={this.handleViewInvestmentDetails} basic compact className="highlight-text mt-40">
          View Investment Details
          <Icon size="small" className="ns-chevron-right right" color="white" />
        </Button>
      </Aux>
    );
  }
}

export default KeyTerms;
