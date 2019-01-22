import React, { Component } from 'react';
import Aux from 'react-aux';
import { Route } from 'react-router-dom';
import { Header, Divider, Statistic, Grid, Table, Icon, Popup } from 'semantic-ui-react';
import PaymentCalculatorModal from './../investmentDetails/PaymentCalculatorModal';
import { CAMPAIGN_KEYTERMS_SECURITIES, CAMPAIGN_KEYTERMS_REGULATION } from '../../../../../../constants/offering';
import Helper from '../../../../../../helper/utility';
import PaymentCalculator from './PaymentCalculator';

const isMobile = document.documentElement.clientWidth < 768;
class TermNoteDetails extends Component {
  render() {
    const { KeyTerms, launch } = this.props;
    const maturityMonth = KeyTerms && KeyTerms.maturity ? `${KeyTerms.maturity} Months` : '[XX] Months';
    const edgarLink = launch && launch.edgarLink;
    return (
      <Aux>
        <Header as="h3" className="mb-30" id="key-terms">Key Terms</Header>
        <Grid columns={3} stackable divided className="vertical-gutter neutral-text">
          <Grid.Column>
            <p><b>Issuer</b><br />{KeyTerms && KeyTerms.legalBusinessName ? KeyTerms.legalBusinessName : 'NA'}</p>
          </Grid.Column>
          <Grid.Column>
            <p><b>Regulation</b><br />{KeyTerms && KeyTerms.regulation ? CAMPAIGN_KEYTERMS_REGULATION[KeyTerms.regulation] : 'NA'}</p>
          </Grid.Column>
          <Grid.Column>
            <p><b>Security</b><br />{KeyTerms && KeyTerms.securities ? CAMPAIGN_KEYTERMS_SECURITIES[KeyTerms.securities] : 'NA'}</p>
          </Grid.Column>
        </Grid>
        {!isMobile && <Divider />}
        <Table basic="very" className="key-terms-table">
          <Table.Body>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5} className="neutral-text"><b>Offering Min{' '}</b>
                <Popup
                  trigger={<Icon name="help circle" color="green" />}
                  content="If the minimum goal is not met by the end of the offering period, any funds you invest will be automatically returned to your NextSeed account."
                  position="top center"
                />
              </Table.Cell>
              <Table.Cell>
                <p>
                  {KeyTerms && KeyTerms.minOfferingAmount ?
                    Helper.CurrencyFormat(KeyTerms.minOfferingAmount)
                    :
                    'NA'}
                </p>
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5} className="neutral-text"><b>Offering Max{' '}</b>
                <Popup
                  trigger={<Icon name="help circle" color="green" />}
                  content="The offering will remain open until the issuer raises the maximum goal or the offering period ends. As long as the raise exceeds the minimumgoal, the issuer will receive the funds."
                  position="top center"
                />
              </Table.Cell>
              <Table.Cell>
                <p>
                  {KeyTerms && KeyTerms.maxOfferingAmount ?
                    Helper.CurrencyFormat(KeyTerms.maxOfferingAmount)
                    :
                    'NA'}
                </p>
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5} className="neutral-text"><b>Min Individual Investment{' '}</b>
                <Popup trigger={<Icon name="help circle" color="green" />} content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor" position="top center" />
              </Table.Cell>
              <Table.Cell>
                <p>
                  {KeyTerms && KeyTerms.minInvestAmt ?
                    Helper.CurrencyFormat(KeyTerms.minInvestAmt)
                    :
                    'NA'}
                </p>
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5} className="neutral-text"><b>Interest Rate{' '}</b>
                <Popup
                  trigger={<Icon name="help circle" color="green" />}
                  content="Interest payment is calculated at a gross annualized interest rate of 16.0% each month on the remaining balance of your investment from the prior month."
                  position="top center"
                />
              </Table.Cell>
              <Table.Cell>
                {KeyTerms && KeyTerms.interestRate ?
                  <p>
                    <b>{KeyTerms.interestRate}%</b>
                  </p>
                  :
                  'NA'
                }
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5} className="neutral-text"><b>Maturity{' '}</b>
                <Popup
                  trigger={<Icon name="help circle" color="green" />}
                  content={`If the investors have not been paid in full within ${maturityMonth}, the Issuer is required to promptly pay the entire outstanding balance to the investors.`}
                  position="top center"
                />
              </Table.Cell>
              <Table.Cell>
                {KeyTerms && KeyTerms.maturity ?
                  <p>
                    <b>{KeyTerms.maturity} Months</b>
                    {
                      KeyTerms && KeyTerms.startupPeriod &&
                      ` including a ${KeyTerms.startupPeriod} month startup period for ramp up`
                    }
                  </p>
                  :
                  'NA'
                }
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5} className="neutral-text"><b>Payments{' '}</b>
                <Popup
                  trigger={<Icon name="help circle" color="green" />}
                  content="The Issuer will make monthly payments based on the relevant revenue sharing percentage."
                  position="top center"
                />
              </Table.Cell>
              <Table.Cell>
                <p>
                  <b>
                    {KeyTerms && KeyTerms.frequencyOfPayments ?
                      `${KeyTerms.frequencyOfPayments}` : 'NA'}
                  </b>
                </p>
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5} className="neutral-text"><b>Security Interest{' '}</b>
                <Popup
                  trigger={<Icon name="help circle" color="green" />}
                  content="The Issuer will grant a security interest in all of its assets in favor of NextSeed for the benefit of the investors to secure the Issuer’s obligations under the Securities. For more details, please see the disclosure statement."
                  position="top center"
                />
              </Table.Cell>
              <Table.Cell>
                <p>
                  <b>
                    {KeyTerms && KeyTerms.securityInterest ?
                      `${KeyTerms.securityInterest}` : 'NA'}
                  </b>
                </p>
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5} className="neutral-text">
                <b>Ownership % Represented by Securities</b>
              </Table.Cell>
              <Table.Cell>
                {KeyTerms && KeyTerms.securitiesOwnershipPercentage ?
                  <p>
                    <b>{KeyTerms.securitiesOwnershipPercentage}%</b>{' '}
                    Investors will not receive any equity interests in the Issuer or
                    any voting or management rights with respect to the Issuer as a result of
                    an investment in Securities.
                  </p>
                  :
                  'NA'
                }
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell colSpan={2} className="center-align">
                <a href={edgarLink} target="blank" className="highlight-text">
                  View the Issuer&apos;s SEC Form C filing
                </a>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <Divider section hidden />
        <Header as="h3">Total Payment Calculator</Header>
        <Grid columns={4} divided doubling stackable className="mb-30 mt-30 investment-grid">
          <Grid.Column>
            <Statistic className="basic" size="mini">
              <Statistic.Label className={isMobile && 'center-align'}>Interest Rate*</Statistic.Label>
              <Statistic.Value className={isMobile && 'center-align'}>16.00%</Statistic.Value>
            </Statistic>
          </Grid.Column>
          <Grid.Column>
            <Statistic className="basic" size="mini">
              <Statistic.Label className={isMobile && 'center-align'}>Term</Statistic.Label>
              <Statistic.Value className={isMobile && 'center-align'}>60 months</Statistic.Value>
            </Statistic>
          </Grid.Column>
          <Grid.Column>
            <Statistic className="basic" size="mini">
              <Statistic.Label className={isMobile && 'center-align'}>Principal</Statistic.Label>
              <Statistic.Value className={`${isMobile && 'center-align'} highlight-text`}>
              $100
              </Statistic.Value>
              <div className="slidecontainer">
                <input
                  type="range"
                  min="1"
                  max="100"
                  value="10"
                  className="slider mt-10 mb-10"
                  id="myRange"
                />
              </div>
            </Statistic>
          </Grid.Column>
          <Grid.Column>
            <Statistic className="basic" size="mini">
              <Statistic.Label className={isMobile && 'center-align'}>Total Payment*</Statistic.Label>
              <Statistic.Value className={`highlight-text ${isMobile && 'center-align'}`}>$146</Statistic.Value>
            </Statistic>
          </Grid.Column>
        </Grid>
        <PaymentCalculator />
        <p className="mt-30 note">
          * Payment for any given month (including the total payment at the end of the
          final month) indicates the cumulative amount contractually required to be paid
          to an investor after the end of that month, assuming the loan is not prepaid.
          This calculation is a mathematical illustration only and may not reflect actual
          performance. It does not take into account NextSeed fees of 1% on each payment
          made to investors. Payment is not guaranteed or insured and investors may lose
          some or all of the principal invested if the Issuer cannot make its payments.
        </p>
        <Route path={`${this.props.match.url}/paymentcalculator`} component={PaymentCalculatorModal} />
      </Aux>
    );
  }
}

export default TermNoteDetails;
