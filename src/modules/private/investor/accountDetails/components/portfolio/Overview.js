import React, { Component } from 'react';
import { includes, get } from 'lodash';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Table, Grid, Statistic, Button, Divider, Popup, Icon } from 'semantic-ui-react';
import { AccTypeTitle, InlineLoader, IframeModal } from '../../../../../../theme/shared';
import { CAMPAIGN_KEYTERMS_SECURITIES, CAMPAIGN_KEYTERMS_SECURITIES_ENUM } from '../../../../../../constants/offering';
import PayOffChart from './PayOffChart';
import HtmlEditor from '../../../../../shared/HtmlEditor';
import { DataFormatter } from '../../../../../../helper';

@inject('portfolioStore', 'campaignStore', 'userDetailsStore', 'transactionStore')
@observer
class Overview extends Component {
  state = {
    open: false,
    embedUrl: '',
  };

  componentWillMount() {
    const { isAdmin } = this.props;
    const accountDetails = this.props.userDetailsStore.currentActiveAccountDetailsOfSelectedUsers;
    // const investor = this.props.userDetailsStore.getDetailsOfUser;
    const accountType = isAdmin && get(accountDetails, 'name') ? get(accountDetails, 'name') : includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity';
    this.props.portfolioStore.getPayOffData(accountType, isAdmin);
    this.props.transactionStore.getInvestmentsByOfferingId(isAdmin);
    window.addEventListener('message', this.docuSignListener);
  }

  docuSignListener = (e) => {
    if (e.data === 'viewing_complete') {
      this.setState({ open: false });
    }
  };

  closeModal = () => {
    this.setState({ open: false });
  }

  handleViewLoanAgreement = (aggrementId) => {
    this.props.transactionStore.getDocuSignViewURL(aggrementId).then((res) => {
      this.setState({
        open: true,
        embedUrl: res,
      });
    });
  }

  render() {
    const { campaign } = this.props.campaignStore;
    const chartData = this.props.portfolioStore.getChartData();
    const { keyTerms, offering } = campaign;
    const overviewToDisplay = campaign && campaign.keyTerms && campaign.keyTerms.securities
      && campaign.keyTerms.securities === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.REVENUE_SHARING_NOTE ? 'REVENUE' : 'TERM';
    const isPreviewLinkShow = campaign && campaign.isAvailablePublicly;
    const edgarLink = get(campaign, 'offering.launch.edgarLink');
    const maturityMonth = campaign && campaign.keyTerms && campaign.keyTerms.maturity ? `${campaign.keyTerms.maturity} months` : 'N/A';
    const maturityStartupPeriod = campaign && campaign.keyTerms && campaign.keyTerms.startupPeriod ? `, including a ${campaign.keyTerms.startupPeriod}-month startup period for ramp up` : '';
    const { agreementIds, loading } = this.props.transactionStore;
    if (loading) {
      return (
        <InlineLoader />
      );
    }
    return (
      <>
        <div className="inner-content-spacer bg-offwhite">
          <span className="pull-left">
            <Header as="h5">
              <AccTypeTitle moreText="investment" />
            </Header>
          </span>
          {isPreviewLinkShow
            && (
            <span className="pull-right">
              <Link target="_blank" to={`/offerings/${campaign.offeringSlug}`} className="pull-right">View offering page</Link>
            </span>
            )
          }
        </div>
        <div className="inner-content-spacer">
          <Grid>
            <Grid.Column width={9}>
              <Header as="h4">Offering Summary</Header>
              <div className="table-wrapper">
                <Table unstackable definition basic="very">
                  <Table.Body>
                    { keyTerms && keyTerms.shorthandBusinessName
                      ? (
                      <Table.Row verticalAlign="top">
                        <Table.Cell width={5}>Issuer</Table.Cell>
                        <Table.Cell>
                          {keyTerms && keyTerms.shorthandBusinessName
                            ? keyTerms.shorthandBusinessName
                            : 'N/A'
                          }
                        </Table.Cell>
                      </Table.Row>
                      ) : ''
                    }
                    { keyTerms && keyTerms.securities
                      ? (
                      <Table.Row verticalAlign="top">
                        <Table.Cell>Securities</Table.Cell>
                        <Table.Cell>
                          {keyTerms && keyTerms.securities
                            ? CAMPAIGN_KEYTERMS_SECURITIES[keyTerms.securities]
                            : 'N/A'
                          }
                        </Table.Cell>
                      </Table.Row>
                      ) : ''
                    }
                    { offering && offering.launch && offering.launch.targetDate
                      ? (
                      <Table.Row verticalAlign="top">
                        <Table.Cell>{overviewToDisplay && overviewToDisplay === 'REVENUE' ? 'Anticipated Opening' : 'Original Anticipated Opening Date'}</Table.Cell>
                        <Table.Cell>
                          {offering && offering.launch
                            && offering.launch.targetDate
                            ? DataFormatter.getDateAsPerTimeZone(offering.launch.targetDate, false, true, false)
                            : 'N/A'
                          }
                        </Table.Cell>
                      </Table.Row>
                      ) : ''
                    }
                    { get(campaign, 'closureSummary.keyTerms.interestRate') || get(campaign, 'closureSummary.keyTerms.multiple')
                      ? (
                      <Table.Row verticalAlign="top">
                        <Table.Cell>
                          {overviewToDisplay && overviewToDisplay === 'REVENUE'
                            ? 'Investment Multiple'
                            : 'Interest Rate'
                          }
                        </Table.Cell>
                        {overviewToDisplay && overviewToDisplay === 'REVENUE'
                          ? (
                          <Table.Cell>
                            {campaign && get(campaign, 'closureSummary.keyTerms.multiple') ? `${get(campaign, 'closureSummary.keyTerms.multiple')}x` : 'N/A'}{' '}
                            <HtmlEditor
                              readOnly
                              content={(keyTerms && keyTerms.investmentMultipleSummary
                                ? keyTerms.investmentMultipleSummary : '')}
                            />
                          </Table.Cell>
                          )
                          : (
                          <Table.Cell>
                            {campaign && get(campaign, 'closureSummary.keyTerms.interestRate')
                              ? `${get(campaign, 'closureSummary.keyTerms.interestRate')}%` : 'N/A'
                            }
                          </Table.Cell>
                          )
                        }
                      </Table.Row>
                      ) : ''
                    }
                    {keyTerms && keyTerms.frequencyOfPayments
                      ? (
                      <Table.Row verticalAlign="top">
                        <Table.Cell>Payments</Table.Cell>
                        <Table.Cell>
                          {keyTerms && keyTerms.frequencyOfPayments
                            ? keyTerms.frequencyOfPayments : 'N/A'}
                        </Table.Cell>
                      </Table.Row>
                      ) : ''
                    }
                    {overviewToDisplay && overviewToDisplay === 'REVENUE' && get(campaign, 'closureSummary.keyTerms.revSharePercentage')
                      ? (
                      <Table.Row verticalAlign="top">
                        <Table.Cell>Revenue Sharing Percentage</Table.Cell>
                        <Table.Cell>
                          {campaign && get(campaign, 'closureSummary.keyTerms.revSharePercentage')
                            ? get(campaign, 'closureSummary.keyTerms.revSharePercentage').includes('%')
                              ? get(campaign, 'closureSummary.keyTerms.revSharePercentage') : `${get(campaign, 'closureSummary.keyTerms.revSharePercentage')}%`
                            : 'N/A'}
                          <HtmlEditor
                            readOnly
                            content={(keyTerms && keyTerms.revSharePercentageDescription
                              ? keyTerms.revSharePercentageDescription : '')}
                          />
                        </Table.Cell>
                      </Table.Row>
                      )
                      : ''
                    }
                    { maturityMonth
                      ? (
                      <Table.Row verticalAlign="top">
                        <Table.Cell width={5}>Maturity{' '}
                          <Popup
                            trigger={<Icon name="help circle" color="green" />}
                            content={`If the investors have not been paid in full within ${maturityMonth}, the Issuer is required to promptly pay the entire outstanding balance to the investors.`}
                            position="top center"
                          />
                        </Table.Cell>
                        <Table.Cell>
                          {maturityMonth
                            ? `${maturityMonth} ${maturityStartupPeriod && maturityStartupPeriod}`
                            : 'N/A'
                          }
                        </Table.Cell>
                      </Table.Row>
                      ) : ''
                    }
                    { keyTerms && keyTerms.securityInterest
                      ? (
                      <Table.Row verticalAlign="top">
                        <Table.Cell>Security Interest</Table.Cell>
                        <Table.Cell>
                          {keyTerms && keyTerms.securityInterest
                            ? keyTerms.securityInterest
                            : 'N/A'
                          }
                        </Table.Cell>
                      </Table.Row>
                      ) : ''
                    }
                    { keyTerms && keyTerms.securitiesOwnershipPercentage
                      ? (
                      <Table.Row verticalAlign="top">
                        <Table.Cell>Ownership % Represented by Securities</Table.Cell>
                        <Table.Cell>
                          {keyTerms && keyTerms.securitiesOwnershipPercentage
                            ? `${keyTerms.securitiesOwnershipPercentage}%
                            equity interest in the Issuer or voting or management rights with respect to the Issuer as a result of an investment in Securities.`
                            : 'N/A'
                          }
                        </Table.Cell>
                      </Table.Row>
                      ) : ''
                    }
                    {agreementIds
                      ? (
                      <Table.Row verticalAlign="top">
                        <Table.Cell>Investor Agreement{agreementIds.length > 1 && 's'} </Table.Cell>
                        <Table.Cell>
                          {agreementIds.map(agreementId => (
                            <Button onClick={() => this.handleViewLoanAgreement(agreementId)} className="link-button highlight-text">#{agreementId} </Button>
                          ))}
                        </Table.Cell>
                      </Table.Row>
                      ) : ''
                    }
                    {edgarLink
                    && (
                    <Table.Row>
                      <Table.Cell colSpan="2">
                        <Button onClick={() => window.open(edgarLink.includes('http') ? edgarLink : `http://${edgarLink}`, '_blank')} primary content="View Form C Filing" />
                      </Table.Cell>
                    </Table.Row>
                    )
                    }
                  </Table.Body>
                </Table>
              </div>
            </Grid.Column>
            { get(campaign, 'closureSummary.keyTerms.businessOpenDate')
            || get(offering, 'closureSummary.repayment.completeDate')
              ? (
              <Grid.Column width={4} floated="right">
                <Header as="h4">Key Dates & Values</Header>
                <Statistic.Group size="mini" className="vertical">
                  { get(campaign, 'closureSummary.keyTerms.businessOpenDate')
                    ? (
                    <Statistic>
                      <Statistic.Label>Business Open Date</Statistic.Label>
                      <Statistic.Value>
                        {get(campaign, 'closureSummary.keyTerms.businessOpenDate')
                          ? DataFormatter.getDateAsPerTimeZone(get(campaign, 'closureSummary.keyTerms.businessOpenDate'), false, false, false, 'MMM Do YYYY')
                          : 'N/A'
                        }
                      </Statistic.Value>
                    </Statistic>
                    ) : ''
                  }
                  {get(offering, 'closureSummary.repayment.completeDate') && (
                    <Statistic>
                      <Statistic.Label>Payoff Date</Statistic.Label>
                      <Statistic.Value>
                        {DataFormatter.getDateAsPerTimeZone(get(offering, 'closureSummary.repayment.completeDate'), false, false, false, 'MMM Do YYYY') || 'N/A'}
                      </Statistic.Value>
                    </Statistic>
                  )}
                </Statistic.Group>
              </Grid.Column>
              ) : ''
            }
          </Grid>
        </div>
        {chartData.length > 0
          && (
          <>
            <Divider />
            <div className="inner-content-spacer payoff-chart">
              <Header as="h4">Payments</Header>
              <PayOffChart chartData={chartData} />
            </div>
          </>
          )
        }
        <IframeModal
          open={this.state.open}
          close={this.closeModal}
          srcUrl={this.state.embedUrl}
          loading={false}
        />
      </>
    );
  }
}

export default Overview;
