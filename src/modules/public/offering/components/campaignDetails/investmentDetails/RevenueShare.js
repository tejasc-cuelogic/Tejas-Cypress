import React, { Component } from 'react';
import { Popup, Icon, Header, Grid, Divider, Table, List, Accordion } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import NSImage from '../../../../../shared/NSImage';

export default class RevenueShare extends Component {
  state = { activeIndex: 0 }

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  }
  render() {
    const { activeIndex } = this.state;
    return (
      <div className="campaign-content-wrapper investment-wrapper">
        <Header as="h3">Use of Proceeds</Header>
        <Grid stackable columns={2}>
          <Grid.Column>
            <p>
            BuffBrew expects the complete buildout of the new building and brewery to be a
            $14 million project. The scope of the Buffbrew Taproom is $3.4 million. Buffbrew
            is committed to financing the total project, while opening up a portion of the
            financing for BuffBrew Taproom through NextSeed.
            </p>
            <p>100% of the funding proceeds will be used towards the buildout of the new
            Buffbrew Taproom facility. The spend includes construction as well as the
            purchasing of equipment, furniture and supplies.
            </p>
          </Grid.Column>
          <Grid.Column>
            <NSImage path="Object.jpg" />
          </Grid.Column>
        </Grid>
        <Header as="h3">Key Terms</Header>
        <Grid columns={3} divided className="investment-terms">
          <Grid.Row>
            <Grid.Column>
              <p><b>Issuer</b></p>
              <p>Buffbrew Taproom, LLC</p>
            </Grid.Column>
            <Grid.Column>
              <p><b>Securities</b></p>
              <p>Revenue Sharing Notes</p>
            </Grid.Column>
            <Grid.Column>
              <p><b>Offering Amount</b></p>
              <p>Min. $250,000, to max. $1,000,000</p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Table basic="very">
          <Table.Body>
            <Table.Row verticalAlign="top">
              <Table.Cell width={5}><b>Investment Multiple</b>
                <Popup trigger={<Icon name="help circle" color="green" />} content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor" position="bottom center" />
              </Table.Cell>
              <Table.Cell>
                <p><b>1.70x to 1.90x</b></p>

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
            <Table.Row verticalAlign="top" >
              <Table.Cell width={5}><b>Payments</b>
                <Popup trigger={<Icon name="help circle" color="green" />} content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor" position="bottom center" />
              </Table.Cell>
              <Table.Cell>
                <p><b>Monthly</b></p>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
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
              <Table.Cell width={5}><b>Maturity</b>
                <Popup trigger={<Icon name="help circle" color="green" />} content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor" position="bottom center" />
              </Table.Cell>
              <Table.Cell>
                <p><b>78 Months,</b> including a 6 month startup period for ramp up</p>
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
          <Header as="h3">Revenue Sharing Summary*</Header>
          <p>
          This investment has a 6-month startup period during which no cash payments will
          be made. The startup period commences the first full month after the offering’s
          close.
          </p>
          <p>
          After the end of the startup period or once the Issuer commences operations
          (whichever comes later), the Issuer will share a percentage of each month’s gross
          revenue with the investors as a group until they are paid in full. The total amount
          raised by the offering will determine the Investment Multiple and the monthly
          Revenue Sharing Percentage.
          </p>
          <p className="mt-30"><b>Total Raise Amount: $250,000–$400,000</b></p>
          <List as="ul" bulleted className="mb-30">
            <List.Item as="li">Investment Multiple: 1.70x</List.Item>
            <List.Item as="li">Monthly Revenue Sharing Percentage (first year): 4.0%</List.Item>
            <List.Item as="li">Monthly Revenue Sharing Percentage (years 2–6): 4.0%</List.Item>
          </List>
          <p><b>Total Raise Amount: $400,100–$600,000</b></p>
          <List as="ul" bulleted className="mb-30">
            <List.Item as="li">Investment Multiple: 1.70x</List.Item>
            <List.Item as="li">Monthly Revenue Sharing Percentage (first year): 4.0%</List.Item>
            <List.Item as="li">Monthly Revenue Sharing Percentage (years 2–6): 7.0%</List.Item>
          </List>
          <p><b>Total Raise Amount: $600,100–$800,000</b></p>
          <List as="ul" bulleted className="mb-30">
            <List.Item as="li">Investment Multiple: 1.80x</List.Item>
            <List.Item as="li">Monthly Revenue Sharing Percentage (first year): 4.0%</List.Item>
            <List.Item as="li">Monthly Revenue Sharing Percentage (years 2–6): 10.25%</List.Item>
          </List>
          <p><b>Total Raise Amount: $800,100–$1,000,000</b></p>
          <List as="ul" bulleted>
            <List.Item as="li">Investment Multiple: 1.90x</List.Item>
            <List.Item as="li">Monthly Revenue Sharing Percentage (first year): 4.0%</List.Item>
            <List.Item as="li">Monthly Revenue Sharing Percentage (years 2–6): 13.5%</List.Item>
          </List>
          <p>
          Each investor will receive its proportionate share of the monthly payments made
          to the investors as a group.
          </p>
        </section>
        <Accordion className="faq-accordion">
          <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
            Scenario 1
            <Icon className="ns-chevron-down" />
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
            <Grid centered className="mt-30 mb-30">
              <Grid.Column width={6} textAlign="center">
                <p><b>Total Raise Amount:</b></p>
                <p>$1,000,000</p>
              </Grid.Column>
              <Grid.Column width={6} textAlign="center">
                <p><b>You Invest:</b></p>
                <p>$1,000,000</p>
              </Grid.Column>
            </Grid>
            <p>
            Based on the Total Raise Amount, the Issuer will share 4.0% of its revenues
            for the first 12 months of operations and then 7.0% of revenues thereafter,
            until the 1.70x Investment Multiple is reached.
            </p>
            <p className="mb-30">
            Let’s assume that the Issuer generated $100,000 in revenues in month 9. The
            issuer will make a $4,000 payment ($100,000 x 4% = $4,000) to investors.
            Since you invested with 1% of the total amount raised ($5,000 / $500,000 =
            1.0%), you would receive a $40 payment.
            </p>
          </Accordion.Content>

          <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick}>
            Scenario 2
            <Icon className="ns-chevron-down" />
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 1} />
        </Accordion>
        <p className="note">
        * The calculations above are mathematical illustration only and may not reflect
        actual performance. They do not take into account NextSeed fees of 1% on each
        payment made to investors... <Link to="/">Read More</Link>
        </p>
      </div>
    );
  }
}
