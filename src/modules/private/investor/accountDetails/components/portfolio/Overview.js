import React, { Component } from 'react';
import Aux from 'react-aux';
import { includes } from 'lodash';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import { Header, Table, Grid, Statistic, Button, Divider } from 'semantic-ui-react';
import Parser from 'html-react-parser';
import { AccTypeTitle } from '../../../../../../theme/shared';
import { CAMPAIGN_KEYTERMS_SECURITIES, CAMPAIGN_KEYTERMS_SECURITIES_ENUM } from '../../../../../../constants/offering';
import PayOffChart from './PayOffChart';

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
                          'NA'
                        }
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row verticalAlign="top">
                      <Table.Cell>Entity Type</Table.Cell>
                      <Table.Cell>
                        {keyTerms && keyTerms.legalBusinessType ?
                          keyTerms.legalBusinessType
                          :
                          'NA'
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
                          'NA'
                        }
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row verticalAlign="top">
                      <Table.Cell>Maturity</Table.Cell>
                      <Table.Cell>
                        {keyTerms && keyTerms.maturity ?
                          `${keyTerms.maturity} Months to Offering Summary`
                          :
                          'NA'
                        }
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row verticalAlign="top">
                      <Table.Cell>Principal Office</Table.Cell>
                      <Table.Cell>4102 Avenue H #A, Austin, TX 78751</Table.Cell>
                    </Table.Row>
                    <Table.Row verticalAlign="top">
                      <Table.Cell>Security Interest</Table.Cell>
                      <Table.Cell>
                        {keyTerms && keyTerms.securityInterest ?
                          keyTerms.securityInterest
                          :
                          'NA'
                        }
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row verticalAlign="top">
                      <Table.Cell>Payments</Table.Cell>
                      <Table.Cell>
                        {keyTerms && keyTerms.frequencyOfPayments ?
                          keyTerms.frequencyOfPayments : 'NA'}
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row verticalAlign="top">
                      <Table.Cell>Ownership % Represented by Securities</Table.Cell>
                      <Table.Cell>
                        {keyTerms && keyTerms.securitiesOwnershipPercentage ?
                          `${keyTerms.securitiesOwnershipPercentage}%
                          Investors will not receive any equity interests in
                          the Issuer or any voting or management rights with respect
                          to the Issuer as a result of an investment in Securities.`
                          :
                          'NA'
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
                          {keyTerms && keyTerms.investmentMultiple ? keyTerms.investmentMultiple : 'NA'}{' '}
                          <p>
                            {
                              Parser(keyTerms && keyTerms.investmentMultipleSummary ?
                                keyTerms.investmentMultipleSummary : '')
                            }
                          </p>
                        </Table.Cell>
                        :
                        <Table.Cell>
                          {keyTerms && keyTerms.interestRate ?
                            `${keyTerms.interestRate}%` : 'NA'
                          }
                        </Table.Cell>
                      }
                    </Table.Row>
                    {overviewToDisplay && overviewToDisplay === 'REVENUE' ?
                      <Table.Row verticalAlign="top">
                        <Table.Cell>Revenue Sharing Percentage</Table.Cell>
                        <Table.Cell>
                          {keyTerms && keyTerms.revSharePercentage ?
                            keyTerms.revSharePercentage
                            :
                            'NA'}
                          <p>
                            {
                              Parser(keyTerms && keyTerms.revShareSummary ?
                                keyTerms.revShareSummary
                                :
                                '')
                            }
                          </p>
                        </Table.Cell>
                      </Table.Row>
                      :
                      null
                    }
                    <Table.Row verticalAlign="top">
                      <Table.Cell>Securities</Table.Cell>
                      <Table.Cell>
                        {keyTerms && keyTerms.securities ?
                          CAMPAIGN_KEYTERMS_SECURITIES[keyTerms.securities]
                          :
                          'NA'
                        }
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell colSpan="2">
                        <Button primary content="Fill SEC Form C" />
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </div>
            </Grid.Column>
            <Grid.Column width={4} floated="right">
              <Header as="h4">Key Dates & Values</Header>
              <Statistic.Group size="mini" className="vertical">
                <Statistic>
                  <Statistic.Label>Open date</Statistic.Label>
                  <Statistic.Value>
                    {offering && offering.launch &&
                      offering.launch.targetDate ?
                      moment(offering.launch.targetDate).format('MMM Do YYYY')
                      :
                      'NA'
                    }
                  </Statistic.Value>
                </Statistic>
                <Statistic>
                  <Statistic.Label>Months to Maturity</Statistic.Label>
                  <Statistic.Value>
                    {keyTerms && keyTerms.maturity ?
                      `${keyTerms.maturity} months`
                      :
                      'NA'
                    }
                  </Statistic.Value>
                </Statistic>
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
