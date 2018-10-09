import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Modal, Grid, Table, Popup, Icon, Divider } from 'semantic-ui-react';
import { CAMPAIGN_KEYTERMS_SECURITIES } from '../../../../../../constants/offering';

const isMobile = document.documentElement.clientWidth < 768;
class RevenueSharingKeyTerms extends Component {
  render() {
    const { KeyTerms } = this.props;
    return (
      <Modal.Content scrolling>
        <Grid columns={3} divided stackable className="vertical-gutter">
          <Grid.Column>
            <p><b>Issuer</b><br />{KeyTerms.legalBusinessName}</p>
          </Grid.Column>
          <Grid.Column>
            <p><b>Securities</b><br />{CAMPAIGN_KEYTERMS_SECURITIES[KeyTerms.securities]}</p>
          </Grid.Column>
          <Grid.Column>
            <p><b>Offering Amount</b><br />{`Min. $${KeyTerms.minOfferingAmount}, to max. $${KeyTerms.maxOfferingAmount}`}</p>
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
                <p>$250,000</p>
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5}><b>Offering Max{' '}</b>
                <Popup trigger={<Icon name="help circle" color="green" />} content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor" position="bottom center" />
              </Table.Cell>
              <Table.Cell>
                <p>$1,000,000</p>
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5}><b>Min Individual Investment{' '}</b>
                <Popup trigger={<Icon name="help circle" color="green" />} content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor" position="bottom center" />
              </Table.Cell>
              <Table.Cell>
                <p>$100</p>
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5}><b>Investment Multiple{' '}</b>
                <Popup trigger={<Icon name="help circle" color="green" />} content="For every $100 you invest, you are paid a portion of this company's gross revenue every month until you are paid $XXX within YY months. A 1.0% service fee is deducted from each payment." position="bottom center" />
              </Table.Cell>
              <Table.Cell>
                <p><b>{KeyTerms.investmentMultiple}</b></p>
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
                <p>
                  <b>{KeyTerms.maturity} Months,</b>
                  including a 6 month startup period for ramp up
                </p>
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
                <p><b>{KeyTerms.frequencyOfPayments}</b></p>
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5}><b>Security Interest{' '}</b>
                <Popup trigger={<Icon name="help circle" color="green" />} content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor" position="bottom center" />
              </Table.Cell>
              <Table.Cell>
                <p>{KeyTerms.securityInterest}</p>
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5}>
                <b>Ownership % Represented by Securities</b>
              </Table.Cell>
              <Table.Cell>
                <p>
                  <b>{KeyTerms.securitiesOwnershipPercentage}%.</b>
                  Investors will not receive any equity interests in the Issuer or
                  any voting or management rights with respect to the Issuer as a result of
                  an investment in Securities.
                </p>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        {!isMobile &&
          <Divider />
        }
        <Header as="h5" className="center-align">
          <Link to="keyterms/summary" target="_blank">
            View the Issuer&apos;s SEC Form C filing
          </Link>
        </Header>
      </Modal.Content>
    );
  }
}

export default RevenueSharingKeyTerms;
