import React, { Component } from 'react';
import { Popup, Icon, Header, Grid, Image, Divider, Table, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import object from '../../../../../../assets/images/Object.jpg';
import PaymentCalculator from './PaymentCalculator';

export default class TermNote extends Component {
  render() {
    return (
      <div className="campaign-about-wrapper investment-wrapper">
        <Header as="h3">Use of Proceeds</Header>
        <Grid stackable columns={2}>
          <Grid.Column>
            <p>
            The buildout and launch of America Gardens in East Midtown Houston is estimated
            at $1.8 million.
            </p>
            <p>
            Jonathan Serrano and Shawn Rao have raised equity commitments of $1,800,000
            (contributed cash of $750,000) in equity for the project thus far. Through
            the NextSeed campaign, the business is seeking to raise between $200,000 and
            $1,000,000 to complete construction. Upon completion of the NextSeed campaign,
            the equity commitments will cover any remaining balance of the project cost.
            </p>
          </Grid.Column>
          <Grid.Column>
            <Image src={object} />
          </Grid.Column>
        </Grid>
        <Header as="h3">Key Terms</Header>
        <Grid columns={3} divided className="investment-terms">
          <Grid.Row>
            <Grid.Column>
              <p><b>Issuer</b></p>
              <p>A Gard Midtown, LLC</p>
            </Grid.Column>
            <Grid.Column>
              <p><b>Securities</b></p>
              <p>Term Notes</p>
            </Grid.Column>
            <Grid.Column>
              <p><b>Offering Amount</b></p>
              <p>Min. $250,000, to max. $1,000,000</p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Table basic="very">
          <Table.Body>
            <Table.Row verticalAlign="top" >
              <Table.Cell width={5}><b>Payments</b>
                <Popup trigger={<Icon name="help circle" color="green" />} content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor" position="bottom center" />
              </Table.Cell>
              <Table.Cell>
                <p><b>Monthly</b></p>
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5}><b>Maturity</b>
                <Popup trigger={<Icon name="help circle" color="green" />} content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor" position="bottom center" />
              </Table.Cell>
              <Table.Cell>
                <p><b>60 Months</b></p>
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5}><b>Security Interest</b>
                <Popup trigger={<Icon name="help circle" color="green" />} content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor" position="bottom center" />
              </Table.Cell>
              <Table.Cell>
                <p>Blanket lien on all assets of the business</p>
              </Table.Cell>
            </Table.Row>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5}>
                <b>Ownership % Represented by Securities</b>
              </Table.Cell>
              <Table.Cell>
                <p>
                  <b>0%.</b> Investors will not receive any equity interests in the Issuer or
                  any voting or management rights with respect to the Issuer as a result of
                  an investment in Securities.
                </p>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <Divider />
        <Header as="h5" className="center-align">
          <Link to="/">
            View the Issuer&apos;s SEC Form C filing
          </Link>
        </Header>
        <section>
          <Header as="h3">Total payment calculator</Header>
          <Grid columns={4} divided className="investment-terms">
            <Grid.Row>
              <Grid.Column>
                <p>Principal</p>
                <Dropdown text="$100" large>
                  <Dropdown.Menu>
                    <Dropdown.Item text="$200" />
                    <Dropdown.Item text="$300" />
                    <Dropdown.Item text="$400" />
                  </Dropdown.Menu>
                </Dropdown>
              </Grid.Column>
              <Grid.Column>
                <p>Interest Rate*</p>
                <Header as="h4">16.00%</Header>
              </Grid.Column>
              <Grid.Column>
                <p>Term</p>
                <Header as="h4">60 months</Header>
              </Grid.Column>
              <Grid.Column>
                <p>Total Payment*</p>
                <Header as="h4" color="green">$146</Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <PaymentCalculator />
            </Grid.Row>
          </Grid>
        </section>
        <p className="note">
        * Payment for any given month (including the total payment at the end of the final
        month) indicates the cumulative amount contractually required to be paid to an
        investor after the end of that month, assuming the loan is not prepaid. This
        calculation is a mathematical illustration only and may not reflect actual
        performance. It does not take into account NextSeed fees of 1% on each payment made
        to investors. Payment is not guaranteed or insured and investors may lose some or
        all of the principal invested if the Issuer cannot make its payments.
        </p>
      </div>
    );
  }
}
