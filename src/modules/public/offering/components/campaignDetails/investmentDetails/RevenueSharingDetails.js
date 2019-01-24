import React, { Component } from 'react';
import Parser from 'html-react-parser';
import Aux from 'react-aux';
import { Header, Table, Divider, Grid, Popup, Icon } from 'semantic-ui-react';
import { CAMPAIGN_KEYTERMS_SECURITIES, CAMPAIGN_KEYTERMS_REGULATION } from '../../../../../../constants/offering';
import { InlineLoader } from '../../../../../../theme/shared';
import Helper from '../../../../../../helper/utility';

class RevenueSharingDetails extends Component {
  render() {
    const { KeyTerms, launch, campaign } = this.props;
    const maturityMonth = KeyTerms && KeyTerms.maturity ? `${KeyTerms.maturity} Months` : '[XX] Months';
    const investmentMultiple = KeyTerms && KeyTerms.investmentMultiple ? KeyTerms.investmentMultiple : 'XXX';
    const portal = campaign && campaign.regulation ? (campaign.regulation.includes('BD') ? '2%' : '1%') : '';
    const edgarLink = launch && launch.edgarLink;
    const revenueShareSummary =
      (KeyTerms && KeyTerms.revShareSummary && KeyTerms.revShareSummary === 'REVENUE_SHARING_NOTE') || null;
    return (
      <Aux>
        <Grid columns={3} divided stackable className="vertical-gutter neutral-text">
          <Grid.Column>
            <p><b>Issuer</b><br />{KeyTerms && KeyTerms.legalBusinessName ? KeyTerms.legalBusinessName : 'NA' }</p>
          </Grid.Column>
          <Grid.Column>
            <p><b>Regulation</b><br />{KeyTerms && KeyTerms.regulation ? CAMPAIGN_KEYTERMS_REGULATION[KeyTerms.regulation] : 'NA'}</p>
          </Grid.Column>
          <Grid.Column>
            <p><b>Security</b><br />{KeyTerms && KeyTerms.securities ? CAMPAIGN_KEYTERMS_SECURITIES[KeyTerms.securities] : 'NA'}</p>
          </Grid.Column>
        </Grid>
        <Divider />
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
              <Table.Cell width={5} className="neutral-text"><b>Investment Multiple{' '}</b>
                <Popup
                  trigger={<Icon name="help circle" color="green" />}
                  content={`For every $100 you invest, you are paid a portion of this company's gross revenue every month until you are paid $${investmentMultiple === 'XXX' ? investmentMultiple : investmentMultiple * 100} within ${maturityMonth === '[XX] Months' ? 'YY' : maturityMonth} months. ${portal ? `A ${portal} service fee is deducted from each payment.` : ''}`}
                  position="top center"
                />
              </Table.Cell>
              <Table.Cell>
                <p>
                  <b>
                    {KeyTerms && KeyTerms.investmentMultiple ?
                      `${KeyTerms.investmentMultiple}` : 'NA'}
                  </b>
                </p>
                <p>
                  {Parser(KeyTerms && KeyTerms.investmentMultipleSummary ?
                    KeyTerms.investmentMultipleSummary
                    :
                    '')}
                </p>
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5} className="neutral-text"><b>Revenue Sharing Percentage</b></Table.Cell>
              <Table.Cell>
                <p>
                  <b>
                    {KeyTerms && KeyTerms.revSharePercentage ?
                      `${KeyTerms.revSharePercentage}` : 'NA'}
                  </b>
                </p>
                <p>
                  {Parser(KeyTerms && KeyTerms.revShareSummary ?
                    KeyTerms.revShareSummary
                    :
                    '')}
                </p>
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
            <Table.Row verticalAlign="top" >
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
                      `${KeyTerms.securityInterest}` : ' NA'}
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
        <Header as="h3" className="mb-30 anchor-wrap">
          Revenue Sharing Summary*
          <span className="anchor" id="revenue-sharing-summary" />
        </Header>
        <p>
          {revenueShareSummary ?
            <p className="detail-section">
              {Parser(revenueShareSummary)}
            </p>
            :
            <InlineLoader text="No data available" className="bg-offwhite" />
          }
        </p>
        <p className="note">
          * For illustration only. See expanded Payment Calculator view to read more
          regarding actual performance variables.
        </p>
      </Aux>
    );
  }
}

export default RevenueSharingDetails;
