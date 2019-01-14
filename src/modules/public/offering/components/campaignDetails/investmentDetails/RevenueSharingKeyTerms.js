import React, { Component } from 'react';
import Parser from 'html-react-parser';
import { Header, Modal, Grid, Table, Popup, Icon, Divider } from 'semantic-ui-react';
import { CAMPAIGN_KEYTERMS_SECURITIES, CAMPAIGN_KEYTERMS_REGULATION } from '../../../../../../constants/offering';
import Helper from '../../../../../../helper/utility';

const isMobile = document.documentElement.clientWidth < 768;
class RevenueSharingKeyTerms extends Component {
  render() {
    const { KeyTerms, launch, campaign } = this.props;
    const maturityMonth = KeyTerms && KeyTerms.maturity ? `${KeyTerms.maturity} Months` : '[XX] Months';
    const investmentMultiple = KeyTerms && KeyTerms.investmentMultiple ? KeyTerms.investmentMultiple : 'XXX';
    const portal = campaign.regulation ? (campaign.regulation.includes('SECURITIES') ? '2%' : '1%') : '';
    const edgarLink = launch && launch.edgarLink;
    return (
      <Modal.Content scrolling>
        <Grid columns={3} divided stackable className="vertical-gutter">
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
        <Table basic="very">
          <Table.Body>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5}><b>Offering Min{' '}</b>
                <Popup trigger={<Icon name="help circle" color="green" />} content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor" position="bottom center" />
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
              <Table.Cell width={5}><b>Offering Max{' '}</b>
                <Popup trigger={<Icon name="help circle" color="green" />} content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor" position="bottom center" />
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
              <Table.Cell width={5}><b>Min Individual Investment{' '}</b>
                <Popup trigger={<Icon name="help circle" color="green" />} content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor" position="bottom center" />
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
              <Table.Cell width={5}><b>Investment Multiple{' '}</b>
                <Popup
                  trigger={<Icon name="help circle" color="green" />}
                  content={`For every $100 you invest, you are paid a portion of this company's gross revenue every month until you are paid $${investmentMultiple === 'XXX' ? investmentMultiple : investmentMultiple * 100} within ${maturityMonth === '[XX] Months' ? 'YY' : maturityMonth} months. ${portal ? `A ${portal} service fee is deducted from each payment.` : ''}`}
                  position="bottom center"
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
              <Table.Cell><b>Revenue Sharing Percentage</b></Table.Cell>
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
              <Table.Cell width={5}><b>Maturity{' '}</b>
                <Popup
                  trigger={<Icon name="help circle" color="green" />}
                  content={`If the investors have not been paid in full within ${maturityMonth}, the Issuer is required to promptly pay the entire outstanding balance to the investors.`}
                  position="bottom center"
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
              <Table.Cell width={5}><b>Payments{' '}</b>
                <Popup
                  trigger={<Icon name="help circle" color="green" />}
                  content="The Issuer will make monthly payments based on the relevant revenue sharing percentage."
                  position="bottom center"
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
              <Table.Cell width={5}><b>Security Interest{' '}</b>
                <Popup trigger={<Icon name="help circle" color="green" />} content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor" position="bottom center" />
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
              <Table.Cell width={5}>
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
          </Table.Body>
        </Table>
        {!isMobile &&
          <Divider />
        }
        <Header as="h5" className="center-align">
          <a href={edgarLink} target="blank">
            View the Issuer&apos;s SEC Form C filing
          </a>
        </Header>
      </Modal.Content>
    );
  }
}

export default RevenueSharingKeyTerms;
