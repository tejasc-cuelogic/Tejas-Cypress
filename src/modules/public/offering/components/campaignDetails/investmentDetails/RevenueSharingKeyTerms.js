import React, { Component } from 'react';
import { Header, Modal, Grid, Table, Popup, Icon, Divider } from 'semantic-ui-react';
import { CAMPAIGN_KEYTERMS_SECURITIES } from '../../../../../../constants/offering';
import Helper from '../../../../../../helper/utility';

const isMobile = document.documentElement.clientWidth < 768;
class RevenueSharingKeyTerms extends Component {
  render() {
    const { KeyTerms } = this.props;
    return (
      <Modal.Content scrolling>
        <Grid columns={3} divided stackable className="vertical-gutter">
          <Grid.Column>
            <p><b>Issuer</b><br />{KeyTerms.shorthandBusinessName}</p>
          </Grid.Column>
          <Grid.Column>
            <p><b>Securities</b><br />{CAMPAIGN_KEYTERMS_SECURITIES[KeyTerms.securities]}</p>
          </Grid.Column>
          <Grid.Column>
            <p><b>Offering Amount</b><br />{`Min. $${Helper.CurrencyFormat(KeyTerms.minOfferingAmount)}, to max. $${Helper.CurrencyFormat(KeyTerms.maxOfferingAmount)}`}</p>
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
                <Popup trigger={<Icon name="help circle" color="green" />} content="For every $100 you invest, you are paid a portion of this company's gross revenue every month until you are paid $XXX within YY months. A 1.0% service fee is deducted from each payment." position="bottom center" />
              </Table.Cell>
              <Table.Cell>
                <p>
                  <b>
                    {KeyTerms && KeyTerms.investmentMultiple ?
                      `${KeyTerms.investmentMultiple}` : 'NA'}
                  </b>
                </p>
                <p>
                  If the final offering amount raised is less than or equal to $600,000,
                  the investment multiple will be 1.70x.
                </p>
                <p>
                  If the final offering amount raised is greater than $600,000 but
                  less than or equal to $800,000, the investment multiple will be 1.80x.
                </p>
                <p>
                  If the final offering amount raised is greater than $800,000 but less
                  than or equal to $1,000,000, the investment multiple will be 1.90x.
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
                  Buffbrew Taproom&apos;s revenue streams will come from tap sales, restaurant
                  sales, beer garden sales and facility tour and event sales.
                </p>
                <p>
                  If the final offering amount raised is less than or equal to $400,000, then
                  4% of monthly gross revenue will be shared.
                </p>
                <p>
                  If the final offering amount raised is greater than $400,000 but less than
                  or equal to $600,000, then 4% of monthly gross revenue will be shared
                  during the first 12 months of operation, then 7% thereafter.
                </p>
                <p>
                  If the final offering amount raised is greater than $600,000 but less than
                  or equal to $800,000, then 4% of monthly gross revenue will be shared
                  during the first 12 months of operation, then 10.25% thereafter.
                </p>
                <p>
                  If the final offering amount raised is greater than $800,000 but less than
                  or equal to $1,000,000, then 4% of monthly gross revenue will be shared
                  during the first 12 months of operation, then 13.5% thereafter.
                </p>
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5}><b>Maturity{' '}</b>
                <Popup
                  trigger={<Icon name="help circle" color="green" />}
                  content="If the investors have not been paid in full within [XX] months, the Issuer is required to promptly pay the entire outstanding balance to the investors."
                  position="bottom center"
                />
              </Table.Cell>
              <Table.Cell>
                {KeyTerms && KeyTerms.maturity ?
                  <p>
                    <b>{KeyTerms.maturity} Months,</b>{' '}
                    including a 6 month startup period for ramp up
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
          <a href="/https://www.sec.gov/Archives/edgar/data/1735180/000173518018000003/0001735180-18-000003-index.htm" target="blank">
            View the Issuer&apos;s SEC Form C filing
          </a>
        </Header>
      </Modal.Content>
    );
  }
}

export default RevenueSharingKeyTerms;
