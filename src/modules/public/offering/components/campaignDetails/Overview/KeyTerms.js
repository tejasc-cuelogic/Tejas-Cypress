/* eslint-disable no-undef */
import React, { Component } from 'react';
import Aux from 'react-aux';
import { Link, withRouter } from 'react-router-dom';
import { Icon, Popup, Table, Header, Button } from 'semantic-ui-react';
// import { Link } from 'react-router-dom';
import { CAMPAIGN_KEYTERMS_SECURITIES, CAMPAIGN_KEYTERMS_REGULATION } from '../../../../../../constants/offering';
// import Helper from '../../../../../../helper/utility';

@withRouter
class KeyTerms extends Component {
  handleViewInvestmentDetails = (e) => {
    e.preventDefault();
    this.props.history.push(`${this.props.refLink}/investment-details`);
  }
  render() {
    const { campaign } = this.props;
    const maturityMonth = campaign && campaign.keyTerms && campaign.keyTerms.maturity ? `${campaign.keyTerms.maturity} Months` : '[XX] Months';
    // const investmentMultiple = campaign && campaign.keyTerms &&
    // campaign.keyTerms.investmentMultiple ? campaign.keyTerms.investmentMultiple : 'XXX';
    const maturityStartupPeriod = campaign && campaign.keyTerms && campaign.keyTerms.startupPeriod ? ` including a ${campaign.keyTerms.startupPeriod} month startup period for ramp up` : '';
    // const portal = campaign.portal ? (campaign.portal === 'BD' ? '2%' : '1%') : '';
    // const portal = campaign && campaign.regulation ?
    // (campaign.regulation.includes('BD') ? '2%' : '1%') : '';
    return (
      <Aux>
        <Header as="h3" className="mb-30" id="investment-highlights">Investment Highlights</Header>
        <Table basic="very" className="key-terms-table">
          <Table.Body>
            <Table.Row verticalAlign="top">
              <Table.Cell><b>Type of Raise</b>{' '}
                {campaign && campaign.keyTerms && campaign.keyTerms.regulation ?
                CAMPAIGN_KEYTERMS_REGULATION[campaign.keyTerms.regulation] : ''}
                <Popup
                  hoverable
                  position="top center"
                  trigger={<Icon
                    name="help circle"
                    color="green"
                  />}
                  content={(
                    <span>This campaign is raising capital under Regulation CF and
                      Regulation D. For more information on what this means, check out our{' '}
                      <Link to="/resources/education-center">Education Center</Link>.
                    </span>
                  )}
                />
              </Table.Cell>
              <Table.Cell />
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell><b>Investment Type</b>{' '}
                <Popup
                  trigger={<Icon name="help circle" color="green" />}
                  content="Lorem Ipsum"
                  position="top center"
                />
              </Table.Cell>
              <Table.Cell>
                {campaign && campaign.keyTerms &&
                  campaign.keyTerms.securities ?
                  CAMPAIGN_KEYTERMS_SECURITIES[campaign.keyTerms.securities]
                  :
                ''}
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5}><b>Maturity</b>{' '}
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
                  '-'
                }
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
              <Table.Cell />
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell><b>Multiple</b>{' '}
                <Popup
                  hoverable
                  trigger={<Icon name="help circle" color="green" />}
                  content={(<span>The business will pay you a percent of its gross revenues until a multiple of your investment is paid back to you. See the <Link to={`${this.props.refLink}/investment-details`}>Key Terms</Link> for more details.</span>)}
                  position="top center"
                />
              </Table.Cell>
              <Table.Cell>
                {campaign && campaign.keyTerms && campaign.keyTerms.investmentMultiple ? campaign.keyTerms.investmentMultiple : '-'}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <Button onClick={this.handleViewInvestmentDetails} basic compact className="highlight-text mt-40">
          View Investment Details
          <Icon size="small" className="ns-chevron-right right" color="white" />
        </Button>
      </Aux>
      // <Grid.Column>
      //   <Segment padded className="clearfix">
      //     <Header as="h4">
      //       <Link to={`${refLink.url}/keyterms`}>
      //         Key Terms
      //         <Icon className="ns-chevron-right" color="green" />
      //       </Link>
      //     </Header>
      //     <Grid columns={3} doubling divided className="vertical-gutter">
      //       <Grid.Column>
      //         <Statistic size="mini" className="basic">
      //           <Statistic.Label><b>Investment Type </b>
      //             <Popup
      //               trigger={<Icon name="help circle" color="green" />}
      //               content="Lorem Ipsum"
      //               position="top center"
      //             />
      //           </Statistic.Label>
      //           <Statistic.Value>
      //             {campaign && campaign.keyTerms &&
      //               campaign.keyTerms.securities ?
      //               CAMPAIGN_KEYTERMS_SECURITIES[campaign.keyTerms.securities]
      //               :
      //               ''}
      //           </Statistic.Value>
      //         </Statistic>
      //       </Grid.Column>
      //       <Grid.Column>
      //         <Statistic size="mini" className="basic">
      //           <Statistic.Label><b>Multiple</b>
      //             <Popup
      //               trigger={<Icon name="help circle" color="green" />}
      //               content={`For every $100 you invest, you are paid a portion of this
      // company's gross revenue every month until you are paid $${investmentMultiple ===
      // 'XXX' ? investmentMultiple : investmentMultiple * 100} within ${maturityMonth ===
      // '[XX] Months' ? 'YY' : maturityMonth} months. ${portal ? `A ${portal} service fee
      // is deducted from each payment.` : ''}`}
      //               position="top center"
      //             />
      //           </Statistic.Label>
      //           <Statistic.Value>
      //             {campaign && campaign.keyTerms && campaign.keyTerms.investmentMultiple ?
      // campaign.keyTerms.investmentMultiple : '-'}
      //           </Statistic.Value>
      //         </Statistic>
      //       </Grid.Column>
      //       {/* <Grid.Column>
      //         <Statistic size="mini" className="basic">
      //           <Statistic.Label>Revenue Sharing <Popup trigger=
      //           {<Icon name="help circle" color="green" />}
      //           content="For every $100 you invest, you are paid a portion of
      //            this company's gross revenue every month until you are paid $190 within
      //             78 months. A 1.0% service fee is deducted from each payment
      //             . See some examples." position="top center" /></Statistic.Label>
      //           <Statistic.Value>
      //             {campaign && campaign.keyTerms ? campaign.keyTerms.revSharePercentage : '-'}
      //           </Statistic.Value>
      //         </Statistic>
      //       </Grid.Column> */}
      //       <Grid.Column>
      //         <Statistic size="mini" className="basic">
      //           <Statistic.Label><b>Maturity</b> <Popup trigger={<Icon name="help circle"
      // color="green" />} content={`If the investors have not been paid in full within
      // ${maturityMonth}, the Issuer is required to promptly pay the entire outstanding
      // balance to the investors.`} position="top center" /></Statistic.Label>
      //           <Statistic.Value>
      //             {maturityMonth ?
      //               `${maturityMonth} ${maturityStartupPeriod && maturityStartupPeriod}`
      //               :
      //               '-'
      //             }
      //           </Statistic.Value>
      //         </Statistic>
      //       </Grid.Column>
      //       <Grid.Column>
      //         <Statistic size="mini" className="basic">
      //           <Statistic.Label><b>Min Investment</b>{' '}
      //             <Popup
      //               trigger={<Icon name="help circle" color="green" />}
      //               content="The required minimum investment per investor in this offering."
      //               position="top center"
      //               hoverable
      //             />
      //           </Statistic.Label>
      //           <Statistic.Value>
      //             {campaign && campaign.keyTerms && campaign.keyTerms.minInvestAmt ?
      //               Helper.CurrencyFormat(campaign.keyTerms.minInvestAmt) : '-'
      //             }
      //           </Statistic.Value>
      //         </Statistic>
      //       </Grid.Column>
      //       <Grid.Column>
      //         <Statistic size="mini" className="basic">
      //           <Statistic.Label><b>Payments</b>{' '}
      //             <Popup
      //               trigger={<Icon name="help circle" color="green" />}
      //               content="The Issuer will make monthly payments based on the relevant
      // revenue sharing percentage."
      //               position="top center"
      //             />
      //           </Statistic.Label>
      //           <Statistic.Value>
      //             {campaign && campaign.keyTerms && campaign.keyTerms.frequencyOfPayments
      // ? campaign.keyTerms.frequencyOfPayments : '-'}
      //           </Statistic.Value>
      //         </Statistic>
      //       </Grid.Column>
      //       <Grid.Column>
      //         <Statistic size="mini" className="basic">
      //           <Statistic.Label><b>Ownership</b> <Popup trigger={<Icon name="help circle"
      // color="green" />} content="Equity interest in the Issuer or voting or management
      // rights with respect to the Issuer as a result of an investment in Securities."
      // position="top center" /></Statistic.Label>
      //           <Statistic.Value>
      //             {campaign && campaign.keyTerms &&
      // campaign.keyTerms.securitiesOwnershipPercentage ?
      // `${campaign.keyTerms.securitiesOwnershipPercentage}%` : '-'}
      //           </Statistic.Value>
      //         </Statistic>
      //       </Grid.Column>
      //     </Grid>
      //   </Segment>
      // </Grid.Column>
    );
  }
}

export default KeyTerms;
