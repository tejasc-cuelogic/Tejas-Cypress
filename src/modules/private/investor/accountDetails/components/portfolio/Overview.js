import React, { Component } from 'react';
import Aux from 'react-aux';
import { includes, get } from 'lodash';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import { Header, Table, Grid, Statistic, Button, Divider, Popup, Icon } from 'semantic-ui-react';
import { AccTypeTitle } from '../../../../../../theme/shared';
import { CAMPAIGN_KEYTERMS_SECURITIES, CAMPAIGN_KEYTERMS_SECURITIES_ENUM } from '../../../../../../constants/offering';
import PayOffChart from './PayOffChart';
import HtmlEditor from '../../../../../shared/HtmlEditor';

@inject('portfolioStore', 'campaignStore')
@observer
class Overview extends Component {
  componentWillMount() {
    const accountType = includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity';
    this.props.portfolioStore.getPayOffData(accountType);
  }
  render() {
    const { campaign } = this.props.campaignStore;
    const chartData = this.props.portfolioStore.getChartData();
    const { keyTerms, offering } = campaign;
    const overviewToDisplay = campaign && campaign.keyTerms && campaign.keyTerms.securities &&
      campaign.keyTerms.securities === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.REVENUE_SHARING_NOTE ? 'REVENUE' : 'TERM';
    const isPreviewLinkShow = campaign && campaign.isAvailablePublicly;
    const edgarLink = get(campaign, 'offering.launch.edgarLink');
    const maturityMonth = campaign && campaign.keyTerms && campaign.keyTerms.maturity ? `${campaign.keyTerms.maturity} Months` : '0 Months';
    const maturityStartupPeriod = campaign && campaign.keyTerms && campaign.keyTerms.startupPeriod ? ` including a ${campaign.keyTerms.startupPeriod} month startup period for ramp up` : '';
    return (
      <Aux>
        <div className="inner-content-spacer bg-offwhite">
          <span className="pull-left">
            <Header as="h5">
              <AccTypeTitle moreText="investment" />
            </Header>
          </span>
          {isPreviewLinkShow &&
            <span className="pull-right">
              <Link target="_blank" to={`/offerings/${campaign.offeringSlug}/overview`} className="pull-right">View offering page</Link>
            </span>
          }
        </div>
        <div className="inner-content-spacer">
          <Grid>
            <Grid.Column width={9}>
              <Header as="h4">Offering Summary</Header>
              <div className="table-wrapper">
                <Table unstackable definition basic="very">
                  <Table.Body>
                    <Table.Row verticalAlign="top">
                      <Table.Cell width={5}>Issuer</Table.Cell>
                      <Table.Cell>
                        {keyTerms && keyTerms.shorthandBusinessName ?
                          keyTerms.shorthandBusinessName
                          :
                          'N/A'
                        }
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row verticalAlign="top">
                      <Table.Cell>Securities</Table.Cell>
                      <Table.Cell>
                        {keyTerms && keyTerms.securities ?
                          CAMPAIGN_KEYTERMS_SECURITIES[keyTerms.securities]
                          :
                          'N/A'
                        }
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row verticalAlign="top">
                      <Table.Cell>{overviewToDisplay && overviewToDisplay === 'REVENUE' ? 'Anticipated Opening' : 'Original Anticipated Opening Date'}</Table.Cell>
                      <Table.Cell>
                        {offering && offering.launch &&
                          offering.launch.targetDate ?
                          moment(offering.launch.targetDate).format('ll')
                          :
                          'N/A'
                        }
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row verticalAlign="top">
                      <Table.Cell>
                        {overviewToDisplay && overviewToDisplay === 'REVENUE' ?
                          'Investment Multiple'
                          :
                          'Interest Rate'
                        }
                      </Table.Cell>
                      {overviewToDisplay && overviewToDisplay === 'REVENUE' ?
                        <Table.Cell>
                          {keyTerms && keyTerms.investmentMultiple ? keyTerms.investmentMultiple : 'N/A'}{' '}
                          <HtmlEditor
                            readOnly
                            content={(keyTerms && keyTerms.investmentMultipleSummary ?
                              keyTerms.investmentMultipleSummary : '')}
                          />
                        </Table.Cell>
                        :
                        <Table.Cell>
                          {keyTerms && keyTerms.interestRate ?
                            `${keyTerms.interestRate}%` : 'N/A'
                          }
                        </Table.Cell>
                      }
                    </Table.Row>
                    <Table.Row verticalAlign="top">
                      <Table.Cell>Payments</Table.Cell>
                      <Table.Cell>
                        {keyTerms && keyTerms.frequencyOfPayments ?
                          keyTerms.frequencyOfPayments : 'N/A'}
                      </Table.Cell>
                    </Table.Row>
                    {overviewToDisplay && overviewToDisplay === 'REVENUE' ?
                      <Table.Row verticalAlign="top">
                        <Table.Cell>Revenue Sharing Percentage</Table.Cell>
                        <Table.Cell>
                          {keyTerms && keyTerms.revSharePercentage ?
                            keyTerms.revSharePercentage.includes('%') ?
                              keyTerms.revSharePercentage : `${keyTerms.revSharePercentage}%`
                            :
                            'N/A'}
                          <HtmlEditor
                            readOnly
                            content={(keyTerms && keyTerms.revShareSummary ?
                              keyTerms.revShareSummary : '')}
                          />
                        </Table.Cell>
                      </Table.Row>
                      :
                      null
                    }
                    <Table.Row verticalAlign="top">
                      <Table.Cell width={5}>Maturity{' '}
                        <Popup
                          trigger={<Icon name="help circle" color="green" />}
                          content={`If the investors have not been paid in full within ${maturityMonth}, the Issuer is required to promptly pay the entire outstanding balance to the investors.`}
                          position="top center"
                        />
                      </Table.Cell>
                      <Table.Cell>
                        {maturityMonth ?
                          `${maturityMonth} ${maturityStartupPeriod && maturityStartupPeriod}`
                          :
                          'N/A'
                        }
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row verticalAlign="top">
                      <Table.Cell>Security Interest</Table.Cell>
                      <Table.Cell>
                        {keyTerms && keyTerms.securityInterest ?
                          keyTerms.securityInterest
                          :
                          'N/A'
                        }
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row verticalAlign="top">
                      <Table.Cell>Ownership % Represented by Securities</Table.Cell>
                      <Table.Cell>
                        {keyTerms && keyTerms.securitiesOwnershipPercentage ?
                          `${keyTerms.securitiesOwnershipPercentage}%
                          equity interest in the Issuer or voting or management rights with respect to the Issuer as a result of an investment in Securities.`
                          :
                          'N/A'
                        }
                      </Table.Cell>
                    </Table.Row>
                    {edgarLink &&
                    <Table.Row>
                      <Table.Cell colSpan="2">
                        <Button onClick={() => window.open(edgarLink.includes('http') ? edgarLink : `http://${edgarLink}`, '_blank')} primary content="View Form C Filing" />
                      </Table.Cell>
                    </Table.Row>
                    }
                  </Table.Body>
                </Table>
              </div>
            </Grid.Column>
            <Grid.Column width={4} floated="right">
              <Header as="h4">Key Dates & Values</Header>
              <Statistic.Group size="mini" className="vertical">
                <Statistic>
                  <Statistic.Label>Expected Business Opening</Statistic.Label>
                  <Statistic.Value>
                    {offering && offering.launch &&
                      offering.launch.targetDate ?
                      moment(offering.launch.targetDate).format('MMM Do YYYY')
                      :
                      'N/A'
                    }
                  </Statistic.Value>
                </Statistic>
                {get(offering, 'closureSummary.repayment.completeDate') && (
                  <Statistic>
                    <Statistic.Label>Payoff Date</Statistic.Label>
                    <Statistic.Value>
                      {moment(get(offering, 'closureSummary.repayment.completeDate').format('MMM Do YYYY')) || 'N/A'}
                    </Statistic.Value>
                  </Statistic>
                )}
              </Statistic.Group>
            </Grid.Column>
          </Grid>
        </div>
        {chartData.length > 0 &&
          <Aux>
            <Divider />
            <div className="inner-content-spacer payoff-chart">
              <Header as="h4">Pay Off Chart</Header>
              <PayOffChart />
            </div>
          </Aux>
        }
      </Aux>
    );
  }
}

export default Overview;
