import React, { Component } from 'react';
import { includes, get } from 'lodash';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Table, Grid, Statistic, Button, Divider, Icon } from 'semantic-ui-react';
import { AccTypeTitle, InlineLoader, IframeModal } from '../../../../../../theme/shared';
import { CAMPAIGN_KEYTERMS_SECURITIES_ENUM } from '../../../../../../constants/offering';
import PayOffChart from './PayOffChart';
import { DataFormatter } from '../../../../../../helper';
import SecondaryMenu from '../../../../../../theme/layout/SecondaryMenu';

@inject('portfolioStore', 'campaignStore', 'userDetailsStore', 'transactionStore', 'uiStore')
@observer
class Overview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      embedUrl: '',
      loadingDoc: '',
    };
    const { isAdmin } = this.props;
    const accountDetails = this.props.userDetailsStore.currentActiveAccountDetailsOfSelectedUsers;
    // const investor = this.props.userDetailsStore.getDetailsOfUser;
    const accountType = isAdmin && get(accountDetails, 'name') ? get(accountDetails, 'name') : includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity';
    this.props.portfolioStore.getPayOffData(accountType, isAdmin);
    this.props.transactionStore.getInvestmentsByOfferingId(isAdmin);
    window.addEventListener('message', this.docuSignListener);
  }

  componentDidMount() {
    const { campaign } = this.props.campaignStore;
    const type = get(campaign, 'keyTerms.securities');
    this.props.portfolioStore.setOverviewSummaryData(type);
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
    this.setState({ loadingDoc: aggrementId });
    this.props.transactionStore.getDocuSignViewURL(aggrementId).then((res) => {
      this.setState({ open: true, embedUrl: res, loadingDoc: '' });
    });
  }

  handleViewSuppAgreement = (aggrementId) => {
    const { campaign } = this.props.campaignStore;
    const regulation = get(campaign, 'regulation');
    const offeringRegulationArr = (regulation && regulation.split('_')) || '';
    const regulationType = get(offeringRegulationArr, '[0]');
    const accountType = regulationType === 'BD' ? 'SECURITIES' : 'SERVICES';
    this.setState({ loadingDoc: aggrementId });
    this.props.campaignStore.getBoxLink(aggrementId, accountType).then((res) => {
      this.setState({ open: true, embedUrl: res, loadingDoc: '' });
    });
  }

  render() {
    const { campaign } = this.props.campaignStore;
    const { overviewSummaryMeta, getChartData } = this.props.portfolioStore;
    const { responsiveVars } = this.props.uiStore;
    const { isMobile } = responsiveVars;
    const chartData = getChartData();
    const { offering } = campaign;
    const overviewToDisplay = campaign && campaign.keyTerms && campaign.keyTerms.securities
      && campaign.keyTerms.securities === CAMPAIGN_KEYTERMS_SECURITIES_ENUM.REVENUE_SHARING_NOTE ? 'REVENUE' : 'TERM';
    const isPreviewLinkShow = campaign && campaign.isAvailablePublicly;
    const edgarLink = get(campaign, 'offering.launch.edgarLink');
    const { agreementIds, loading } = this.props.transactionStore;
    let aggrementDocs = get(campaign, 'closureSummary.keyTerms.supplementalAgreements.documents') || [];
    aggrementDocs = aggrementDocs.length ? aggrementDocs.filter(d => d.isVisible && get(d, 'upload.fileHandle.boxFileId')) : [];
    if (loading) {
      return (
        <InlineLoader />
      );
    }
    return (
      <>
        <div className={`${isMobile ? '' : 'bg-offwhite'} inner-content-spacer`}>
          <span className="pull-left">
            <Header as="h5">
              <AccTypeTitle moreText="investment" />
            </Header>
          </span>
          {isPreviewLinkShow && !isMobile
            && (
              <span className="pull-right">
                <Link target="_blank" to={`/offerings/${campaign.offeringSlug}`} className="pull-right">View offering page</Link>
              </span>
            )
          }
        </div>
        {isMobile
          && <SecondaryMenu classname="no-shadow" bonusRewards isBonusReward refMatch={this.props.refMatch} navItems={this.props.MobileNavItems} />
        }
        <div className="inner-content-spacer">
          <Grid>
            <Grid.Column width={isMobile ? 16 : 9}>
              {!isMobile && <Header as="h4">Offering Summary</Header>}
              <div className="table-wrapper">
                <Table definition basic="very" className={isMobile ? 'without-border-shadow' : ''}>
                  <Table.Body>
                    {overviewSummaryMeta.map(data => (
                      <Table.Row verticalAlign="top" className={isMobile ? 'pt-0' : ''}>
                        <Table.Cell width={5}>{data.label}</Table.Cell>
                        <Table.Cell>{data.value}</Table.Cell>
                      </Table.Row>
                    ))}
                    {/* {campaignStatus.isPreferredEquity
                      && (
                        <>
                          <Table.Row verticalAlign="top">
                            <Table.Cell>{preferredEquityUnit}</Table.Cell>
                            <Table.Cell>
                              {get(campaign, 'closureSummary.keyTerms.priceCalculation')
                                ? Helper.CurrencyFormat(get(campaign, 'closureSummary.keyTerms.priceCalculation'))
                                : 'N/A'
                              }
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row verticalAlign="top">
                            <Table.Cell>Pre-Money Valuation</Table.Cell>
                            <Table.Cell>
                              {get(campaign, 'keyTerms.premoneyValuation')
                                ? Helper.CurrencyFormat(get(campaign, 'keyTerms.premoneyValuation'), 0)
                                : 'N/A'
                              }
                            </Table.Cell>
                          </Table.Row>
                        </>
                      )
                    } */}
                    {(agreementIds && agreementIds.length) || (aggrementDocs && aggrementDocs.length)
                      ? (
                        <Table.Row verticalAlign="top" className={isMobile ? 'pb-0' : ''}>
                          <Table.Cell>Investor Agreement{(agreementIds.length + aggrementDocs.length) > 1 && 's'} </Table.Cell>
                          <Table.Cell>
                            <Button.Group vertical>
                              {agreementIds && agreementIds.length !== 0 && agreementIds.map(agreementId => (
                                <Button icon loading={this.setState.loadingDoc === agreementId} onClick={() => this.handleViewLoanAgreement(agreementId)} className="link-button highlight-text left-align"><Icon className="ns-pdf-file" size="large" /> Purchase Agreement </Button>
                              ))}
                              {aggrementDocs && aggrementDocs.length !== 0 && aggrementDocs.map(doc => (
                                <Button icon loading={this.state.loadingDoc === get(doc, 'upload.fileHandle.boxFileId')} onClick={() => this.handleViewSuppAgreement(get(doc, 'upload.fileHandle.boxFileId'))} className="link-button highlight-text left-align"><Icon className="ns-pdf-file" size="large" /> {doc.name}</Button>
                              ))}
                            </Button.Group>
                          </Table.Cell>
                        </Table.Row>
                      ) : null
                    }
                    {edgarLink && !isMobile
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
            {get(campaign, 'closureSummary.keyTerms.businessOpenDate')
              || get(offering, 'closureSummary.repayment.completeDate')
              ? (
                <Grid.Column width={4} floated="right">
                  <Header as="h4">Key Dates & Values</Header>
                  <Statistic.Group size="mini" className="vertical">
                    {get(campaign, 'closureSummary.keyTerms.businessOpenDate')
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
        {isPreviewLinkShow && isMobile
          && (
            <>
              <Divider fitted />
              <div className="center-align mt-14 mb-14">
                <Button className="link-button highlight-text" as={Link} target="_blank" to={`/offerings/${campaign.offeringSlug}`}>View offering page</Button>
              </div>
            </>
          )
        }
        {(chartData.length > 0 && !isMobile && overviewToDisplay !== 'REVENUE')
          && (
            <>
              <Divider />
              <div className="inner-content-spacer payoff-chart">
                <Header as="h4">Payments</Header>
                <PayOffChart chartData={chartData} />
              </div>
            </>
          )}
        <IframeModal
          open={this.state.open}
          close={this.closeModal}
          srcUrl={this.state.embedUrl}
          loading={false}
        />
        {edgarLink && isMobile
          && (
            <div className="card-bottom-button">
              <Button className="mt-30" fluid onClick={() => window.open(edgarLink.includes('http') ? edgarLink : `http://${edgarLink}`, '_blank')} primary content="View Form C Filing" />
            </div>
          )}
      </>
    );
  }
}

export default Overview;
